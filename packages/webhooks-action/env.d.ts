declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DEBUG: string
    JWT_TOKEN: string
    GRAPHQL_HTTP_URL: string
    GRAPHQL_WS_URL: string
  }
}
