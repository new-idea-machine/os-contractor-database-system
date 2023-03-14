import React, { useContext, useEffect, useState } from "react";
import { Footer, Navigation } from "../index";
import "./Search.css";
import { useCheckbox } from "react-checkbox-hook";
import { Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { skillsContext } from "../../contexts/SkillsContext";
import { contractorContext } from "../../contexts/ContractorContext";

export default function Search() {
  //This doesn't have any use. It looks it just have to be on line 17 (used library "react-checkbox-hook")
  const options = [{ id: "100", title: "ReactJS" }];

  const { skillsList } = useContext(skillsContext);
  const { selectedOptions, handleOptionChange } = useCheckbox({ options });
  const { contractorList } = useContext(contractorContext);
  const [contractors, setContractors] = useState([]);

  console.log("selectedOptions", selectedOptions);
  console.log("contractorList", contractorList);
  console.log("contractors", contractors);

  useEffect(() => {
    const contractorSkillsList = () => {
      contractorList?.map((contractor) => {
        selectedOptions?.filter((id) => {
          contractor?.skillIds?.includes(id);
        });
        setContractors(contractor);
      });
    };
    contractorSkillsList();
  }, [selectedOptions]);

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
        <div>{contractors.name}</div>
      </div>
      <Footer />
    </div>
  );
}
