import React, { useContext, useEffect, useState } from "react";
import "./ContractorProfile.css";
import { useParams } from "react-router-dom";
import { Footer, Navigation } from "../index";
import { contractorContext } from "../../contexts/ContractorContext";
import { skillsContext } from "../../contexts/SkillsContext";

const ContractorProfile = (props) => {
  const { id } = useParams();
  const { contractorList } = useContext(contractorContext);
  const { skillsList } = useContext(skillsContext);
  const [contractorSkills, setContractorSkills] = useState([]);

  useEffect(() => {
    const contractorSkillsList = () => {
      contractorList?.map((contractor) => {
        if (id === contractor?.id || props?.data?.id === contractor?.id) {
          const result = skillsList?.filter(({ id }) =>
            contractor?.skillIds?.includes(id)
          );
          setContractorSkills(result);
        }
      });
    };
    contractorSkillsList();
  }, [id]);

  return (
    <div>
      <Navigation />
      {contractorList.map((contractor) =>
        id === contractor?.id || props?.data?.id === contractor?.id ? (
          <div className="contractor_profile" key={contractor.id}>
            <div className="image_wrapper">
              <img src={contractor?.profileImg} alt="Contractor headshot" />
            </div>
            <div className="contractor_info">
              <div className="contractor_name">{contractor?.name}</div>
              <a
                style={{ marginBottom: "10px" }}
                href={`mailto:${contractor?.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contractor?.email}
              </a>
              {contractor?.otherInfo?.githubUrl && (
                <a
                  href={contractor?.otherInfo?.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
              {contractor?.otherInfo?.linkedinUrl && (
                <a
                  style={{ marginBottom: "10px" }}
                  href={contractor?.otherInfo?.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {contractor?.projects && (
                <div>
                  Projects:{" "}
                  {contractor?.projects.map((project) => (
                    <div
                      key={project.id}
                      style={{
                        backgroundColor: "#D5D1D0",
                        marginTop: "5px",
                        marginBottom: "5px",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    >
                      <div>Project Name: {project?.projectName}</div>
                      <div>Project Description: {project?.description}</div>
                    </div>
                  ))}
                </div>
              )}
                {contractor?.skillIds && (
              <div>
                Skills:
                {contractorSkills.map((resultSkill) => {
                  console.log(resultSkill);
                  return <div key={resultSkill.id}>{resultSkill.title}</div>;
                })}
              </div>
                )}
              {contractor?.resume && (
                <a
                  style={{
                    cursor: "pointer",
                    margin: "0",
                    border: "0",
                    padding: "0",
                    width: "200px",
                  }}
                  href={contractor?.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </a>
              )}
            </div>
          </div>
        ) : null
      )}
      <Footer />
    </div>
  );
};

export default ContractorProfile;
