import antfu from "@antfu/eslint-config";

// @ts-check
export default antfu({
	type: "lib",
	formatters: true,
	stylistic: {
		indent: "tab",
		quotes: "double",
		semi: true,
		overrides: {},
	},
});
