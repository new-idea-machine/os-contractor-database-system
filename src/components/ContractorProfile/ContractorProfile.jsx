import React, { useContext, useEffect, useState } from "react";
import "./ContractorProfile.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Footer, Navigation } from "../index";
import { contractorContext } from "../../contexts/ContractorContext";
import { skillsContext } from "../../contexts/SkillsContext";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "../../assets/avatar.png";
import PlaceIcon from "@mui/icons-material/Place";
import { Country } from "country-state-city";
import { authContext } from "../../contexts/auth";

import Chat from "../Chats/Chat"; // Import the Chat component

const ContractorProfile = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { contractorList } = useContext(contractorContext);
  const { skillsList } = useContext(skillsContext);
  const [contractorSkills, setContractorSkills] = useState([]);
  const allCountries = Country.getAllCountries();
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const [receiverData, setReceiverData] = useState(null);

  console.log("location", location);

  let contractorID;

  location.pathname === "/myProfile"
    ? (contractorID = props.data.id)
    : (contractorID = id);

  const contractData = contractorList.find(
    (contractor) => contractor.id === contractorID
  );

  // useEffect(() => {
  //   const contractorSkillsList = () => {
  //     contractorList?.forEach((contractor) => {
  //       if (id === contractor?.id || props?.data?.id === contractor?.id) {
  //         setContractorSkills(contractor?.skills || []);
  //       }
  //     });
  //   };
  //   contractorSkillsList();
  // }, [id, props?.data?.id, contractorList, skillsList]);

  // const isOwnProfile = contractorList.some((contractor) => {
  //   return (
  //     contractor?.firebaseUID === userUid &&
  //     (contractor?.id === id || contractor?.id === props?.data?.id)
  //   );
  // });

  // const handleChatClick = (contractorId) => {
  //   // Find the receiver data based on the contractor ID
  //   const receiver = contractorList.find(
  //     (contractor) => contractor.id === contractorId
  //   );
  //   if (receiver) {
  //     setReceiverData(receiver); // Set the receiver data in the state variable
  //     navigate("/Chat", { state: { receiverData: receiver } });
  //   }
  // };

  return (
    <>
      <Navigation />
      <div className="contractor_profile_container">
        <div className="contractor_profile">
          <div className="center">
            <div>
              <h1 className="contractor_header">
                {contractData.name} {contractData.lastName}
              </h1>
              <p className="contractor_qualification">
                {contractData.qualification}
              </p>
              <div className="contractor_chips_container">
                {contractData?.skills?.map((skill) => {
                  return (
                    <button
                      className="contractor_chips button"
                      data-text={skill.skill}
                    >
                      <span className="actual-text">
                        &nbsp;{skill.skill}&nbsp;
                      </span>
                      <span
                        className="hover-text"
                        aria-hidden="true"
                        data-text={skill.skill}
                      >
                        &nbsp;{skill.skill}&nbsp;
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="tab_container">
                <div className="tab">
                  <p className="tab_text">PROJECTS</p>
                </div>
              </div>
              <div className="contractor_info_container">
                {contractData.projects.map((project) => {
                  return (
                    <div className="contractor_info">
                      <h2 className="contractor_info_header">
                        {project.projectName}
                      </h2>
                      <p className="contractor_info_summary">
                        {project.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="about_me_container">
            <div className="profile_image_container">
              <img
                src={contractData.profileImg || Avatar}
                alt="Contractor headshot"
                className={contractData.profileImg ? "profile_image" : "avatar"}
              />
            </div>
            <article className="about_me">
              <h2 className="about_me_header">About {contractData.name}</h2>
              <hr className="line_break" />
              <p className="about_me_summary">{contractData.summary}</p>
            </article>
            <div className="about_me_links">
              {contractData?.otherInfo?.githubUrl && (
                <a href={contractData?.otherInfo?.githubUrl}>
                  <GitHubIcon className="icon" fontSize="large" />
                </a>
              )}
              {contractData?.otherInfo?.linkedinUrl && (
                <a href={contractData?.otherInfo?.linkedinUrl}>
                  <LinkedInIcon className="icon" fontSize="large" />
                </a>
              )}

              <button
                className="edit_button"
                onClick={() => {
                  navigate("/updateProfile");
                }}
              >
                <EditIcon class="edit_icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>

    // <div>
    //   <Navigation />
    //   {contractorList.map((contractor) =>
    //     id === contractor?.id || props?.data?.id === contractor?.id ? (
    //       <div className="contractor_profile" key={contractor.id}>
    //         {contractor?.profileImg ? (
    //           <div className="image_wrapper">
    //             <img src={contractor?.profileImg} alt="Contractor headshot" />
    //           </div>
    //         ) : (
    //           <div className="avatar_wrapper">
    //             <img src={Avatar} alt="Avatar" />
    //           </div>
    //         )}
    //         <div className="contractor_info">
    //           <div className="contractor_name">
    //             {contractor?.firstName}&nbsp;{contractor?.lastName}
    //           </div>
    //           <div className="contractor_qualification">
    //             {contractor?.qualification}
    //           </div>

    //           {contractor?.countryCode ? (
    //             <div>
    //               {allCountries.map((code) => {
    //                 if (code.isoCode === contractor?.countryCode)
    //                   return (
    //                     <div
    //                       key={code.isoCode}
    //                       style={{
    //                         display: "flex",
    //                         alignContent: "center",
    //                         paddingBottom: "10px",
    //                       }}
    //                     >
    //                       <PlaceIcon />
    //                       <div>{code.name},</div>
    //                       <div>&nbsp;{contractor?.stateCode},</div>
    //                       <div>&nbsp;{contractor?.city}</div>
    //                     </div>
    //                   );
    //               })}
    //             </div>
    //           ) : null}

    //           <div className="contractor_links">
    //             {contractor?.otherInfo?.githubUrl && (
    //               <a
    //                 href={contractor?.otherInfo?.githubUrl}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //               >
    //                 <GitHubIcon />
    //               </a>
    //             )}
    //             {contractor?.resume && (
    //               <a
    //                 style={{
    //                   cursor: "pointer",
    //                   margin: "0",
    //                   border: "0",
    //                   padding: "0",
    //                   width: "200px",
    //                 }}
    //                 href={contractor?.resume}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //               >
    //                 Download Resume
    //               </a>
    //             )}
    //           </div>
    //           <div className="contractor_summary">{contractor?.summary}</div>
    //           {contractor?.interests && (
    //             <div className="contractor_interests">
    //               <div
    //                 style={{
    //                   fontSize: "20px",
    //                   backgroundColor: "#D5D1D0",
    //                   width: "100%",
    //                   borderRadius: "5px",
    //                   marginTop: "10px",
    //                 }}
    //               >
    //                 <b style={{ paddingLeft: "5px" }}>Interests</b>
    //               </div>
    //               <div style={{ paddingLeft: "5px" }}>
    //                 {contractor?.interests}
    //               </div>
    //             </div>
    //           )}
    //           {contractor?.projects && (
    //             <div>
    //               <div
    //                 style={{
    //                   fontSize: "20px",
    //                   backgroundColor: "#D5D1D0",
    //                   width: "100%",
    //                   borderRadius: "5px",
    //                   marginTop: "10px",
    //                 }}
    //               >
    //                 <b style={{ paddingLeft: "5px" }}>Projects</b>
    //               </div>
    //               {contractor?.projects.map((project) => (
    //                 <div
    //                   key={project?.projectName}
    //                   style={{
    //                     marginTop: "5px",
    //                     marginBottom: "15px",
    //                     borderRadius: "5px",
    //                     borderColor: "#D5D1D0",
    //                     borderStyle: "solid",
    //                     borderWidth: "0.5px",
    //                     padding: "5px",
    //                   }}
    //                 >
    //                   <div>
    //                     <b>Project Name:</b>
    //                     <br /> {project?.projectName}
    //                   </div>
    //                   <div>
    //                     <b>Project Description:</b>
    //                     <br /> {project?.description}
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //           {contractorSkills.length > 0 && (
    //             <div>
    //               {contractorSkills?.map((skill, index) => {
    //                 return (
    //                   <Button
    //                     key={index}
    //                     style={{
    //                       width: "auto",
    //                       borderStyle: "solid",
    //                       borderWidth: "1px",
    //                       padding: "2px",
    //                       marginLeft: "5px",
    //                       textTransform: "capitalize",
    //                     }}
    //                   >
    //                     {skill.skill}
    //                   </Button>
    //                 );
    //               })}
    //             </div>
    //           )}
    //           {!isOwnProfile && (
    //             <div
    //               className="chatButton"
    //               onClick={() => handleChatClick(contractor.id)}
    //             >
    //               <span>Chat with {contractor?.firstName}</span>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     ) : null
    //   )}
    //   <Footer />
    //   {/* Pass the receiver data as a prop to the Chat component */}
    //   {receiverData && <Chat receiver={receiverData} />}
    // </div>
  );
};

export default ContractorProfile;
