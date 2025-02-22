export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
       CONTENT_ROOT?: string;
       TRANSLATED_CONTENT_ROOT?: string;
       BROWSER_COMPAT_DATA_ROOT?: string;
       DATA_ROOT?: string;
    }
  }
}
