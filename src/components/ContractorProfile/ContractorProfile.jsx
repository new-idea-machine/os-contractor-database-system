import React, { useContext, useEffect, useState } from "react";
import "./ContractorProfile.css";
import { useParams } from "react-router-dom";
import { skillsContext } from "../../contexts/SkillsContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import { authContext } from '../../contexts/Authorization';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { Link } from "react-router-dom";
import { db} from '../../firebaseconfig';
import ProfilePicture from "../ProfilePicture";

import {
  collection,
  query,
  getDocs,
  where,
  getDoc,
  addDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';


import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import { ReactComponent as IconChats } from "../../assets/icons/chats.svg";

const ContractorProfile = (props) => {
  const { id } = useParams();
  const contractor = props.data;
  const { skillsList } = useContext(skillsContext);
  const [contractorSkills, setContractorSkills] = useState([]);
  const { user } = useContext(authContext);
  const { userProfile, contractors } = useContext(userProfileContext);
  const userUid = user?.uid;
  const userType = userProfile?.userType;
  //const favoriteList = getFavoriteList();
  const [isFavorite, setIsFavorite] = useState(false);

  const addToFavorites = async () => {
    try {

      const userFirebaseUID = user.uid;

      // Check if the tech user is already in favorites
      const techDocRef = doc(db, 'techs', id);
      const techDocSnapshot = await getDoc(techDocRef);
      const techData = techDocSnapshot.data();

      if (!techData) {
        // Tech user not found, handle this case accordingly
        return;
      }

      // Check if the tech user is in the recruiter's favorites
      const favsQuery = query(
        collection(db, 'favs'),
        where('techId', '==', id),
        where('recruiterId', '==', userFirebaseUID)
      );
      const favsQuerySnapshot = await getDocs(favsQuery);

      if (favsQuerySnapshot.empty) {
        // Tech user is not in favorites, add them
        await addDoc(collection(db, 'favs'), {
          techId: id,
          recruiterId: userFirebaseUID,
        });
        console.log("Relationship document added to 'favs' collection");

        setIsFavorite(true);
      } else {
        // Tech user is already in favorites, remove them
        const favsDocRef = favsQuerySnapshot.docs[0].ref;
        await deleteDoc(favsDocRef);
        console.log("Relationship document deleted in 'favs' collection");

        setIsFavorite(false);
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
          <FavoriteBorderOutlinedIcon onClick={addToFavorites} style={{ cursor: 'pointer', color: isFavorite ? 'red' : 'black' }} >
            Add this profile to favorites
          </FavoriteBorderOutlinedIcon>
        )}
      </div>
    </div>);
}

export default ContractorProfile;
