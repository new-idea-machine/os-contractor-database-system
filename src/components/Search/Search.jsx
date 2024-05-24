import AvailabilityFilter from "./SearchSkills/AvailabilityFilter";
import { Radio } from "@mui/material";
import CSCSelector from "./CSCSelector/CSCSelector";
import { contractorContext } from "../../contexts/ContractorContext";
import { Navigation } from "../index";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useContext, useEffect, useState, useMemo } from "react";
import SearchSkills from "./SearchSkills/SearchSkills";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";

const avatarURL = "/assets/avatar.png";

export default function Search() {
  const navigate = useNavigate();
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // Default to "all"
  const { contractorList } = useContext(contractorContext);
  const [city, setCity] = React.useState("");
  const [contractors, setContractors] = useState([]);
  const [country, setCountry] = React.useState("");
  const location = useLocation();
  const [state, setState] = React.useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState([]);
  const searchStateFromLocation = location.state?.searchState;
  const qualification = [
    "Developer",
    "Designer",
    "Product Manager",
    "Project Manager",
  ];

  const memoizedSearchState = useMemo(
    () => ({
      selectedQualification,
      selectedSkills,
      country,
      state,
      city,
    }),
    [selectedSkills, selectedQualification, country, state, city]
  );

  useEffect(() => {
    const clearSessionStorage = () => {
      sessionStorage.removeItem("searchState");
    };

    window.addEventListener("beforeunload", clearSessionStorage);
    if (searchStateFromLocation) {
      setSelectedSkills(searchStateFromLocation.selectedSkills || []);
      setSelectedQualification(
        searchStateFromLocation.selectedQualification || []
      );
      setCountry(searchStateFromLocation.country || "");
      setState(searchStateFromLocation.state || "");
      setCity(searchStateFromLocation.city || "");
    } else {
      const savedState = JSON.parse(sessionStorage.getItem("searchState"));
      if (savedState) {
        setSelectedSkills(savedState.selectedSkills || []);
        setSelectedQualification(savedState.selectedQualification || []);
        setCountry(savedState.country || "");
        setState(savedState.state || "");
        setCity(savedState.city || "");
      }
    }
    return () => {
      window.removeEventListener("beforeunload", clearSessionStorage);
    };
  }, [searchStateFromLocation]);

  const handleOptionQualificationChange = (option) => {
    setSelectedQualification(
      selectedQualification.includes(option) ? [] : [option]
    );
    setSelectedSkills([]);
  };

  useEffect(() => {
    sessionStorage.setItem(
      "searchState",
      JSON.stringify({
        selectedQualification,
        selectedSkills: selectedSkills || [],
        country,
        state,
        city,
      })
    );
    const contractorFilteredList = () => {
      const filteredContractors = filterContractorsByAvailability(
        contractorList,
        availabilityFilter
      );
      for (const contractor of contractorList) {
        let numMatchingSkills = 0;

        if (selectedSkills.length > 0) {
          for (const option of selectedSkills) {
            if (contractor?.skills) {
              const matchingSkills = contractor.skills.filter(
                (skill) => skill.skill === option
              );
              console.log("matching skills ", matchingSkills );
              numMatchingSkills += matchingSkills.length;
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
          return (a.firstName || "").localeCompare(b.firstName || "");
        }
        return b.percentMatching - a.percentMatching;
      });
      setContractors(filteredContractors);
    };

    contractorFilteredList();
  }, [
    availabilityFilter,
    city,
    contractorList,
    country,
    state,
    selectedSkills,
    selectedQualification,
  ]);

  const handleClearQualification = () => {
    setSelectedQualification([]);
  };

  const handleClearLocation = () => {
    setCountry("");
    setState("");
    setCity("");
  };

  function filterContractorsByAvailability(contractorList, availabilityFilter) {
    return contractorList.filter((contractor) => {
      if (availabilityFilter === "all") {
        return true; // Include all contractors
      } else if (availabilityFilter === "available") {
        return contractor.availability === "available";
      } else if (availabilityFilter === "unavailable") {
        return contractor.availability === "unavailable";
      }
      return false; // Default to not including the contractor
    });
  }

  return (
    <div>
      <Navigation />
      <main className="search_container">
        <AvailabilityFilter
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          onChange={(filter) => setAvailabilityFilter(filter)}
        />
        <div className="search_options">
          <h2>Search by Qualification</h2>
          <div>
            <Grid container spacing={10} minHeight={120}>
              <Grid
                xs
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {qualification.map((option) => (
                  <div className="search_options_radio" key={option}>
                    <Radio
                      checked={selectedQualification.includes(option)}
                      onClick={() => handleOptionQualificationChange(option)}
                    />
                    {option}
                    <br />
                  </div>
                ))}
              </Grid>
            </Grid>
            <div className="clear_button">
              <button onClick={handleClearQualification}>
                Clear Qualification
              </button>
            </div>
          </div>
        </div>
        <SearchSkills
          selectedQualification={selectedQualification}
          initialSelectedSkills={selectedSkills}
          getSelectedSkills={(skill) => setSelectedSkills(skill)}
        />

        <div className="search_options">
          <h2>Search by Location</h2>

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
          <div className="clear_button">
            <button onClick={handleClearLocation}>Clear location</button>
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
                <div className="result_container">
                  <div className="result_percent">
                    <b>{contractor?.percentMatching}%</b>
                  </div>
                  {contractor?.profileImg ? (
                    <div className="result_profile_image">
                      <img src={contractor?.profileImg} alt="" />
                    </div>
                  ) : (
                    <div className="result_no_image">
                      <img src={avatarURL} alt="Avatar" />
                    </div>
                  )}
                </div>
                <div className="result_info">
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
                      <div className="result_skills_btns">
                        {contractor?.skills.map((resultSkill, index) => {
                          return (
                            <span key={index} className="badge">
                              {resultSkill.skill}
                            </span>
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
      </main>
    </div>
  );
}
