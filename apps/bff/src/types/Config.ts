export interface AppConfig {
	readonly port: number;
	readonly bodyLimit: string;
	readonly bodyParameterLimit: number;
	readonly contentSecurityPolicy: boolean;
	readonly crossOriginEmbedderPolicy: boolean;
}

export interface GraphQLConfig {
	readonly playground: boolean;
	readonly debug: boolean;
	readonly introspection: boolean;
	readonly installSubscriptionHandlers: boolean;
	readonly typePaths: string[];
}

export interface CorsConfig {
	readonly allowedOrigins: string[];
	readonly allowedUrls: string[];
	readonly allowedPaths: string[];
	readonly allowedMethods: string[];
	readonly allowedCredentials: boolean;
}

export type DataSourceNamespace = "CF" | "CT";

export interface DataSourceConfig {
	name: string;
	url: string;
	sourceHeaders: {
		Authorization: string;
	};
	namespace: DataSourceNamespace;
}

export interface DataSourcesConfig {
	readonly datasources: DataSourceConfig[];
}
