import { useState } from "react";

import { ReactComponent as IconSearchChat } from "../assets/icons/searchChat.svg";
import { ReactComponent as IconClearSearchChat } from "../assets/icons/clearSearchChat.svg";

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
				className={ styles.SearchInput }
				onChange={ onChange }
			/>
			<button type="submit" className={ styles.SearchButton }>
				{ showSearchIcon ? <IconSearchChat /> : <IconClearSearchChat /> }
			</button>
		</form>
	);
}