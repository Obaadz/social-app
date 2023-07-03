declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
      SECRET: string;
      PORT?: string;
      NODE_ENV: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
