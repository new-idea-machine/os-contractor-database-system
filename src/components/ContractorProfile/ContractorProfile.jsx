import React, { useContext } from "react";
import "./ContractorProfile.css";
import { useParams } from "react-router-dom";
import { contractorContext } from "../../contexts/ContractorContext";
import { Footer, Navigation } from "../index";

const ContractorProfile = () => {
  const { id } = useParams();
  const { contractorList } = useContext(contractorContext);
  // console.log("name", name)
  return (
    <div>
      <Navigation />
      {contractorList.map((contractor) => {
        if (id === contractor.id)
          return (
            <div className="contractor_profile" key={contractor.id}>
              <div className="image_wrapper">
                <img src={contractor?.profileImg} alt="Contractor headshot" />
              </div>
              <div className="contractor_info">
                <div className="contractor_name">{contractor.name}</div>
                {/* <a
                  href={contractor.email}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email
                </a> */}
                {/* <a
                  href={contractor.otherInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a> */}
                <div>{contractor.email}</div>
                <div>{contractor.otherInfo.linkedinUrl}</div>
                <div style={{marginBottom: "10px"}}>{contractor.otherInfo.githubUrl}</div>
                <div>Summary: {contractor.summary}</div>
                <div> Skills: </div>
                <div>Interests: </div>
                <div>Projects: </div>
              </div>
            </div>
          );
      })}
      <Footer />
    </div>
  );
};

export default ContractorProfile;
