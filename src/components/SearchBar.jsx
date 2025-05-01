import { ReactComponent as IconSearchChat } from "../assets/icons/searchChat.svg";

import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder, defaultValue, setSearchTerms }) {
	function onSubmit(event) {
		event.preventDefault();
		setSearchTerms(event.target.searchBar.value);
	}

	return (
		<form onSubmit={ onSubmit } className={ styles.SearchForm }>
			<input
				type="text"
				name="searchBar"
				defaultValue={ defaultValue }
				placeholder={ placeholder }
				className={ styles.SearchInput }
			/>
			<button type="submit" className={ styles.SearchButton }>
				<IconSearchChat />
			</button>
		</form>
	);
}