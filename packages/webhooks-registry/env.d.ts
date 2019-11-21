declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DEBUG: string
    HASURA_API_URL: string
    HASURA_TABLE_NAME: string
    X_HASURA_ADMIN_SECRET: string
    ELASTIC_APM_SERVICE_NAME: string
    ELASTIC_APM_SECRET_TOKEN: string
    ELASTIC_APM_SERVER_URL: string
  }
}
