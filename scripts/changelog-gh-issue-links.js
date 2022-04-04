"use strict";
const replace = require("replace");
const path = require("path");

replace({
	regex: /#[1-9]\d*\b/,
	replacement: "$1",
	paths: [path.resolve(process.cwd(), "CHANGELOG.md")],
	recursive: false,
	silent: false,
});
