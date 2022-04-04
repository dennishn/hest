import { em } from "polished";

export const mapPxToEm = (
	values:
		| string
		| number
		| Array<string | number>
		| Record<string, string | number>,
	base: string | number = "16px"
): string | string[] | Record<string, string> => {
	if (Array.isArray(values)) {
		return values.map((value) => em(value, base));
	}

	if (typeof values === "object" && values !== null) {
		return Object.assign(
			{},
			...Object.entries(values).map(
				([key, value]: [string, string | number]) => ({
					[key]: em(value, base),
				})
			)
		);
	}

	return em(values, base);
};
