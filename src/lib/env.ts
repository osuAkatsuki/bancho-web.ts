/** Build-time configuration with sensible defaults for local dev. */
export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "bancho.py",
  banchoDomain: import.meta.env.VITE_BANCHO_DOMAIN ?? "cmyui.xyz",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  avatarsBaseUrl:
    import.meta.env.VITE_AVATARS_BASE_URL ??
    `https://a.${import.meta.env.VITE_BANCHO_DOMAIN ?? "cmyui.xyz"}`,
} as const;
