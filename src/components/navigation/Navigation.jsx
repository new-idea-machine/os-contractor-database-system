import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { authContext } from "../../contexts/Authorization";
import { userProfileContext } from "../../contexts/UserProfileContext";
import IconChats from "../Chat/IconChats";
import ProfilePicture from "../ProfilePicture";

import "./Navigation.css";

import { ReactComponent as IconAbout } from "../../assets/icons/about.svg";
import { ReactComponent as IconArchive } from "../../assets/icons/archive.svg";
import { ReactComponent as IconChat } from "../../assets/icons/chat.svg";
import { ReactComponent as IconEdit } from "../../assets/icons/edit.svg";
import { ReactComponent as IconFavourites } from "../../assets/icons/favourites.svg";
import { ReactComponent as IconHome } from "../../assets/icons/home.svg";
import { ReactComponent as IconLogout } from "../../assets/icons/logout.svg";
import { ReactComponent as IconProfile } from "../../assets/icons/profile.svg";
import { ReactComponent as IconSearch } from "../../assets/icons/search.svg";
import { ReactComponent as IconStar } from "../../assets/icons/star.svg";
import { ReactComponent as IconTrash } from "../../assets/icons/trash.svg";

function Navigation({ menu }) {
  const { logout, user } = useContext(authContext);
  const { userProfile } = useContext(userProfileContext);

  return (
    <nav>
      <h2>CONTRACTOR <b>DB</b></h2>

      <NavLink to={menu === "Profile" ? "/contractorList": "/myProfile"}>
        <ProfilePicture profileImage={userProfile?.profileImg} size="130px" />
      </NavLink>

      <div className="ContractorName">
        {user?.displayName ? user.displayName : " "}
      </div>

      <ul>
        <li>
          <NavLink to="/contractorList">
            <IconHome />{" "}Home
          </NavLink>
        </li>

        {!menu &&
          <>
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
          </>
        }

    	  {menu === "Profile" &&
          <>
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
          </>
        }

        {menu === "Chat" &&
          <>
            <li>
              <NavLink to="/inbox">
                <IconChat />{" "}Chat
              </NavLink>
            </li>

            <li>
              <NavLink to="/inbox/archived">
                <IconArchive />{" "}Archive
              </NavLink>
            </li>

            <li>
              <NavLink to="/inbox/starred">
                <IconStar />{" "}Starred
              </NavLink>
            </li>

            <li>
              <NavLink to="/inbox/deleted">
                <IconTrash />{" "}Deleted
              </NavLink>
            </li>
          </>
        }

        <li>
          <NavLink to="/" onClick={() => logout()}>
            <IconLogout />{" "}Log Out
          </NavLink>
        </li>
      </ul>

      <div>
        <NavLink to="/inbox">
          <IconChats />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
