import React, { useContext, useEffect, useState } from "react";
import { Footer, Navigation } from "../index";
import "./Search.css";
import { useCheckbox } from "react-checkbox-hook";
import { Button, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { skillsContext } from "../../contexts/SkillsContext";
import { contractorContext } from "../../contexts/ContractorContext";
import { useNavigate } from "react-router-dom";

export default function Search() {
  //This doesn't have any use. It looks it just have to be on line 17 (used library "react-checkbox-hook")
  const options = [{ id: "100", title: "ReactJS" }];

  const navigate = useNavigate();
  const { skillsList } = useContext(skillsContext);
  const { selectedOptions, handleOptionChange } = useCheckbox({ options });
  const { contractorList } = useContext(contractorContext);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    const contractorSkillsList = () => {
      const filteredContractors = [];
      for (const contractor of contractorList) {
        let numMatchingSkills = 0;
        for (const option of selectedOptions) {
          if (contractor.skillIds.includes(option)) {
            numMatchingSkills++;
          }
        }
        const percentMatching = Math.round(
          (numMatchingSkills / selectedOptions.length) * 100
        );
        if (numMatchingSkills > 0) {
          filteredContractors.push({
            ...contractor,
            percentMatching,
          });
        }
      }
      filteredContractors.sort((a, b) => b.percentMatching - a.percentMatching);
      setContractors(filteredContractors);
    };
    contractorSkillsList();
  }, [selectedOptions, contractorList]);

  return (
    <div>
      <Navigation />
      <div className="search_container">
        <div className="search_title">Search by Skill</div>
        <div>
          <Grid container spacing={10} minHeight={160}>
            <Grid xs display="flex" justifyContent="center" alignItems="center">
              {skillsList.map((option) => (
                <div className="search_options" key={option.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={(e) =>
                        handleOptionChange(option, e.target.checked)
                      }
                    />
                    {option.title}
                  </label>
                  <br />
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
        <Divider />
        <div className="search_results">Results</div>
        <ul>
          {contractors.map((contractor) => (
            <div
              className="contractor_container"
              key={contractor.id}
              onClick={() => navigate(`/contractor/${contractor?.id}`)}
            >
              <div style={{ marginLeft: "5px" }}>
                <div style={{ minWidth: "60px" }}>
                  <b>{contractor.percentMatching}%</b>
                </div>
                <img
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                  src={contractor.profileImg}
                />
              </div>
              <div style={{ marginLeft: "5px" }}>
                <div>
                  <b>{contractor.name}</b>
                </div>
                <div>{contractor.summary}</div>
                <div>
                  {contractor?.skillIds && (
                    <div style={{ display: "flex" }}>
                      {contractor?.skillIds.map((resultSkill) => {
                        const allSkills = skillsList?.filter(({ id }) =>
                          resultSkill.includes(id)
                        );
                        return (
                          <div key={resultSkill}>
                            {allSkills.map((r) => (
                              <Button
                                key={r.id}
                                style={{
                                  borderStyle: "solid",
                                  borderWidth: "1px",
                                  padding: "0.2px",
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                  marginLeft: "5px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {r.title}
                              </Button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
