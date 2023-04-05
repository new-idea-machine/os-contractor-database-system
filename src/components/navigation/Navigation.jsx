import React, { useContext, useEffect } from 'react';
import './navigation.css';
import { useNavigate } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import BackgroundLetterAvatars from './BackgroundLetterAvatars';
import { toast } from 'react-toastify';

const Navigation = () => {
	const navigate = useNavigate();
	const { logout, user } = useContext(authContext);
	const { currentUserProfile, matchProfileToCurrentUser, contractorMap } =
		useContext(contractorContext);
	useEffect(() => {
		if (!currentUserProfile) {
			toast.info('first');
			matchProfileToCurrentUser();
		}
	}, [user, contractorMap]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className='navbar-container'>
			<ul className='navbar-links'>
				<li style={{ marginLeft: '60px' }}>
					<NavHashLink
						className='navbar-links'
						activeclassname='selected'
						to='/'
					>
						Home
					</NavHashLink>
				</li>
				<li>
					<NavHashLink
						className='navbar-links'
						activeclassname='selected'
						to='/contractorList'
					>
						Contractor List
					</NavHashLink>
				</li>
				<li style={{ marginRight: '30px' }}>
					<NavHashLink
						className='navbar-links'
						activeclassname='selected'
						to='/search'
					>
						Search
					</NavHashLink>
				</li>
				{user ? (
					<>
						<Tooltip>
							<IconButton
								onClick={handleClick}
								size='small'
								sx={{ ml: 2 }}
								aria-controls={open ? 'account-menu' : undefined}
								aria-haspopup='true'
								aria-expanded={open ? 'true' : undefined}
							>
								<Avatar sx={{ width: 45, height: 45 }}>
									{' '}
									{currentUserProfile ? (
										<>
											{currentUserProfile?.profileImg ? (
												<>
													<div className='image_container'>
														<img src={currentUserProfile?.profileImg} alt='' />
													</div>
												</>
											) : (
												<BackgroundLetterAvatars
													currentUserName={currentUserProfile?.name}
												/>
											)}
										</>
									) : null}
								</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							anchorEl={anchorEl}
							id='account-menu'
							open={open}
							onClose={handleClose}
							onClick={handleClose}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
									mt: 1.5,
									'& .MuiAvatar-root': {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									'&:before': {
										content: '""',
										display: 'block',
										position: 'absolute',
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: 'background.paper',
										transform: 'translateY(-50%) rotate(45deg)',
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<MenuItem onClick={() => navigate('/myProfile')}>
								<Avatar
									sx={{
										width: '25px!important',
										height: '25px!important',
										marginLeft: '1px!important',
									}}
								/>{' '}
								My Profile
							</MenuItem>
							<MenuItem onClick={() => navigate('/updateProfile')}>
								<Avatar
									sx={{
										width: '25px!important',
										height: '25px!important',
										marginLeft: '1px!important',
									}}
								/>{' '}
								Edit My Profile
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<FavoriteBorderRoundedIcon
									sx={{ width: 25, height: 25, color: 'gray', marginRight: 1 }}
								/>{' '}
								Favorites
							</MenuItem>
							<Divider />
							<MenuItem
								onClick={() => {
									logout();
									navigate('/contractorList');
								}}
							>
								<ListItemIcon>
									<Logout
										fontSize='small'
										sx={{ color: 'gray', marginLeft: 0.5 }}
									/>
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</>
				) : (
					<li style={{ marginRight: '30px' }}>
						<NavHashLink
							className='navbar-links'
							activeclassname='selected'
							to='/auth'
						>
							Log in
						</NavHashLink>
					</li>
				)}

				{/* {user ? (
          <li style={{ marginRight: "30px" }}>
            <NavHashLink
              className="navbar-links"
              activeclassname="selected"
              // to="/contractorlist"
              onClick={() => logout()}
            >
              {currentUserProfile ? (
                <>
                  <div className="image_container">
                    <img src={currentUserProfile.profileImg} alt="" />
                  </div>
                </>
              ) : null}
              Log out
            </NavHashLink>
          </li>
        ) : (
          <li style={{ marginRight: "30px" }}>
            <NavHashLink
              className="navbar-links"
              activeclassname="selected"
              to="/auth"
            >
              Log in
            </NavHashLink>
          </li>
        )} */}
			</ul>
		</div>
	);
};

export default Navigation;
