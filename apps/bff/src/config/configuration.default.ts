const Configuration = () => ({
	APP_SETTINGS: {
		port: 8080,
		bodyLimit: "50mb",
		bodyParameterLimit: 50000000,
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	},
	CORS_SETTINGS: {
		allowedOrigins: [],
		allowedUrls: [],
		allowedPaths: [],
		allowedMethods: ["GET", "POST", "OPTIONS"],
		allowedCredentials: true,
	},
	GRAPHQL_SETTINGS: {
		playground: true,
		debug: true,
		introspection: true,
		installSubscriptionHandlers: true,
		typePaths: ["./**/*.graphql"],
	},
});

export default Configuration;
