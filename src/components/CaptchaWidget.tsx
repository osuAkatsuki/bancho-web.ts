import { useEffect, useRef } from "react";

import { env, type CaptchaProvider } from "@/lib/env";

/** The explicit-render api shared by reCAPTCHA, hCaptcha & Turnstile. */
interface CaptchaApi {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string;
      theme: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
    },
  ) => string | number;
}

declare global {
  interface Window {
    grecaptcha?: CaptchaApi;
    hcaptcha?: CaptchaApi;
    turnstile?: CaptchaApi;
  }
}

const PROVIDER_SCRIPTS: Record<CaptchaProvider, string> = {
  recaptcha: "https://www.google.com/recaptcha/api.js?render=explicit",
  hcaptcha: "https://js.hcaptcha.com/1/api.js?render=explicit",
  turnstile: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
};

function getProviderApi(provider: CaptchaProvider): CaptchaApi | undefined {
  if (provider === "recaptcha") return window.grecaptcha;
  if (provider === "hcaptcha") return window.hcaptcha;
  return window.turnstile;
}

function ensureScriptLoaded(provider: CaptchaProvider) {
  const src = PROVIDER_SCRIPTS[provider];
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

interface CaptchaWidgetProps {
  onToken: (token: string | null) => void;
}

/**
 * Renders the captcha widget for the configured provider, or nothing
 * when captcha is disabled. Calls `onToken` when the player completes
 * (or when the token expires, with null).
 */
export function CaptchaWidget({ onToken }: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const provider = env.captchaProvider;

  useEffect(() => {
    if (provider === null || !env.captchaSiteKey) return;

    ensureScriptLoaded(provider);

    // poll until the provider's script has initialized, then render
    const interval = setInterval(() => {
      const providerApi = getProviderApi(provider);
      const container = containerRef.current;
      if (!providerApi?.render || !container || renderedRef.current) return;

      renderedRef.current = true;
      clearInterval(interval);
      providerApi.render(container, {
        sitekey: env.captchaSiteKey,
        theme: "dark",
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
      });
    }, 100);

    return () => clearInterval(interval);
  }, [provider]);

  if (provider === null || !env.captchaSiteKey) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
