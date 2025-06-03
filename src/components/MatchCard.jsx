import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import Badge from "./Badge"
import { userProfileContext } from '../contexts/UserProfileContext';
import { favouritesContext } from '../contexts/FavouritesContext';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import styles from "./MatchCard.module.css";

function MatchCard({ contractor, onClick }) {
  const { getUserProfile } = useContext(userProfileContext);
  const { isAFavourite, addFavourite, deleteFavourite } = useContext(favouritesContext);
  const userProfile = getUserProfile();

  return (
    <div className={`card ${styles.MatchCard}`} onClick={onClick}>
      <div className={styles.Percent}>
        <b>{contractor.percentMatching ? `${contractor.percentMatching}%` : <>&nbsp;</>}</b>
      </div>
      <div className={styles.Profile}>
	      <ProfilePicture profileImage={contractor?.profileImg} size="60px"/>
      </div>
      <div className={styles.Name}>
        <b>{contractor?.firstName}&nbsp;{contractor?.lastName}</b>
      </div>
      <div className={styles.Tag}>
        <div className={styles.Qualification}>
          {contractor?.qualification}
        </div>
        <div>&ndash;</div>
        <div className={styles.WorkSite}>
          <div className={styles.WorkSite}>
            {Array.isArray(contractor?.workSite) ? (
              contractor.workSite.join(", ")
            ) : (
              <span>{contractor?.workSite}</span>
            )}
          </div>
        </div>
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
        {userProfile.userType === "recruiter" &&
          <FavoriteBorderOutlinedIcon style={{ color: isAFavourite(contractor.firebaseUID) ? 'red' : 'black' }} 
            onClick={async (e) => {
              e.stopPropagation();
              if (isAFavourite(contractor.firebaseUID)) {
                await deleteFavourite(contractor.firebaseUID);
              } else {
                await addFavourite(contractor.firebaseUID);
              }
            }}
          >
            Add this profile to favorites
          </FavoriteBorderOutlinedIcon>
        }
      </div>
    </div>
  );
}

export default MatchCard;