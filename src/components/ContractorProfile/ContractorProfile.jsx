import React, { useContext, useEffect, useState } from "react";
import "./ContractorProfile.css";
import { skillsContext } from "../../contexts/SkillsContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import { authContext } from '../../contexts/Authorization';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { favouritesContext } from '../../contexts/FavouritesContext';
import { Link } from "react-router-dom";
import ProfilePicture from "../ProfilePicture";

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import { ReactComponent as IconChats } from "../../assets/icons/chats.svg";

const ContractorProfile = (props) => {
  const id = props.data.id;
  const firebaseUID = props.data.firebaseUID;
  const contractor = props.data;
  const { skillsList } = useContext(skillsContext);
  const [contractorSkills, setContractorSkills] = useState([]);
  const { user } = useContext(authContext);
  const { userProfile, contractors } = useContext(userProfileContext);
  const userUid = user?.uid;
  const userType = userProfile?.userType;
  const { addFavourite, deleteFavourite, isAFavourite } = useContext(favouritesContext);

  const toggleFavourite = async () => {
    try {
      if (isAFavourite(firebaseUID)) {
        await deleteFavourite(firebaseUID);
      } else {
        await addFavourite(firebaseUID);
      }
    } catch (error) {
      console.error("Error adding/removing from favorites:", error);
    }
  };

  useEffect(() => {
    const contractorSkillsList = () => {
      contractors?.forEach((contractor) => {
        if (id === contractor?.id || props?.data?.id === contractor?.id) {
          setContractorSkills(contractor?.skills || []);
        }

      });
    };
    contractorSkillsList();
  }, [id, props?.data?.id, contractors, skillsList]);

  const isOwnProfile = (contractor?.firebaseUID === userUid);

  return (
    <div id="ContractorProfile">
      <aside>
        <ProfilePicture profileImage={contractor?.profileImg} size="150px" />

        {contractor?.otherInfo?.githubUrl && (
          <p>
            <a
              href={contractor?.otherInfo?.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon /> GitHub
            </a>
          </p>
        )}

        {contractor?.otherInfo?.linkedinUrl && (
          <p>
            <a
              href={contractor?.otherInfo?.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon /> LinkedIn
            </a>
          </p>
        )}

        {!isOwnProfile && (
          <Link to={`/chat/${contractor?.firebaseUID}`}>
            <IconChats /> Chat
          </Link>
        )}
      </aside>

      <div>
        <header>
          <h1>{contractor?.firstName}&nbsp;{contractor?.lastName}</h1>
          <h4>{contractor?.qualification}</h4>

          <section>
            <div>
              {contractor?.location}
	    </div>

            <div>
              {contractor?.email}
            </div>

            <div>
              {contractor?.workSite}
            </div>

            <div>
              {contractor?.availability === 'Other' ? contractor?.availabilityDetails : contractor?.availability}
            </div>
          </section>
        </header>

        <section>
          <h2>About</h2>

          <p>
            {contractor?.summary}
          </p>
        </section>

        {contractor?.projects && (
          <section id="Projects">
            <h2>Projects</h2>

            {contractor?.projects.map((project, index) => (
              <article key={index}>
                <h3>{project?.title ? project?.title : <>&lt;Untitled Project&gt;</>}</h3>
		            <a href={project.url}>{project?.url}</a>
                <p>{project?.description}</p>
              </article>
            ))}
          </section>
        )}

        {contractorSkills.length > 0  && (
          <section>
            <h2>Skills</h2>

            <p>
              {contractorSkills?.map((skill, index) =>
                <span key={index} className="badge">
                  {skill.skill}
                </span>
              )}
            </p>
          </section>
        )}

        {userType === 'recruiter' && (
          <FavoriteBorderOutlinedIcon onClick={toggleFavourite} style={{ cursor: 'pointer', color: isAFavourite(firebaseUID) ? 'red' : 'black' }} >
            Add this profile to favorites
          </FavoriteBorderOutlinedIcon>
        )}
      </div>
    </div>);
}

export default ContractorProfile;
