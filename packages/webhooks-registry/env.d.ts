declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DEBUG: string
    HASURA_API_URL: string
    HASURA_TABLE_NAME: string
    X_HASURA_ADMIN_SECRET: string
  }
}
