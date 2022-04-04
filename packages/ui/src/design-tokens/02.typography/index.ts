import fontFamilies from "./01.font-families/font-families";
import fontSizes from "./02.font-sizes/font-sizes";
import fontWeights from "./03.font-weights/font-weights";
import lineHeights from "./04.line-heights/line-heights";
import letterSpacings from "./05.letter-spacings/letter-spacings";

const typography = {
	fontWeights,
	lineHeights,
	letterSpacings,
	// Build up font-stacks from font-family tokens
	fonts: {
		body: `${fontFamilies.content}`,
		heading: `${fontFamilies.content}`,
		ui: `${fontFamilies.ui}`,
	},
	fontSizes,
};

export default typography;

export { fontFamilies, fontWeights, lineHeights, letterSpacings, fontSizes };
