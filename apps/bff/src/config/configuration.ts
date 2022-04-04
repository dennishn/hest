import defaultConfiguration from "./configuration.default";

import devDatasources from "./development/datasources.development";
import devConfiguration from "./development/configuration.development";

import prodDatasources from "./production/datasources.production";
import prodConfiguration from "./production/configuration.production";

const ENV = process.env.NODE_ENV;

let configuration = defaultConfiguration();

if (ENV === "production") {
	configuration = {
		...configuration,
		...prodConfiguration,
		...prodDatasources,
	};
} else {
	configuration = {
		...configuration,
		...devConfiguration(),
		...devDatasources(),
	};
}

const Configuration = () => ({
	...configuration,
});

export default Configuration;
