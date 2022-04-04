import { TokenProvider } from "@commercetools/sdk-auth";

export interface useCommercetoolsTokenProvider {
	tokenProvider: typeof TokenProvider;
	getAuthToken: () => Promise<any>;
	login: (username: string, password: string) => void;
	logout: () => void;
	anonymousToken?: string;
	authenticatedToken?: string;
}
