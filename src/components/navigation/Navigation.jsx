import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { authContext } from "../../contexts/Authorization";
import { contractorContext } from "../../contexts/ContractorContext";
import { recruiterContext } from "../../contexts/RecruiterContext";
import { messagesContext } from "../../contexts/MessagesContext";
import ProfilePicture from "../ProfilePicture";

import "./Navigation.css";

import { ReactComponent as IconAbout } from "../../assets/icons/about.svg";
import { ReactComponent as IconChat } from "../../assets/icons/chat.svg";
import { ReactComponent as IconEdit } from "../../assets/icons/edit.svg";
import { ReactComponent as IconFavourites } from "../../assets/icons/favourites.svg";
import { ReactComponent as IconHome } from "../../assets/icons/home.svg";
import { ReactComponent as IconLogout } from "../../assets/icons/logout.svg";
import { ReactComponent as IconProfile } from "../../assets/icons/profile.svg";
import { ReactComponent as IconSearch } from "../../assets/icons/search.svg";

function Navigation({ menu }) {
  const { logout, user } = useContext(authContext);
  const { currentUserProfile, matchProfileToCurrentUser, contractorMap } = useContext(contractorContext);
  const { recruiterMap } = useContext(recruiterContext);
  const {unreadMessages} = useContext(messagesContext);

  useEffect(() => {
    if (!currentUserProfile) {
      matchProfileToCurrentUser();
    }
  }, [user, contractorMap, currentUserProfile]);

  return (
    <nav>
      <h2>CONTRACTOR <b>DB</b></h2>

      <NavLink to={menu === "Profile" ? "/contractorList": "/myProfile"}>
        <ProfilePicture profileImage={currentUserProfile?.profileImg} size="130px" />
      </NavLink>

      <div className="ContractorName">
        {user?.displayName ? user.displayName : "&nbsp;"}
      </div>

      {menu === "Profile" ?
        <ul>
          <li>
            <NavLink to="/myProfile">
              <IconProfile />{" "}My Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/UpdateProfile">
              <IconEdit />{" "}Update Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/favorites">
              <IconFavourites />{" "}Favourites
            </NavLink>
          </li>

          <li>
            <NavLink to="/" onClick={() => logout()}>
              <IconLogout />{" "}Log Out
            </NavLink>
          </li>
        </ul> :
        <ul>
          <li>
            <NavLink to="/contractorList">
              <IconHome />{" "}Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/search" onClick={() => sessionStorage.removeItem("searchState")}>
              <IconSearch />{" "}Search
            </NavLink>
          </li>

          <li>
            <NavLink to="/About">
              <IconAbout />{" "}About
            </NavLink>
          </li>

          <li>
            <NavLink to="/" onClick={() => logout()}>
              <IconLogout />{" "}Log Out
            </NavLink>
          </li>
        </ul>
      }

      <div>
        <NavLink to="/inbox">
          <IconChat />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
