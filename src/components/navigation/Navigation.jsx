import React, { useContext, useEffect } from "react";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { authContext } from "../../contexts/auth";
import { contractorContext } from "../../contexts/ContractorContext";
import { recruiterContext } from "../../contexts/RecruiterContext";
import {messagesContext} from '../../contexts/MessagesContext';
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
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

import avatar from "../../assets/avatar.png";

function getURLPath(URL) {
  /*
  This function returns the part portion of "URL" (which MUST be a well-formed uniform resource
  locator).

  An URL consists of the following parts:

    <scheme>://[server:[port]][/[path]][?<parameters>][#<anchor>]
  */

  const URLPattern = /^([^:]+):\/\/([^/:]*):?(\d*)\/?([^?#]*)\??([^#]*)#?(.*)/gi;
  const URLParts = URLPattern.exec(URL);

  /*
  The path part is in element 4, which is returned without leading or trailing slashes.
  */

  return (URLParts ? URLParts[4].replace(/^\/+|\/+$/g, "") : "");
}

const Navigation = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(authContext);
  const { currentUserProfile, matchProfileToCurrentUser, contractorMap } =
    useContext(contractorContext);
    const { recruiterMap } = useContext(recruiterContext);
  const {unreadMessages} = useContext(messagesContext);

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

  const currentPage = getURLPath(window.location);

  return (
    <nav>
      <h2>CONTRACTOR <b>DB</b></h2>

      <div className="profilePicture">
        {/* {currentUserProfile?.profileImg ?
          <img src={currentUserProfile?.profileImg} alt="Profile" /> :
          <img src={avatar} alt="Profile" />
        } */}
        <img src={currentUserProfile.profileImg ? currentUserProfile.profileImg : avatar} alt="Profile" />
      </div>


      {/* <Avatar sx={{ width: 45, height: 45 }}>
        {currentUserProfile?.profileImg ?
          <div className="image_container">
            <img src={currentUserProfile.profileImg} alt="" />
          </div> :
          <BackgroundLetterAvatars
            currentUserFirstName={currentUserProfile?.firstName}
            currentUserLastName={currentUserProfile?.lastName}
          />
          // (recruiterMap && recruiterMap[user?.uid] ?
          //   <BackgroundLetterAvatars
          //     currentUserFirstName={recruiterMap[user?.uid]?.firstName} // Update the props
          //     currentUserLastName={recruiterMap[user?.uid]?.lastName} // Update the props
          //   /> :
          //   null)
        }
      </Avatar> */}
      {/* <MenuItem onClick={() => navigate("/updateProfile")}> */}
      {/* <MenuItem onClick={() => navigate("/myProfile")} sx={{width: "160px"}}> */}

      <ul>
        <li>
          <NavLink
            active={currentPage === "contractorlist"}
            activeclassname="selected"
            exact="true"
            to="/contractorList"
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            active={currentPage === "search"}
            activeclassname="selected"
            exact="true"
            to="/search"
            onClick={() => sessionStorage.removeItem("searchState")}
          >
            Search
          </NavLink>
        </li>

        <li>
          <NavLink
            active={currentPage === "About"}
            activeclassname="selected"
            exact="true"
            to="/About"
          >
            About
          </NavLink>
        </li>

        <li>
          <NavLink
            active={currentPage.substring(0, 5) === "chat/"}
            activeclassname="selected"
            exact="true"
            to="/About"
          >
            Chat
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
