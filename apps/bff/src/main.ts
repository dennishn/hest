import helmet from "helmet";
import { corsOptionsDelegateFactory } from "./cors.option";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { json, urlencoded } from "body-parser";
import { AppModule } from "./app.module";
import configuration from "./config/configuration";
import fetch from "cross-fetch";
globalThis.fetch = fetch;

const appSettings = configuration()["APP_SETTINGS"];

async function bootstrap() {
	const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
		bodyParser: true,
		logger: false,
	});

	app.use(json({ limit: appSettings.bodyLimit }));

	app.use(
		urlencoded({
			limit: appSettings.bodyLimit,
			extended: true,
			parameterLimit: appSettings.bodyParameterLimit,
		})
	);

	app.use(
		helmet({
			contentSecurityPolicy: appSettings.contentSecurityPolicy,
			crossOriginEmbedderPolicy: appSettings.crossOriginEmbedderPolicy,
		})
	);

	app.enableCors(corsOptionsDelegateFactory(configuration()["CORS_SETTINGS"]));

	await app.listen(appSettings.port);
}

bootstrap()
	.then(() =>
		console.log(`ECCO BFF Server listening on port ${appSettings.port}`)
	)
	.catch((e) => {
		console.error(e);
	});
