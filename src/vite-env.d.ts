/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_BANCHO_DOMAIN?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AVATARS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
