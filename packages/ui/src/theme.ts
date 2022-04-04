import {
	ThemeConfig,
	ThemeDirection,
	extendTheme,
	ChakraTheme,
	RecursiveObject,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

import colors from "./design-tokens/01.colors/colors";
import {
	fontFamilies,
	fontWeights,
	lineHeights,
	letterSpacings,
	fontSizes,
} from "./design-tokens/02.typography";
import space from "./design-tokens/03.space/space";
import sizes from "./design-tokens/04.sizes/sizes";
import radii from "./design-tokens/05.radii/radii";
import borders from "./design-tokens/06.borders/borders";
import opacities from "./design-tokens/07.opacities/opacities";
import shadows from "./design-tokens/08.shadows/shadows";
import breakpoints from "./design-tokens/09.breakpoints/breakpoints";
import zIndices from "./design-tokens/10.z-indices/z-indices";
import aspectRatios from "./design-tokens/11.aspect-ratios/aspect-ratios";
import transition from "./design-tokens/12.transitions/transitions";

interface ExtendedChakraTheme extends ChakraTheme {
	opacities: RecursiveObject;
	aspectRatios: RecursiveObject;
}

export const PX_BASE = "16px";

export const HEST = "D";

const direction: ThemeDirection = "ltr";

const config: ThemeConfig = {
	useSystemColorMode: false,
	initialColorMode: "light",
	cssVarPrefix: "ec",
};

const theme: ExtendedChakraTheme = {
	config,
	direction,
	//
	breakpoints: createBreakpoints(breakpoints),
	//
	colors,
	fonts: fontFamilies,
	fontSizes,
	fontWeights,
	letterSpacings,
	lineHeights,
	space,
	sizes,
	radii,
	borders,
	shadows,
	zIndices,
	transition,
	//
	opacities,
	aspectRatios,
	//
	components: {},
	styles: {},
};

export default extendTheme(theme);
