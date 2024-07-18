const techDataSchema = {
	userType: 'techs',
	firstName: '',
	lastName: '',
	email: '',
	qualification: '',
	summary: '',
	location: '',
	profileImg: '',
	otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: '',
	},
	availability:'',
	availabilityDetails: '',
	workSite: '',
	skills: [{ skill: '' }],
	projects: [
		{
			title: '',
			url: '',
			description: '',
		},
	],
};

const RecDataSchema ={
	userType: 'recruiter',
	firstName: '',
	lastName: '',
	email: '',
	qualification: '',
	linkedinUrl: '',
	companyName: '',
	companyInfo: '',
	phone:  '',

}

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
			{ name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Back End Developer' },
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
			 {
				name: 'availability',
			 	label: 'Availability:',
			 	type: 'select', 
        		options: ['Full Time', 'Part Time', 'Other'], 
			 },
			 //{
				//name: 'availabilityDetails', // New field for 'Other' option details
				//label: 'Availability Details',
				//type: 'textArea',
				//placeholder: 'Please provide more details...',
			  //},
			 {
				name: 'workSite',
			 	label: 'Preferred Work Site:',
			 	type: 'select', 
        		options: ['On Site', 'Remote', 'Hybrid', 'Flexible'], 
			 },
			
		],
	},
];


const recFormInputs = [
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
			{ name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Back End Developer' },
			{
				name: 'linkedinUrl',
				label: 'LinkedIn URL',
				type: 'text',
				placeholder: 'LinkedIn URL',
			},
			
		],
	},
	{
		sectionTitle: 'About Info',
		fields: [
			{
				name: 'companyName',
				label: 'Company Name',
				type: 'text',
				placeholder: 'Company',
			},
			{
				name: 'companyInfo',
				label: 'About Us',
				type: 'textArea',
				placeholder: '',
			},
			
		],
	},
];

export { techDataSchema, formInputs, RecDataSchema, recFormInputs };
