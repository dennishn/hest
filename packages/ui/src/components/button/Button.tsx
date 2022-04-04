import * as React from "react";

import { Box, ThemeTypings } from "@chakra-ui/react";

type ButtonProps = {
	color?: ThemeTypings["colors"];
};

const Button = ({ color = "purple.700" }: ButtonProps) => (
	<Box sx={{ color: "" }}>
		<button>This is a design system button</button>
	</Box>
);

export { Button };
