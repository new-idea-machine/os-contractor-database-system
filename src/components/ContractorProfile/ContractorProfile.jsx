import React, { useContext, useEffect, useState } from "react";
import "./ContractorProfile.css";
import { useParams } from "react-router-dom";
import { Navigation } from "../index";
import { contractorsContext } from "../../contexts/ContractorsContext";
import { skillsContext } from "../../contexts/SkillsContext";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlaceIcon from "@mui/icons-material/Place";
import { Country } from "country-state-city";
import { authContext } from '../../contexts/Authorization';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { db} from '../../firebaseconfig';
import { FieldValue } from 'firebase/firestore';
import ProfilePicture from "../ProfilePicture";

import {
	collection,
	 query,
	getDocs,
	 where,
	updateDoc,
  getDoc,
  addDoc,
  doc,
  deleteDoc

} from 'firebase/firestore';


import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { recruiterContext, getFavoriteList } from '../../contexts/RecruiterContext';

import { ReactComponent as IconChat } from "../../assets/icons/chat.svg";

const ContractorProfile = (props) => {
  const { id } = useParams();
  const contractorList = useContext(contractorsContext);
  const { skillsList } = useContext(skillsContext);
  const [contractorSkills, setContractorSkills] = useState([]);
  const allCountries = Country.getAllCountries();
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const { getFavoriteList } = useContext(recruiterContext);
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




  const getUserTypeFromFirestore = async (userUid) => {
    const techsQuery = query(
      collection(db, 'techs'),
      where('firebaseUID', '==', userUid)
    );

    const recruitersQuery = query(
      collection(db, 'recruiter'),
      where('firebaseUID', '==', userUid)
    );
    try {
      const techsDocSnapshot = await getDocs(techsQuery);
      const recruitersDocSnapshot = await getDocs(recruitersQuery);
      if (!techsDocSnapshot.empty) {
        console.log("User is a tech");
        setUserType('techs');
      } else if (!recruitersDocSnapshot.empty) {
        console.log("User is a recruiter");
        setUserType('recruiter');
      } else {
        console.log("User document not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      return null;
    }
  };



  useEffect(() => {
    const fetchUserType = async () => {
       await getUserTypeFromFirestore(userUid);

    };
    fetchUserType();
  }, [userUid]);
  console.log("Usertype:", userType)

  useEffect(() => {
    const contractorSkillsList = () => {
      contractorList?.forEach((contractor) => {
        if (id === contractor?.id || props?.data?.id === contractor?.id) {
          setContractorSkills(contractor?.skills || []);
        }

      });
    };
    contractorSkillsList();
  }, [id, props?.data?.id, contractorList, skillsList]);

  const isOwnProfile = contractorList.some((contractor) => {
    return contractor?.firebaseUID === userUid && (contractor?.id === id || contractor?.id === props?.data?.id);
  });






  return (
    <>
      {contractorList.map((contractor) =>
        id === contractor?.id || props?.data?.id === contractor?.id ? (
          <div id="ContractorProfile" key={contractor.id}>
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

              {!isOwnProfile && (
                <Link to={`/chat/${contractor.firebaseUID}`}>
                  <IconChat /> Chat
                </Link>
              )}
            </aside>

            <div>
              <header>
                <h1>{contractor?.firstName}&nbsp;{contractor?.lastName}</h1>
                <h4>{contractor?.qualification}</h4>

                <section>
                  {contractor?.countryCode ? allCountries.map((code) => {
                      if (code.isoCode === contractor?.countryCode)
                        return (
                          <div
                            key={code.isoCode}
                            style={{
                              display: "flex",
                              alignContent: "center",
                              paddingBottom: "10px",
                            }}
                          >
                            <PlaceIcon />
                            <div>{code.name},</div>
                            <div>&nbsp;{contractor?.stateCode},</div>
                            <div>&nbsp;{contractor?.city}</div>
                          </div>
                        );
                    }) : 
                    <>&nbsp;</>
                  }

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

                  {contractor?.projects.map((project) => (
                    <article key={project?.projectName}>
                      <h3>{project?.projectName ? project?.projectName : <>&lt;Untitled Project&gt;</>}</h3>
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
          </div>
        ) : null
      )}
    </>
  );
};

export default ContractorProfile;
