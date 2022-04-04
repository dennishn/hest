import { getOrigin, getPathname } from "./common/helpers/req.helper";
import { Request } from "express";
import { CorsOptions } from "cors";

export const corsOptionsDelegateFactory = (corsSettings: any) => {
	return (
		req: Request,
		callback: (error: Error | null, options: CorsOptions) => void
	) => {
		const cors_options: CorsOptions = {
			methods: corsSettings.allowedMethods,
			credentials: corsSettings.allowedCredentials,
			origin: false,
		};
		let error: Error | null = null;

		const origin = getOrigin(req);
		const url = getPathname(req) as string;

		if (
			!origin ||
			!corsSettings.allowedOrigins.length ||
			corsSettings.allowedOrigins.indexOf(origin) !== -1
		) {
			cors_options.origin = true;
			error = null;
		} else if (
			corsSettings.allowedUrls.length &&
			corsSettings.allowedUrls.indexOf(url) !== -1
		) {
			cors_options.origin = true;
			error = null;
		} else {
			cors_options.origin = false;
		}

		callback(error, cors_options);
	};
};
