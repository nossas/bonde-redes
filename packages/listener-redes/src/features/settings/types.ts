interface Settings {
	id: number
	settings: any
	community_id: number
}

interface SettingsDataResponse {
	rede_settings: Settings[]
}

export interface SettingsResponse {
	data: SettingsDataResponse
}
