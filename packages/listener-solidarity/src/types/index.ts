interface Settings {
  id: number;
  settings: any;
  community_id: number;
}

interface SettingsDataResponse {
  rede_settings: Settings[];
}

export interface SettingsResponse {
  data: SettingsDataResponse;
}

export interface Widget {
  id: number;
  organization_id: number;
  metadata: {
    form_mapping: Array<{ uid: string; name: string }>;
  };
}
