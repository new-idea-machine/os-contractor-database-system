import React, { useState, useContext } from 'react';
// import { authContext } from "../../auth/AuthControl/authControl";
import { serviceDropdown } from '../navigation/NavItems';
import { Link } from 'react-router-dom';
import './DropDown.css';

function DropDown() {
	const [dropdown, setDropdown] = useState(false);
	//const [isActive, setIsActive] = useState(false);
	// const { setLevel } = useContext(authContext);

	return (
		<>
			<ul
				className={dropdown ? 'services-submenu clicked' : 'services-submenu'}
				onClick={() => setDropdown(!dropdown)}
			>
				{serviceDropdown.map((item) => {
					return (
						<li key={item.id}>
							<Link
								to={item.path}
								className={item.cName}
								onClick={(e) => {
									setDropdown(false);
								}}
							>
								{item.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</>
	);
}

export default DropDown;
