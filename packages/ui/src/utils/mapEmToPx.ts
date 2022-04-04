import { relativeToPx } from "@utils/relativeToPx";

export const mapEmToPx = (
	values:
		| string
		| number
		| Array<string | number>
		| Record<string, string | number>,
	base: string | number = "16px"
): string | string[] | Record<string, string> => {
	if (Array.isArray(values)) {
		return values.map((value) => relativeToPx(value, base));
	}

	if (typeof values === "object" && values !== null) {
		return Object.assign(
			{},
			...Object.entries(values).map(
				([key, value]: [string, string | number]) => ({
					[key]: relativeToPx(value as string, base as string),
				})
			)
		);
	}

	return relativeToPx(values as string, base as string);
};
