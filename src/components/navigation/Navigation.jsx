import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { authContext } from "../../contexts/auth";
import { contractorContext } from "../../contexts/ContractorContext";
import { recruiterContext } from "../../contexts/RecruiterContext";
import { messagesContext } from "../../contexts/MessagesContext";
import ProfilePicture from "../ProfilePicture";

import "./Navigation.css";

const Navigation = () => {
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

      <NavLink to="/UpdateProfile">
        <ProfilePicture profileImage={currentUserProfile?.profileImg} size="130px" />
      </NavLink>

      <p className="ContractorName">
        {user?.displayName ? user.displayName : "&nbsp;"}
      </p>

      <ul>
        <li>
          <NavLink to="/contractorList">
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/search" onClick={() => sessionStorage.removeItem("searchState")}>
            Search
          </NavLink>
        </li>

        <li>
          <NavLink to="/About">
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/" onClick={() => logout()}>
            Log Out
          </NavLink>
        </li>
      </ul>

      <div>
        <NavLink to="/inbox">
          Inbox
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
