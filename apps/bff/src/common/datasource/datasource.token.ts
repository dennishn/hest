import { fetch as crossFetch } from "cross-fetch";
import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceSettings } from "./types/datasource";

export default class TokenDataSource implements DataSource {
	authToken?: string;
	namespace: string;
	url: string;

	constructor(
		private readonly config: DataSourceSettings,
		private readonly configService: ConfigService
	) {
		this.authToken = this.configService.get(config.authEnvToken);
		this.url = this.config.url;
		this.namespace = this.config.namespace;
	}

	async fetch(query: any, variables: any): Promise<any> {
		const fetchResult = await crossFetch(this.url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query, variables }),
		});

		return fetchResult.json();
	}
}
