declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DEBUG: string
    JWT_TOKEN: string
    HASURA_SECRET: string
    GRAPHQL_HTTP_URL: string
  }
}