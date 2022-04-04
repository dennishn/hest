export const relativeToPx = (
	value: string | number,
	base: string | number = "16px"
): string => {
	return `${parseFloat(base.toString()) * parseFloat(value.toString())}}`;
};
