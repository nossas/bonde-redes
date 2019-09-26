declare namespace NodeJS {
  export interface ProcessEnv {
    ZENDESK_API_URL: string
    ZENDESK_API_TOKEN: string
    ZENDESK_API_USER: string
    GOOGLE_MAPS_API_KEY: string
    HASURA_API_URL: string
    X_HASURA_ADMIN_SECRET: string
    COMMUNITY_ID: string
  }
}
