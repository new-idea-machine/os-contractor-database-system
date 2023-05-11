import React, { useContext, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer, Navigation } from "../index";
import "./Search.css";
import { Button, Checkbox, Chip } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { contractorContext } from "../../contexts/ContractorContext";
import CSCSelector from "./CSCSelector";
import Avatar from "../../assets/avatar.png";
import { skillsList } from "../../constants/skillsList.js";
import ClearSkill from "./ClearSkill";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";

export default function Search() {
  const navigate = useNavigate();
  const { contractorList } = useContext(contractorContext);
  const qualification = [
    "Developer",
    "Designer",
    "Product Manager",
    "Project Manager",
  ];
  const [selectedQualification, setSelectedQualification] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  // const filteredSkills = skillsList.filter(
  //   (skill) =>
  //     skill.toLowerCase().startsWith(inputValue.toLowerCase())
  // );
  const filteredSkills = inputValue
    ? skillsList.filter((skill) =>
        skill.toLowerCase().startsWith(inputValue.toLowerCase())
      )
    : skillsList;

  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const location = useLocation();
  const searchStateFromLocation = location.state?.searchState;

  const memoizedSearchState = useMemo(
    () => ({
      selectedOptQualification: selectedQualification,
      selectedOptions: selectedSkills,
      country,
      state,
      city,
    }),
    [selectedSkills, selectedQualification, country, state, city]
  );

  useEffect(() => {
    if (searchStateFromLocation) {
      setSelectedSkills(searchStateFromLocation.selectedOptions || []);
      setSelectedQualification(
        searchStateFromLocation.selectedOptQualification || []
      );
      setCountry(searchStateFromLocation.country || "");
      setState(searchStateFromLocation.state || "");
      setCity(searchStateFromLocation.city || "");
    } else {
      const savedState = JSON.parse(sessionStorage.getItem("searchState"));
      if (savedState) {
        setSelectedSkills(savedState.selectedOptions || []);
        setSelectedQualification(savedState.selectedOptQualification || []);
        setCountry(savedState.country || "");
        setState(savedState.state || "");
        setCity(savedState.city || "");
      }
    }
  }, [searchStateFromLocation]);

  const handleOptionQualificationChange = (option) => {
    const newSelectedOptions = selectedQualification.includes(option)
      ? selectedQualification.filter((title) => title !== option)
      : [...selectedQualification, option];
    setSelectedQualification(newSelectedOptions);
  };

  useEffect(() => {
    sessionStorage.setItem(
      "searchState",
      JSON.stringify({
        selectedOptQualification: selectedQualification,
        selectedOptions: selectedSkills,
        country,
        state,
        city,
      })
    );
    const contractorSkillsList = () => {
      const filteredContractors = [];
      for (const contractor of contractorList) {
        let numMatchingSkills = 0;

        if (selectedSkills.length > 0) {
          for (const option of selectedSkills) {
            if (contractor?.skills && contractor.skills.includes(option)) {
              numMatchingSkills++;
            }
          }
        } else {
          numMatchingSkills = 1;
        }

        // Filter contractors by qualification
        const isMatchingQualification =
          selectedQualification.length === 0 ||
          selectedQualification.includes(contractor.qualification);

        // Filter contractors by location (country, state, and city)
        const isMatchingLocation =
          (!country || contractor.countryCode === country) &&
          (!state || contractor.stateCode === state) &&
          (!city || contractor.city === city);

        const percentMatching = selectedSkills.length
          ? Math.round((numMatchingSkills / selectedSkills.length) * 100)
          : 100;

        const shouldShowContractor =
          numMatchingSkills > 0 &&
          isMatchingLocation &&
          isMatchingQualification;

        if (shouldShowContractor) {
          filteredContractors.push({
            ...contractor,
            percentMatching,
          });
        }
      }
      filteredContractors.sort((a, b) => {
        if (b.percentMatching === a.percentMatching) {
          return a.firstName.localeCompare(b.firstName);
        }
        return b.percentMatching - a.percentMatching;
      });
      setContractors(filteredContractors);
    };

    contractorSkillsList();
  }, [
    selectedSkills,
    selectedQualification,
    contractorList,
    country,
    state,
    city,
  ]);

  const handleClearLocation = () => {
    setCountry("");
    setState("");
    setCity("");
  };

  const handleClearSkills = () => {
    setSelectedSkills([]);
  };

  return (
    <div>
      <Navigation />
      <div className="search_container">
        <div
          style={{
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: "0.5px",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          <h2 className="search_title">Search by Qualification</h2>
          <div>
            <Grid container spacing={10} minHeight={120}>
              <Grid
                xs
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {qualification.map((option) => (
                  <div className="search_options" key={option}>
                    <Checkbox
                      checked={selectedQualification.includes(option)}
                      onChange={() => handleOptionQualificationChange(option)}
                    />
                    {option}
                    <br />
                  </div>
                ))}
              </Grid>
            </Grid>
          </div>
        </div>

        <div
          style={{
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: "0.5px",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0, marginBottom: "10px" }}>
            Search by Location
          </h2>

          <div className="search_location">
            <CSCSelector
              initialCountry={country}
              initialState={state}
              initialCity={city}
              getCountry={(country) => setCountry(country)}
              getState={(state) => setState(state)}
              getCity={(city) => setCity(city)}
            />
          </div>
          <div
            className="clear_button"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button onClick={handleClearLocation}>Clear location</button>
          </div>
        </div>
        <div
          style={{
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: "0.5px",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <h2 className="search_title">Search by Skill</h2>
          <div className="search_skills">
            <Autocomplete
              multiple
              disableClearable
              value={selectedSkills}
              onChange={(_, value) => setSelectedSkills(value)}
              sx={{ width: 350 }}
              inputValue={inputValue}
              onInputChange={(_, value) => setInputValue(value)}
              options={skillsList}
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
            <div style={{ display: "flex", flexDirection: "row" }}>
              {selectedSkills.map((skill) => (
                <ClearSkill
                  key={skill}
                  skill={skill}
                  onRemove={(removedSkill) => {
                    setSelectedSkills(
                      selectedSkills.filter((skill) => skill !== removedSkill)
                    );
                  }}
                />
              ))}
            </div>
          </div>
          <div
            className="clear_button"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button onClick={handleClearSkills}>Clear Skills</button>
          </div>
        </div>
        <ul>
          {contractors.length === 0 ? (
            <div className="no-results-message">No results</div>
          ) : (
            contractors.map((contractor) => (
              <div
                className="contractor_container"
                key={contractor?.id}
                onClick={() => {
                  navigate(`/contractor/${contractor?.id}`, {
                    state: {
                      searchState: memoizedSearchState,
                    },
                  });
                }}
              >
                <div style={{ marginLeft: "5px" }}>
                  <div style={{ minWidth: "60px" }}>
                    <b>{contractor?.percentMatching}%</b>
                  </div>
                  {contractor?.profileImg ? (
                    <img
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                      src={contractor?.profileImg}
                      alt=""
                    />
                  ) : (
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: "1px",
                        borderRadius: "5px",
                      }}
                      src={Avatar}
                      alt="Avatar"
                    />
                  )}
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <div>
                    <b>{contractor?.firstName}&nbsp;</b>
                    <b>{contractor?.lastName}&nbsp;</b>
                    <div className="contractor_qualification2">
                      {contractor?.qualification}
                    </div>
                  </div>
                  <div>{contractor.summary}</div>
                  <div>
                    {contractor?.skills && (
                      <div style={{ display: "flex" }}>
                        {contractor?.skills.map((resultSkill) => {
                          return (
                            <div key={resultSkill}>
                              <Button
                                style={{
                                  width: "auto",
                                  borderStyle: "solid",
                                  borderWidth: "1px",
                                  padding: "0.2px",
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                  marginLeft: "5px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {resultSkill}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
