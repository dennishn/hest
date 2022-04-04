import {
	createAuthMiddlewareForAnonymousSessionFlow,
	createAuthMiddlewareWithExistingToken,
} from "@commercetools/sdk-middleware-auth";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createClient } from "@commercetools/sdk-client";
import { DataSourceSettings, DataSource } from "./types/datasource";
export default class CommercetoolsDataSource implements DataSource {
	token: string = "";
	namespace: string;
	url: string;
	accessTokenUrl?: string;
	refreshFetch: any;
	clientSecret?: string;
	clientId?: string;
	scopes: string[];
	projectKey?: string;
	refreshToken?: string;

	constructor(private readonly config: DataSourceSettings) {
		this.accessTokenUrl = this.config.accessTokenUrl;
		this.url = this.config.url;
		this.namespace = this.config.namespace;
		this.clientSecret = this.config.clientSecret;
		this.clientId = this.config.clientId;
		this.scopes = this.config.scopes;
		this.projectKey = this.config.projectKey;
		this.refreshToken = this.config.refreshToken;

		this.fetch = this.fetch.bind(this);
	}

	async fetch(query: any, variables: any, context: any): Promise<any> {
		const clientConfig = {
			middlewares: [] as any[],
		};

		if (context?.req?.headers?.ct_access_token) {
			clientConfig.middlewares.push(
				createAuthMiddlewareWithExistingToken(
					`Bearer ${context.req.headers.ct_access_token}`,
					{
						force: true,
						timeout: 10000, // timeout the request if it doesn't complete in 10000ms or 10 seconds
						getAbortController: () => new AbortController(),
					}
				)
			);
		} else {
			console.log(this.clientId, this.clientSecret);
			clientConfig.middlewares.push(
				createAuthMiddlewareForAnonymousSessionFlow({
					host: this.accessTokenUrl,
					projectKey: this.projectKey,
					credentials: {
						clientId: this.clientId,
						clientSecret: this.clientSecret,
					},
					scopes: this.scopes,

					timeout: 10000,
					getAbortController: () => new AbortController(),
				})
			);
		}

		clientConfig.middlewares.push(
			createHttpMiddleware({
				host: "https://api.europe-west1.gcp.commercetools.com",
				includeResponseHeaders: true,
				includeOriginalRequest: true,
				maskSensitiveHeaderData: true,
				enableRetry: true,
				retryConfig: {
					maxRetries: 2,
					retryDelay: 300, //milliseconds
					maxDelay: 5000, //milliseconds
					retryOnAbort: false,
				},
				scopes: this.scopes,
				timeout: 1000,
			})
		);

		const client = createClient(clientConfig);

		const request = {
			uri: new URL(this.url).pathname,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query, variables }),
		};

		const fetchResult = await client.execute(request);
		return fetchResult.body;
	}
}
