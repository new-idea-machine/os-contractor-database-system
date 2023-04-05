import React, { useContext, useEffect, useState } from 'react';
import './ContractorProfile.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Footer, Navigation } from '../index';
import { contractorContext } from '../../contexts/ContractorContext';
import { skillsContext } from '../../contexts/SkillsContext';
import { Button } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ContractorProfile = (props) => {
	const { id } = useParams();
	const { contractorList } = useContext(contractorContext);
	const { skillsList } = useContext(skillsContext);
	const [contractorSkills, setContractorSkills] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const contractorSkillsList = () => {
			contractorList?.map((contractor) => {
				if (id === contractor?.id || props?.data?.id === contractor?.id) {
					const result = skillsList?.filter(({ id }) =>
						contractor?.skillIds?.includes(id)
					);
					result.sort((a, b) => (a.title > b.title ? 1 : -1));
					setContractorSkills(result);
				}
				return null;
			});
		};
		contractorSkillsList();
	}, [id, props?.data?.id, contractorList, skillsList]);
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
              <div className="contractor_links">
                <a
                  style={{ marginBottom: "10px" }}
                  href={`mailto:${contractor?.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MailOutlineIcon />
                </a>
                {contractor?.otherInfo?.githubUrl && (
                  <a
                    href={contractor?.otherInfo?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon />
                  </a>
                )}
                {contractor?.otherInfo?.linkedinUrl && (
                  <a
                    style={{ marginBottom: "10px" }}
                    href={contractor?.otherInfo?.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                  </a>
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
              <div className="contractor_summary">{contractor?.summary}</div>
              {contractor?.interests && (
                <div className="contractor_interests">
                  <div
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#D5D1D0",
                      width: "100%",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <b style={{ paddingLeft: "5px" }}>Interests</b>
                  </div>
                  <div style={{ paddingLeft: "5px" }}>
                    {contractor?.interests}
                  </div>
                </div>
              )}
              {contractor?.projects && (
                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#D5D1D0",
                      width: "100%",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <b style={{ paddingLeft: "5px" }}>Projects</b>
                  </div>
                  {contractor?.projects.map((project) => (
                    <div
                      key={project?.projectName}
                      style={{
                        marginTop: "5px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        borderColor: "#D5D1D0",
                        borderStyle: "solid",
                        borderWidth: "0.5px",
                        padding: "5px",
                      }}
                    >
                      <div>
                        <b>Project Name:</b>
                        <br /> {project?.projectName}
                      </div>
                      <div>
                        <b>Project Description:</b>
                        <br /> {project?.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {contractor?.skillIds && (
                <div>
                  {contractorSkills?.map((resultSkill) => {
                    return (
                      <Button
                        key={resultSkill.id}
                        style={{
                          width: "auto",
                          borderStyle: "solid",
                          borderWidth: "1px",
                          padding: "2px",
                          marginLeft: "5px",
                          textTransform: "capitalize",
                        }}
                      >
                        {resultSkill.title}
                      </Button>
                    );
                  })}
                </div>
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
