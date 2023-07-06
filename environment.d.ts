declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT: string;
      DB_URI: string;
      SECRET: string;
      INACTIVE_USERS_EXPIRES_SECONDS: string;
      JWT_EXPIRE_TIME: string;
      GMAIL_USER: string;
      GMAIL_PASS: string;
      MAX_POST_CAPTION_LENGTH: string;
      DOMAIN: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
