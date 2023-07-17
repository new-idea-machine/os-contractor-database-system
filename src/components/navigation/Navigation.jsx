import React, { useContext, useEffect } from "react";
import "./navigation.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { authContext } from "../../contexts/auth";
import { contractorContext } from "../../contexts/ContractorContext";
import { recruiterContext } from "../../contexts/RecruiterContext";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import BackgroundLetterAvatars from "./BackgroundLetterAvatars";
// import { toast } from "react-toastify";

const Navigation = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(authContext);
  const { currentUserProfile, matchProfileToCurrentUser, contractorMap } =
    useContext(contractorContext);
    const { recruiterMap } = useContext(recruiterContext);

  useEffect(() => {
    if (!currentUserProfile) {
      // toast.info("first");
      matchProfileToCurrentUser();
    }
  }, [user, contractorMap, currentUserProfile]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar-container">
      <ul className="navbar-links">
        <li style={{ marginLeft: "60px" }}>
          <NavLink
            className="navbar-links"
            activeclassname="selected"
            exact="true"
            to="/contractorList"
          >
            Home
          </NavLink>
        </li>
      
        <li style={{ marginRight: "30px" }}>
          <NavLink
            className="navbar-links"
            activeclassname="selected"
            exact="true"
            to="/search"
            onClick={() => sessionStorage.removeItem("searchState")}
          >
            Search
          </NavLink>
        </li>

        <li style={{ marginRight: "30px" }}>
          <NavLink
            className="navbar-links"
            activeclassname="selected"
            exact="true"
            to="/About"
            
          >
            About
          </NavLink>
        </li>
        {user ? (
          <>
            <Tooltip>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 45, height: 45 }}>
                  {" "}
                  {currentUserProfile ? (
                    <>
                      {currentUserProfile?.profileImg ? (
                        <>
                          <div className="image_container">
                            <img src={currentUserProfile?.profileImg} alt="" />
                          </div>
                        </>
                      ) : (
                        <BackgroundLetterAvatars
                          currentUserFirstName={currentUserProfile?.firstName}
                          currentUserLastName={currentUserProfile?.lastName}
                        />
                      )}
                    </>
                    ) : recruiterMap && recruiterMap[user?.uid] ? (
                    <BackgroundLetterAvatars
                      currentUserFirstName={recruiterMap[user?.uid]?.firstName} // Update the props
                      currentUserLastName={recruiterMap[user?.uid]?.lastName} // Update the props
                    />
                  ) : null}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => navigate("/myProfile")} sx={{width: "160px"}}>
                <Avatar
                  sx={{
                    width: "25px!important",
                    height: "25px!important",
                    marginLeft: "1px!important",
                  }}
                />{" "}
                My Profile
              </MenuItem>
              <MenuItem onClick={() => navigate("/updateProfile")}>
                <Avatar
                  sx={{
                    width: "25px!important",
                    height: "25px!important",
                    marginLeft: "1px!important",
                  }}
                />{" "}
                Edit My Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <FavoriteBorderRoundedIcon
                  sx={{ width: 25, height: 25, color: "gray", marginRight: 1 }}
                />{" "}
                Favorites
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  logout();
                  navigate("/contractorList");
                }}
              >
                <ListItemIcon>
                  <Logout
                    fontSize="small"
                    sx={{ color: "gray", marginLeft: 0.5 }}
                  />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <li style={{ marginRight: "30px" }}>
            <NavLink
              className="navbar-links"
              activeclassname="selected"
              exact
              to="/auth"
            >
              Log in
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
