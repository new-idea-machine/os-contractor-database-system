/*
This function ensures that "target (object)" has all of the members defined in "schema
(object)".  It does not remove extraneous members from "target" -- it only ensures that the
members specified in "schema" are present in "target".

The values of "schema's" members are default values.  If a member of "target" is missing or
isn't of the same type as the corresponding member of "schema" then that member's value is set
to the the default value from "schema".

Some types of members in "schema" are special:

- Basic JavaScript object:  the corresponding member in "target" is checked recursively.
- Array:  MUST contain a single element as the default value, and all corresponding elements in
  "target" are checked.
- "null":  the data type is undefined & can be anything; "target" is only checked for the
  presence of this member and its type is ignored.
- Function:  not allowed (not even as members of objects).

A quick & easy way to create a new object initialized with all default values from "schema" is
to pass "{}" into "target".

This function returns "target" and therefore can be invoked as either a function or a
statement.
*/

function enforceSchema(target, schema) {
	console.assert(typeof target === 'object');
	console.assert(typeof schema === 'object');

	/*
	This function returns the type of "thing" as a string.  It's more comprehensive than
	the "typeof" operator alone in that it will detect arrays and nulls distinctly.
	*/

	function getType(thing) {
		if (thing === null)
			return 'null';
		else if (Array.isArray(thing))
			return 'array';
		else
			return typeof(thing);
	}

	Object.keys(schema).forEach((key) => {
		const targetKeyType = getType(target[key]);
		const schemaKeyType = getType(schema[key]);

		console.assert(schemaKeyType !== 'function');

		/*
		First, check to see if "target[key]" is of the wrong type.  If it is then set
		it to the default value.
		*/

		if (schemaKeyType !== targetKeyType) {
			if (schemaKeyType === 'array') {
				target[key] = [];
			} else 	if (schemaKeyType === 'object') {
				target[key] = {};    // this will be populated in the next step
			} else if ((schemaKeyType !== 'null') || (targetKeyType === 'undefined')) {
				target[key] = schema[key];
			}
		}

		/*
		Next, if "schema[key]" is an array or an object then check each element or
		member recursively.
		*/

		if (schemaKeyType === 'array') {
			console.assert(schema[key].length === 1);

			target[key].forEach((element) => enforceSchema(element, schema[key][0]));
		} else if (schemaKeyType === 'object') {
			enforceSchema(target[key], schema[key]);
		}
	});

	return target;
}
const qualificationsList = [
	"Developer",
	"Designer",
	"Product Manager",
	"Project Manager"
];

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

const recDataSchema = {
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

const messageDataSchema = {
	archived: false,
	avatar: '',
	createdAt: null,
	deletedOn: null,
	email: '',
	hasRead: false,
	name: '',
	receiverArchived: false,
	receiverDeletedOn: null,
	receiverStarred: false,
	receiverUid: '',
	starred: false,
	text: '',
	uid: ''
}

export { enforceSchema, qualificationsList, techDataSchema, recDataSchema, messageDataSchema };
