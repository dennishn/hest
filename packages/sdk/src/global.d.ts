declare module "@commercetools/sdk-auth" {
	export interface TokenInfo {}
	export interface ICommercetoolsTokenProviderConfig {}
	export interface IUserCredentials {
		username: string;
		password: string;
	}
	export interface TokenProviderOptions {
		sdkAuth: SdkAuth;
		onTokenInfoChanged: (nextTokenInfo: TokenInfo) => Promise<TokenInfo>;
		fetchTokenInfo: (sdkAuth) => void;
	}
	export class TokenProvider {
		constructor(config: any, tokenInfo?: TokenInfo);
		fetchTokenInfo(sdkAuth: SdkAuth): Promise<TokenInfo>;
		flowType: string;
		invalidateTokenInfo(): void;
		getTokenInfo(): Promise<TokenInfo>;
		refreshToken?: string;
	}
	export default class SdkAuth {
		constructor(config: ICommercetoolsTokenProviderConfig);
		refreshTokenFlow: (refreshToken: string) => Promise<TokenInfo>;
		anonymousFlow(): Promise<TokenInfo>;
		customerPasswordFlow(credentials: IUserCredentials): Promise<TokenInfo>;
	}
}
