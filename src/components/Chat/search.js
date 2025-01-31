function findKeywordsIn(keywords, textToSearch) {
	let allKeywordsFound = true;

	keywords = keywords.trim().toLowerCase().split(/\s+/g);
	textToSearch = textToSearch.toLowerCase();

	if (keywords.length > 0) {
		let i = -1;

		while (allKeywordsFound && (++i < keywords.length)) {
			allKeywordsFound = textToSearch.indexOf(keywords[i]) >= 0;
		}
	}

	return allKeywordsFound;
}

export { findKeywordsIn }
