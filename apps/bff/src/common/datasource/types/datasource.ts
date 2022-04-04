export interface DataSource {
	namespace: string;
	fetch(query: any, variables: any, context: any): Promise<any>;
}

export interface DataSources {
	readonly datasources: DataSourceSettings[];
}

export type DatasourceNamespace = "CF" | "CT";

export interface DataSourceSettings {
	name: string;
	url: string;
	strategy: "commercetools" | "token";
	accessTokenUrl?: string;
	authEnvToken: string;
	namespace: DatasourceNamespace;
	clientId?: string;
	clientSecret?: string;
	scopes: string[];
	projectKey?: string;
	refreshToken?: string;
}
