import { useState } from "react";

import { ReactComponent as IconSearchBar } from "../assets/icons/searchBar.svg";
import { ReactComponent as IconSearchBarClear } from "../assets/icons/searchBarClear.svg";

import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder, defaultValue, setSearchTerms }) {
	const [showSearchIcon, setShowSearchIcon] = useState(defaultValue === "");

	function onSubmit(event) {
		event.preventDefault();

		const element = event.target.searchBar

		if (showSearchIcon) {
			setSearchTerms(element.value);
			setShowSearchIcon(element.value === "");
		} else {
			element.value = ""

			setSearchTerms("");
			setShowSearchIcon(true);
		}
	}

	function onChange(event) {
		event.preventDefault();
		setShowSearchIcon(true);
	}

	return (
		<form onSubmit={ onSubmit } className={ styles.SearchForm }>
			<input
				type="text"
				name="searchBar"
				defaultValue={ defaultValue }
				placeholder={ placeholder }
				onChange={ onChange }
			/>
			<button type="submit">
				{ showSearchIcon ? <IconSearchBar /> : <IconSearchBarClear /> }
			</button>
		</form>
	);
}