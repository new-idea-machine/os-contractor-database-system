import React, { useState, useContext } from 'react';
import { navItems } from './NavItems';
import './navigation.css';
import DropDown from '../Dropdown/DropDown';
import { Link } from 'react-router-dom';

export default function Navigation() {
	const [dropDown, setDropDown] = useState(false);
	// const { setLevel } = useContext(authContext);

	return (
		<>
			<nav className='navbar'>
				<ul className='nav-items'>
					{navItems.map((item) => {
						if (item.title === 'User Level') {
							return (
								<li
									key={item.id}
									className={item.cName}
									onMouseEnter={() => setDropDown(true)}
									onMouseLeave={() => setDropDown(false)}
								>
									<Link to={item.path}>{item.title}</Link>
									{dropDown && <DropDown />}
								</li>
							);
						}
						return (
							<li key={item.id} className={item.cName}>
								<Link to={item.path}>{item.title}</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}
