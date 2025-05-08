import React, { useContext, useEffect, useState } from "react";
import style from "./SearchSkills.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FixedSizeList as List } from "react-window";
import { skillsContext } from "../../../contexts/SkillsContext";

// To load list of skills faster
const ListboxComponent = React.forwardRef((props, ref) => {
  const { children, ...other } = props;
  const itemCount = React.Children.count(children);
  const itemSize = 36;

  const height = Math.min(itemCount * itemSize, itemSize * 8);

  return (
    <div ref={ref} {...other}>
      <List
        height={height}
        width="100%"
        itemSize={itemSize}
        itemCount={itemCount}
        overscanCount={5}
        innerElementType="div"
        outerElementType="div"
        innerRef={ref}
        style={{
          ...(itemCount <= 8
            ? { overflow: "hidden", overscrollBehavior: "contain" }
            : {}),
        }}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    </div>
  );
});

export default function SearchSkills(props) {
  const [selectedSkills, setSelectedSkills] = useState(
    props.initialSelectedSkills || []
  );
  const [allSkills, setAllSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const selectedQualification = props.selectedQualification;
  const { skillsLists } = useContext(skillsContext);

  useEffect(() => {
    const updateAllSkills = () => {
      let newAllSkills = [];

      if (selectedQualification.length === 0) {
        // Add all skills when no qualification is selected
        for (const skills in skillsLists) {
          newAllSkills.push(...skillsLists[skills]);
        }
      } else {
        for (const qualification of selectedQualification) {
          if (skillsLists[qualification]) {
            newAllSkills.push(...skillsLists[qualification]);
          }
        }
      }
      // Remove duplicates and sort
      newAllSkills = [...new Set(newAllSkills)].sort((a, b) =>
        a.localeCompare(b)
      );
      setAllSkills(newAllSkills);
    };

    updateAllSkills();
  }, [skillsLists, selectedQualification]);

  useEffect(() => {
    setSelectedSkills(props.initialSelectedSkills || []);
  }, [props.initialSelectedSkills]);

  return (
    <div className={style["search_skills_container"]}>
      <p>Search by skills</p>
      <div className={style["autocomplete_container"]}>
        <Autocomplete
          className={style["autocomplete"]}
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
          ListboxComponent={ListboxComponent}
        />
        <div className={style["selected_skills_container"]}>
          {selectedSkills.map((skill) => (
            <div key={skill} className={style["selected_skills"]}>
              <span>{skill}</span>
              <CloseIcon
                className={style["close_icon"]}
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
    </div>
  );
}