const withTM = require("next-transpile-modules")(["ui", "sdk"]);

module.exports = withTM({
  reactStrictMode: true,
});
