function makeRegExp(rawString, addWildcards = false) {
/*
Convert a raw string to a regular expression that can be used to test other strings.

"rawString" is the string to be converted.  "addWildcards" will add support for the
commonly-used asterisk ("*") and question mark ("?") wildcards (converting them to their
regular expression equivalents) if true.

Examples:

	"howdy"       --> /(?:^|\s|\b)howdy(?:\b|\s|$)/i
	"how**", true --> /(?:^|\s|\b)how\S*(?:\b|\s|$)/i
	"ho?dy", true --> /(?:^|\s|\b)ho\Sdy(?:\b|\s|$)/i
	"howdy ho"    --> /(?:^|\s|\b)howdy ho(?:\b|\s|$)/i
*/

	/*
	Since "rawString" is coming from the user, it CANNOT BE OVERSTATED ENOUGH how important
	it is to sanitize it for safe inclusion in a regular expression.  This requires all
	special characters to be escaped.

	If "addWildcards" is true then asterisk and question mark characters are replaced by
	their regular expression equivalents instead.
	*/

	let sanitizedString = null;

	if (addWildcards) {
		sanitizedString = rawString.replace(/[.+^${}()|[\]\\]/g, "\\$&");
		sanitizedString = sanitizedString.replace(/\*+/g, "\\S*");
		sanitizedString = sanitizedString.replace(/\?/g, "\\S");

	} else {
		sanitizedString = rawString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	return new RegExp(`(?:^|\\s|\\b)${sanitizedString}(?:\\b|\\s|$)`, "i");
}

function parseKeywords(keywordString) {
/*
Parse a string of whitespace-separated keywords.  The commonly-used asterisk ("*") and question
mark ("?") wildcards are supported.  All characters between a pair of double-quotes are taken
literally, however, except that two consecutive double-quote characters are taken as a single
double-quote character.

Return an array of regular expressions that can be used to test other strings.

"keywordString" is the string to be parsed.
*/

	let currentKeyword = "";  // the keyword that's currently being built
	let inQuotes = false;     // is the parsing algorithm in quote mode?
	const keywords = [];      // the array of keywords to return

	/*
	This is the main loop.  During each iteration, a single character in "keywordString" is
	examined.  Depending on what the character is and whether or not it's inside a quoted
	string, this character could be appended to the current keyword, the current keyword
	could be added to the array of keywords (and a new keyword started) or no action may be
	taken.

	The loop terminates when all characters in "keywordString" have been exhausted.
	*/

	for (let i = 0; i < keywordString.length; i++) {
		const currentChar = keywordString[i];

		if (currentChar === '"') {
			if (inQuotes && (keywordString[i + 1] === '"')) {
				/*
				A pair of double-quote characters inside a quoted string
				denotes a single double-quote character.
				*/

				currentKeyword += '"';
				i++;
			} else {
				/*
				A single double-quote character marks either the start or end
				of a quoted string.  If it's the end then the current keyword
				(if any) must be added to the array of keywords.
				*/

				if (inQuotes && (currentKeyword !== "")) {
					keywords.push(makeRegExp(currentKeyword));
					currentKeyword = "";
				}

				inQuotes = !inQuotes;
			}
		} else if (!inQuotes && /\s/.test(currentChar)) {
			/*
			A series of whitespace characters outside of a quoted string separates
                        keywords.  The current keyword (if any) must be added to the array of
                        keywords.
                        */

			if (currentKeyword !== "") {
				keywords.push(makeRegExp(currentKeyword, true));
				currentKeyword = "";
			}
		} else {
			/*
			Any other character is part of the current keyword.
			*/

			currentKeyword += currentChar;
		}
	}

	if (currentKeyword !== "") {
		keywords.push(makeRegExp(currentKeyword, !inQuotes));
	}

	return keywords;
}

function findKeywordsIn(keywords, textToSearch) {
/*
Search for keywords in a string and return true if the string contains all of them, and false
if it doesn't.

"keywords" is a string of keywords to search for.  The commonly-used asterisk ("*") and
question mark ("?") wildcards are supported.  All characters between a pair of double-quotes
are taken literally, however, except that two consecutive double-quote characters are taken as
a single double-quote character.

Examples of how keyword strings are parsed:

	"First second third"               --> ["first", "second", "third]
	"\"First  second\" " third"        --> ["first  second ", "third"]
	"\"First  \"\"second\"\" \" third" --> ["first  \"second\" ", "third"]
*/

	const expressions = parseKeywords(keywords);

	return expressions.every((expression) => expression.test(textToSearch));
}

export { findKeywordsIn };
