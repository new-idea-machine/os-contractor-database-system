import React, { useContext } from "react";
import { Footer, Navigation } from "../index";
import "./Search.css";
import { useCheckbox } from "react-checkbox-hook";
import { Divider } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { skillsContext } from "../../contexts/SkillsContext";

export default function Search() {
  const options = [
    { id: "100", title: "ReactJS" },
    { id: "101", title: "NodeJS" },
    { id: "102", title: "ExpressJS" },
    { id: "103", title: "Firebase" },
    { id: "104", title: "MongoDB" },
  ];

  const { skillsList } = useContext(skillsContext);
  const skList = skillsList
  const { selectedOptions, handleOptionChange } = useCheckbox({options});
  console.log("selectedOptions", selectedOptions);

  
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
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
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
      </div>
      <Footer />
    </div>
  );
}
