import React, { useContext, useEffect, useState } from "react";
import "./RecruiterProfile.css";
import { useParams } from "react-router-dom";
import { Navigation } from "../index";
import { recruiterContext } from "../../contexts/RecruiterContext";
import { Button } from "@mui/material";
import Avatar from "../../assets/avatar.png";
import PlaceIcon from "@mui/icons-material/Place";
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import { Country } from "country-state-city";


const RecruiterProfile = (props) => {
  const { id } = useParams();
  const { recruiterList } = useContext(recruiterContext);



  return (
    <div>
      <Navigation />
      {recruiterList.map((recruiter) =>
        id === recruiter?.id || props?.data?.id === recruiter?.id ? (
          <div className="recruiter_profile" key={recruiter.id}>
            {recruiter?.profileImg ? (
              <div className="image_wrapper">
                <img src={recruiter?.profileImg} alt="recruiter headshot" />
              </div>
            ) : (
              <div className="avatar_wrapper">
                <img src={Avatar} alt="Avatar" />
              </div>
            )}
            <div className="recruiter_info">
              <div className="recruiter_name">
                {recruiter?.firstName}&nbsp;{recruiter?.lastName}
              </div>
              <div className="recruiter_qualification">
                {recruiter?.qualification}
              </div>



              <div className="recruiter_links">
                {recruiter?.linkedinUrl && (
                  <a
                    href={recruiter?.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                <LinkedinIcon style={{fontSize:"40px"}}/>
                  </a>
                )}

              </div>
              <div className="recruiter_summary"><b style={{ paddingLeft: "5px", fontSize:"20px" }}>Company:</b> {recruiter?.companyName}</div>
              {recruiter?.companyName && (
                <div className="recruiter_interests">
                  <div
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#D5D1D0",
                      width: "100%",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <b style={{ paddingLeft: "5px" }}>Company Info:</b>
                  </div>
                  <div style={{ paddingLeft: "5px" }}>
                    {recruiter?.companyInfo}
                  </div>
                </div>
              )}



            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default RecruiterProfile;
