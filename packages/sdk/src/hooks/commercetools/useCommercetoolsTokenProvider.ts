/**
 * @file Creates a token provider that uses the commercetools client to fetch tokens.
 *
 * This file is an adaptation of the auth provider in Commercetools own demo SPA
 * https://github.com/commercetools/sunrise-spa/blob/master/src/auth.js
 */
import SdkAuth, {
	ICommercetoolsTokenProviderConfig,
	IUserCredentials,
	TokenProvider,
	TokenProviderOptions,
} from "@commercetools/sdk-auth";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";

const ANONYMOUS = "ANONYMOUS";
const PASSWORD = "PASSWORD";
const REFRESH_USER = "REFRESH_USER";
const REFRESH_ANONYMOUS = "REFRESH_ANONYMOUS";

interface IToken {
	refresh_token?: string;
}

const anonymousTokenAtom = atomWithImmer<IToken | null>(null);
const authenticatedTokenAtom = atomWithImmer<IToken | null>(null);

/**
 * Helper function adapted from Commercetools.
 */
const group =
	(
		fn: (...args: any[]) => any,
		groups = new Map(),
		cache = true,
		getKey = (args: any[]) => JSON.stringify(args)
	) =>
	(...args: any[]) => {
		const key = getKey(args);
		const existing = groups.get(key);
		if (existing) {
			return existing;
		}
		const result = fn(...args);
		result.then(
			() => !cache && groups.delete(key),
			() => !cache && groups.delete(key)
		);
		groups.set(key, result);
		return result;
	};

// The token provider that uses the commercetools client to fetch tokens.
let tokenProvider: TokenProvider;

export const useCommercetoolsTokenProvider = (
	config: ICommercetoolsTokenProviderConfig
) => {
	const [anonymousToken, setAnonymousToken] = useAtom(anonymousTokenAtom);
	const [authenticatedToken, setAuthenticatedToken] = useAtom(
		authenticatedTokenAtom
	);

	const getAuthToken = group(
		(error: boolean) =>
			getToken(error, 0).then(
				(tokenInfo) => `${tokenInfo.token_type} ${tokenInfo.access_token}`
			),
		new Map(),
		false,
		() => "getAuthToken"
	);

	// Changes the token provider to use "customer password flow".
	const login = (credentials: IUserCredentials) => {
		tokenProvider.fetchTokenInfo = (sdkAuth) =>
			sdkAuth.customerPasswordFlow(credentials);
		tokenProvider.flowType = PASSWORD;
		tokenProvider.invalidateTokenInfo();
	};

	// Changes the token provider to use "anonymous flow" and resets the auth token.
	const logout = () => {
		tokenProvider.fetchTokenInfo = (sdkAuth) => sdkAuth.anonymousFlow();
		tokenProvider.flowType = ANONYMOUS;
		tokenProvider.invalidateTokenInfo();
		return setAuthenticatedToken(null);
	};

	// Will try to create a new token or refresh the existing one.
	const getToken = async (error: boolean, tries: number): Promise<any> => {
		let promise;
		tries++;
		if (tries > 2) {
			return Promise.reject(new Error("Unable to get token"));
		}
		if (error) {
			if (
				tokenProvider.flowType === REFRESH_ANONYMOUS ||
				tokenProvider.flowType === REFRESH_USER
			) {
				// This is a bit counter-intuitive; if the flowType is REFRESH_X and we are
				// in the error loop, it means that we have failed to refresh the token,
				// and we are going back to an anonymous session.
				tokenProvider.flowType = ANONYMOUS;
				tokenProvider.fetchTokenInfo = (sdkAuth) => sdkAuth.anonymousFlow();
				tokenProvider.invalidateTokenInfo();
				promise = tokenProvider.getTokenInfo();
			} else {
				// If a regular getTokenInfo has failed, and we are now in the error loop,
				// we will try to refresh the user or anonymous token.
				const refreshToken =
					authenticatedToken?.refresh_token || anonymousToken?.refresh_token;
				const isUserToken = refreshToken === authenticatedToken?.refresh_token;
				if (!refreshToken) {
					return getToken(true, tries);
				}
				tokenProvider.flowType = isUserToken ? REFRESH_USER : REFRESH_ANONYMOUS;
				tokenProvider.refreshToken = refreshToken;
				tokenProvider.fetchTokenInfo = (sdkAuth) =>
					sdkAuth.refreshTokenFlow(refreshToken);
				tokenProvider.invalidateTokenInfo();
				promise = tokenProvider.getTokenInfo();
			}
		} else {
			promise = tokenProvider.getTokenInfo();
		}
		return promise.catch((error) => {
			if (
				error.status === 400 &&
				error.error === "invalid_customer_account_credentials"
			) {
				// If the credentials are invalid, we will reset the session (using logout())
				// This will effectively just run through the anonymous flow and return the existing
				// anonymous token - in other words; do nothing.
				logout();
				return getToken(false, tries);
			}

			// @TODO - implement proper logging
			// eslint-disable-next-line no-console
			console.warn(
				"Could not connect to commercetools, cleaning up session...",
				error
			);
			return getToken(true, tries);
		});
	};

	tokenProvider = new TokenProvider(
		{
			sdkAuth: new SdkAuth(config),
			onTokenInfoChanged: (nextTokenInfo) => {
				const { refreshToken } = tokenProvider;
				if (
					tokenProvider.flowType === REFRESH_USER ||
					tokenProvider.flowType === REFRESH_ANONYMOUS
				) {
					// when refreshing token the token info is a different entity
					// and is missing the refresh_token
					nextTokenInfo = { ...nextTokenInfo, refresh_token: refreshToken };
				}
				if (
					tokenProvider.flowType === PASSWORD ||
					tokenProvider.flowType === REFRESH_USER
				) {
					return setAuthenticatedToken(nextTokenInfo);
				}
				return setAnonymousToken(nextTokenInfo);
			},
			fetchTokenInfo: (sdkAuth) => sdkAuth.anonymousFlow(),
		} as TokenProviderOptions,
		(authenticatedToken as boolean) || (anonymousToken as boolean)
	);
	tokenProvider.flowType = ANONYMOUS;

	return {
		tokenProvider,
		getAuthToken,
		login,
		logout,
		anonymousToken,
		authenticatedToken,
	};
};
