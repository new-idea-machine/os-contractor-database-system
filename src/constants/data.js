const techDataSchema = {
	id: '',
	name: '',
	profileImg: '',
	email: '',
	otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: '',
	},
	summary: '',
	skills: [{ skill: '' }, { skill: '' }, { skill: '' }, { skill: '' }],
	interests: [{ interest: '' }, { interest: '' }, { interest: '' }],
	projects: [
		{
			projectName: '',
			techStack: [{ tech: '' }],
			role: '',
			description: '',
		},
		{
			projectName: '',
			techStack: [{ tech: '' }],
			role: '',
			description: '',
		},
		{
			projectName: '',
			techStack: [{ tech: '' }],
			role: '',
			description: '',
		},
	],
};

const formInputs = [
	{
		sectionTitle: 'Personal Info',
		fields: [
			{ name: 'name', label: 'Name', type: 'text' },
			{ name: 'email', label: 'Email', type: 'email' },
		],
	},
	{
		sectionTitle: 'Technical Info',
		fields: [
			{ name: 'projectName', label: 'Project Name', type: 'text' },
			{ name: 'description', label: 'Description', type: 'text' },
		],
	},
	{
		sectionTitle: 'Other Info',
		fields: [
			{ name: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
			{ name: 'githubUrl', label: 'GitHub URL', type: 'text' },
		],
	},
];

export { techDataSchema, formInputs };
