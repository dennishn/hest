import { rem } from "polished";

export const mapPxToRem = (
	values:
		| string
		| number
		| Array<string | number>
		| Record<string, string | number>,
	base: string | number = "16px"
): string | string[] | Record<string, string> => {
	if (Array.isArray(values)) {
		return values.map((value) => rem(value, base));
	}

	if (typeof values === "object" && values !== null) {
		return Object.assign(
			{},
			...Object.entries(values).map(
				([key, value]: [string, string | number]) => ({
					[key]: rem(value, base),
				})
			)
		);
	}

	return rem(values, base);
};
