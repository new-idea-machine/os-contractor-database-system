const techDataSchema = {
	firstName: '',
	lastName: '',
	email: '',
	summary: '',
	profileImg: '',
	otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: '',
	},
	skills: [{ skill: '' }],
	projects: [
		{
			projectName: '',
			description: '',
		},
	],
};

const formInputs = [
	{
		sectionTitle: 'Personal Info',
		fields: [
			{ 
				name: 'firstName', 
				label: 'First Name', 
				type: 'text', 
				placeholder: 'Name' },
			{
				name: 'lastName',
				label: 'Last Name',
				type: 'text',
				placeholder: 'Last Name',
			},
			{ name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
			{
				name: 'linkedinUrl',
				label: 'LinkedIn URL',
				type: 'text',
				placeholder: 'LinkedIn URL',
			},
			{
				name: 'githubUrl',
				label: 'GitHub URL',
				type: 'text',
				placeholder: 'GitHub URL',
			},
		],
	},
	{
		sectionTitle: 'About Info',
		fields: [
			{
				name: 'summary',
				label: 'Summary',
				type: 'textArea',
				placeholder: 'Summary',
			},
			// {
			// 	name: 'interest',
			// 	label: 'Interest',
			// 	textArea: 'true',
			// 	placeholder: 'Interest',
			// },
		],
	},
];

export { techDataSchema, formInputs };
