import { useEffect } from "react";

import { env } from "@/lib/env";

export function usePageTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} · ${env.appName}` : env.appName;
    return () => {
      document.title = env.appName;
    };
  }, [title]);
}
