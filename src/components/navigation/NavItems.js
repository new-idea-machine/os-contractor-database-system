// import { useContext } from "react";
// import { authContext } from "../../auth/AuthControl/authControl";

export default function NavItems() {
	// const { setLevel, logout } = useContext(authContext);
}

export const navItems = [
	{
		id: 1,
		title: 'Home',
		path: '/',
		cName: 'nav-item',
	},

	{
		id: 2,
		title: 'Profile',
		path: '/myProfile',
		cName: 'nav-item',
	},

	{
		id: 3,
		title: 'Contractor List',
		path: '/contractorList',
		cName: 'nav-item',
	},

	{
		id: 4,
		title: 'Login',
		path: '/auth',
		cName: 'nav-item',
	},
];

export const serviceDropdown = [
	{
		id: 1,
		title: 'Level 1',
		path: '/marketing',
		cName: 'submenu-item',
		onclick,
	},

	{
		id: 2,
		title: 'Level 5',
		path: '/consulting',
		cName: 'submenu-item',
		onclick,
	},

	{
		id: 3,
		title: 'Level 8',
		path: '/design',
		cName: 'submenu-item',
	},

	{
		id: 4,
		title: 'Level 9',
		path: '/development',
		cName: 'submenu-item',
	},
];
