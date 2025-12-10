
import { Timestamp } from "firebase/firestore";

/**
 * Parse an array of strings and add valid, non-empty trimmed strings to a target array.
 *
 * This utility function filters and processes string arrays by:
 * - Checking if the input is actually an array
 * - Validating each element is a string
 * - Trimming whitespace from each string
 * - Only adding non-empty strings to the target array
 *
 * @param {Array} stringsArray - The source array to parse (may contain non-string elements)
 * @param {string[]} targetArray - The destination array to populate with valid strings
 * @returns {void}
 * @example
 * const skills = [];
 * parseStringsArray(["  JavaScript  ", "", "React", 123, "Node.js  "], skills);
 * // skills is now ["JavaScript", "React", "Node.js"]
 */
function parseStringsArray(stringsArray, targetArray) {
	if (Array.isArray(stringsArray)) {
		stringsArray.forEach((element) => {
			if (typeof element === "string") {
				const trimmedString = element.trim();

				if (trimmedString !== "")
					targetArray.push(trimmedString);
			}
		});
	}
}

/**
 * Determine whether a value is a properly formatted Firebase user UID or not.
 *
 * @param {*} value - The value to validate
 * @returns {boolean} True if the value is a valid Firebase user UID, false otherwise
 * @example
 * isValidFirebaseUserUID("abc123def456789012345678"); // true
 * isValidFirebaseUserUID("invalid-uid"); // false
 * isValidFirebaseUserUID(123); // false
 */
function isValidFirebaseUserUID(value) {
	/*
	Firebase user UIDs are 28-character hexadecimal strings.  This function checks to see
	whether the provided value matches this format by using a regular expression.
	*/

	const firebaseUserIdFormat = /^[0-9a-f]{28}$/i;

	return (typeof value === "string") && firebaseUserIdFormat.test(value);
}

/**
 * Check if a value is a valid timestamp (either a Date or Firestore Timestamp).
 *
 * @param {*} value - The value to validate
 * @returns {boolean} True if the value is a Date or Timestamp instance, false if it isn't
 * @example
 * isValidTimestamp(new Date()); // true
 * isValidTimestamp(Timestamp.now()); // true
 * isValidTimestamp("2024-01-01"); // false
 * isValidTimestamp(1234567890); // false
 */
function isValidTimestamp(value) {
	try {
  		return value instanceof Date || value instanceof Timestamp;
	} catch (error) {
		return false;
	}
}

/**
 * Convert various timestamp formats to a Firestore Timestamp or null.
 *
 * This function ensures consistent timestamp handling by converting different
 * timestamp representations to Firestore's Timestamp type.  It handles:
 * - null values (returned as-is)
 * - Firestore Timestamp instances (returned as-is)
 * - JavaScript Date objects (converted to Timestamp)
 * - Numeric milliseconds (converted to Timestamp)
 * - BigInt milliseconds (converted to Timestamp)
 *
 * @param {Timestamp|Date|number|bigint|null} value - The timestamp value to convert
 * @returns {Timestamp|null} A Firestore Timestamp instance or null
 * @throws {Error} If the value cannot be converted to a valid timestamp
 * @example
 * enforceTimestamp(null); // null
 * enforceTimestamp(new Date()); // Timestamp instance
 * enforceTimestamp(1234567890000); // Timestamp instance
 * enforceTimestamp(Timestamp.now()); // Same Timestamp instance
 * enforceTimestamp("invalid"); // throws Error
 */
function enforceTimestamp(value) {
	if ((value === null) || (value instanceof Timestamp)) {
		return value;
	} else if (value instanceof Date) {
		return Timestamp.fromDate(value);
	} else if ((typeof value === "number") || (typeof value === "bigint")) {
		return Timestamp.fromMillis(value);
        } else {
		throw new Error("Invalid timestamp value:  " + value);
	}
}

/**
 * Ensure that a target object conforms to a specified schema by adding missing members
 * with default values.
 *
 * This function validates and populates an object based on a schema definition.  It ensures
 * that all members defined in the schema exist in the target object with the correct types.
 * If a member is missing or has the wrong type then it's set to the default value from the
 * schema.
 *
 * To avoid inadvertent data loss, extraneous members are NOT removed from the target -- only
 * the required members are ensured to be present and of the correct type.
 *
 * Regarding the types of default values in a schema:
 * - Primitive types (string, number, boolean):  Checked for type match
 * - Object:  Members of the target are all recursively validated against the schema
 * - Array:  Must contain exactly one element as the default value; all elements in the target
 *   member are validated, too
 * - null:  Type is undefined/flexible (only its presence is checked for, not its type)
 * - Function:  Not allowed (not even as members of objects)
 *
 * @param {Object} target - The object to validate and populate
 * @param {Object} schema - The schema defining required members and their default values
 * @returns {Object} The modified target object (which is also modified in place)
 * @throws {AssertionError} If target or schema are not objects, or if schema contains
 *   functions
 * @example
 * // Define a schema
 *
 * const userSchema = {
 *   name: '',
 *   age: 0,
 *   settings: {
 *     theme: 'light',
 *     notifications: true
 *   },
 *   tags: ['']
 * };
 *
 * // Validate and populate an incomplete object
 *
 * const user = { name: 'John' };
 * enforceSchema(user, userSchema);
 * // user is now: { name: 'John', age: 0, settings: { theme: 'light', notifications: true }, tags: [] }
 *
 * // Create a new object with all defaults
 *
 * const newUser = enforceSchema({}, userSchema);
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
				target[key] = {};  // this will be populated in the next step
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
	'Developer',
	'Designer',
	'Product Manager',
	'Project Manager',
	'Tester',
	'QA Manager',
	'Business Analyst',
];

const workSiteList = [
	'On Site',
	'Hybrid',
	'Remote',
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
	availability: '',
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
	phone: '',
};

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

export {
	parseStringsArray,
	isValidFirebaseUserUID,
	isValidTimestamp,
	enforceTimestamp,
	enforceSchema,
	qualificationsList,
	workSiteList,
	techDataSchema,
	recDataSchema,
	messageDataSchema
};
