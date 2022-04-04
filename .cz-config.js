module.exports = {
	types: [
		{ value: "feat", name: "feat:          A new feature" },
		{ value: "fix", name: "fix:           A bug fix" },
		{
			value: "WIP",
			name: "WIP:           Work in progress (don't forget to squash!)",
		},
		{
			value: "refactor",
			name: "refactor:      A code change that neither fixes a bug nor adds a feature",
		},
		{
			value: "tooling",
			name: "tooling:       Changes to the build process or auxiliary tools\n                 and libraries such as documentation generation",
		},
		{ value: "docs", name: "docs:          Documentation only changes" },
		{
			value: "style",
			name: "style:         Changes that do not affect the meaning of the code\n                 (white-space, formatting, missing semi-colons, etc)",
		},
		{
			value: "other",
			name: "other:         None of the above (last resort)",
		},
	],
	// scopes: [
	// 	{
	// 		name: "BFF",
	// 	},
	// 	{
	// 		name: "SDK",
	// 	},
	// 	{
	// 		name: "UI",
	// 	},
	// 	{
	// 		name: "CF - Algolia",
	// 	},
	// 	{
	// 		name: "CF - Commercetools",
	// 	},
	// ],
	allowBreakingChanges: ["feat", "fix"],
	skipQuestions: ["footer"],
	messages: {
		customScope:
			"Denote the SCOPE of this change (optional) https://www.google.com :",
		ticketNumber:
			"Enter the Jira ticket number excluding project prefix (optional):",
	},
	//
	allowTicketNumber: true,
	ticketNumberPrefix: "GLOBALCOM-",
	allowCustomScopes: true,
	disableScopeLowerCase: true,
};
