declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG: string
    HASURA_API_URL: string
    X_HASURA_ADMIN_SECRET: string
  }
}
