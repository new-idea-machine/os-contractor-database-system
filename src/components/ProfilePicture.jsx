import React from "react";

import "./ProfilePicture.css";

import avatar from "../assets/avatar.svg";

function ProfilePicture({profileImage, size}) {
  return (
    <div className="ProfilePicture" style={{width: size, height: size}}>
      {profileImage ?
        <img src={profileImage} alt="Profile" /> :
        <img src={avatar} alt="" />
      }
    </div>
  );
}

export default ProfilePicture;