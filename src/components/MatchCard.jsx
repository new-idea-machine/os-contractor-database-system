import React from "react";

import "./Search/Search.css";

const avatarURL = "/assets/avatar.png";

function MatchCard({ contractor, onClick }) {
  return (
    <div className="contractor_container" onClick={onClick}>
      <div className="result_container">
        <div className="result_percent">
          <b>{"percentMatching" in contractor ? `${contractor?.percentMatching}%` : <>&nbsp;</>}</b>
        </div>
        {contractor?.profileImg ? (
          <div className="result_profile_image">
            <img src={contractor?.profileImg} alt="" />
          </div>
        ) : (
          <div className="result_no_image">
            <img src={avatarURL} alt="Avatar" />
          </div>
        )}
      </div>
      <div className="result_info">
        <div>
          <b>{contractor?.firstName}&nbsp;</b>
          <b>{contractor?.lastName}&nbsp;</b>
          <div className="contractor_qualification2">
            {contractor?.qualification}
          </div>
        </div>
        <div>{contractor.summary}</div>
        <div>
          {contractor?.skills && (
            <div className="result_skills_btns">
              {contractor?.skills.map((resultSkill, index) => {
                return (
                  <span key={index} className="badge">
                    {resultSkill.skill}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchCard;