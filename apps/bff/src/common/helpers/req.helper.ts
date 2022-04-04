import { Request } from "express";

export function getUrl(req: Request): URL {
	return new URL(req.originalUrl || req.url || req.baseUrl || "");
}

export function getPathname(req: Request): string | null {
	try {
		return getUrl(req).pathname;
	} catch (error) {
		return null;
	}
}

export function getOrigin(req: Request) {
	const origin = req.headers.origin;

	if (!origin || typeof origin === "string") {
		return origin as string;
	}

	return origin[0];
}
