import React from "react";
import ProfilePicture from "./ProfilePicture";
import Badge from "./Badge"

import styles from "./MatchCard.module.css";

function MatchCard({ contractor, onClick }) {
  return (
    <div className={`card ${styles.MatchCard}`} onClick={onClick}>
      <div className={styles.Percent}>
        <b>{"percentMatching" in contractor ? `${contractor.percentMatching}%` : <>&nbsp;</>}</b>
      </div>
      <div className={styles.Profile}>
	      <ProfilePicture profileImage={contractor?.profileImg} size="60px"/>
      </div>
      <div className={styles.Name}>
        <b>{contractor?.firstName}&nbsp;{contractor?.lastName}</b>
      </div>
      <div className={styles.Qualification}>
        {contractor?.qualification}
      </div>
      <div className={styles.Summary}>
        {contractor.summary}
      </div>
      <div className={styles.Skills}>
        {contractor?.skills && (
          <>
            {contractor?.skills.map((resultSkill) => {
              return (
                <Badge key={resultSkill.skill}>
                  {resultSkill.skill}
                </Badge>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default MatchCard;