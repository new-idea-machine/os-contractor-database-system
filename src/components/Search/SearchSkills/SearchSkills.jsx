import React, { useEffect, useState } from "react";
import "./SearchSkills.css";
import { developerSkills } from "../../../constants/skills/developerSkills.js";
import { designerSkills } from "../../../constants/skills/designerSkills";
import { productManagerSkills } from "../../../constants/skills/productManagerSkills";
import { projectManagerSkills } from "../../../constants/skills/projectManagerSkills";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchSkills(props) {
  const [selectedSkills, setSelectedSkills] = useState(
    props.initialSelectedSkills || []
  );
  const [allSkills, setAllSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const selectedQualification = props.selectedQualification;

  useEffect(() => {
    const updateAllSkills = () => {
      let newAllSkills = [];

      if (selectedQualification.length === 0) {
        // Add all skills when no qualification is selected
        newAllSkills = [
          ...developerSkills,
          ...designerSkills,
          ...productManagerSkills,
          ...projectManagerSkills,
        ];
      } else {
        selectedQualification.forEach((qualification) => {
          switch (qualification) {
            case "Developer":
              newAllSkills = [...newAllSkills, ...developerSkills];
              break;
            case "Designer":
              newAllSkills = [...newAllSkills, ...designerSkills];
              break;
            case "Product Manager":
              newAllSkills = [...newAllSkills, ...productManagerSkills];
              break;
            case "Project Manager":
              newAllSkills = [...newAllSkills, ...projectManagerSkills];
              break;
            default:
              break;
          }
        });
      }
      // Remove duplicates and sort
      newAllSkills = [...new Set(newAllSkills)].sort((a, b) =>
        a.localeCompare(b)
      );
      setAllSkills(newAllSkills);
    };
    updateAllSkills();
  }, [selectedQualification]);

  const handleClearSkills = () => {
    setSelectedSkills([]);
    props.getSelectedSkills([]);
  };

  useEffect(() => {
    setSelectedSkills(props.initialSelectedSkills || []);
  }, [props.initialSelectedSkills]);

  return (
    <div className="search_skills_container">
      <h2 className="search_skills_title">Search by Skill</h2>
      <div className="search_skills">
        <Autocomplete
          className="autocomplete"
          multiple
          disableClearable
          value={selectedSkills}
          onChange={(_, value) => {
            setSelectedSkills(value);
            props.getSelectedSkills(value);
          }}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          options={allSkills}
          getOptionLabel={(option) =>
            option.toLowerCase().startsWith(inputValue.toLowerCase())
              ? option
              : ""
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select skills"
              placeholder="Search for skills"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: <div>{params.InputProps.endAdornment}</div>,
              }}
            />
          )}
          renderTags={() => null}
        />
        <div className="selected_skills_container">
          {selectedSkills.map((skill) => (
            <div key={skill} className="selected_skills">
              <span>{skill}</span>
              <CloseIcon
                className="close_icon"
                onClick={() => {
                  const updatedSkills = selectedSkills.filter(
                    (s) => s !== skill
                  );
                  setSelectedSkills(updatedSkills);
                  props.getSelectedSkills(updatedSkills);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="clear_skills_button">
        <button onClick={handleClearSkills}>Clear Skills</button>
      </div>
    </div>
  );
}
