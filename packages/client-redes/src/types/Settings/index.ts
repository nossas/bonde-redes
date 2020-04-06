export type Settings = {
  id: number
  settings: {
    volunteer_msg: string
    individual_msg: string
    distance
  }
  name: string
  version: string
};

export interface SettingsData {
  app_settings: Settings[];
}

export type SettingsVars = {
  communityId: number
};
