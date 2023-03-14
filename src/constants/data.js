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
			{ name: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
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
		sectionTitle: 'Technical Info',
		fields: [
			{
				name: 'projectName',
				label: 'Project Name',
				type: 'text',
				placeholder: 'Project Name',
			},
			{
				name: 'description',
				label: 'Description',
				type: 'text',
				placeholder: 'Project Description',
			},
			{ name: 'skill', label: 'Skill', type: 'text', placeholder: 'Skill' },
		],
	},
	{
		sectionTitle: 'About Info',
		fields: [
			{
				name: 'summary',
				label: 'Summary',
				type: 'text',
				placeholder: 'Summary',
			},
			{
				name: 'interest',
				label: 'Interest',
				type: 'text',
				placeholder: 'Interest',
			},
		],
	},
];

export { techDataSchema, formInputs };
