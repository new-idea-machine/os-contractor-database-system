import CSCSelector from "./CSCSelector/CSCSelector";
import { userProfileContext } from "../../contexts/UserProfileContext";
import Navigation from "../navigation/Navigation";
import { useContext, useState, useRef, useEffect } from "react";
import SearchSkills from "./SearchSkills/SearchSkills";
import style from "./Search.module.css";
import { qualificationsList, workSiteList } from "../../constants/data";
import ContractorProfile from "../ContractorProfile/ContractorProfile";
import MatchCard from "../MatchCard";

export default function Search() {
  const contractorList = useContext(userProfileContext).contractors;
  const [contractors, setContractors] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState([]);
  const [selectedWorkSite, setSelectedWorkSite] = useState([]);
  const contractorListRef = useRef(null);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0.0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo(0.0, selectedContractor ? 0.0 : scrollPosition);
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [selectedContractor, scrollPosition]);

  const filterContractors = () => {
    const calculatePercentMatching = (contractor) => {
      if (selectedSkills.length === 0) return "";
      const matchingSkills = contractor.skills.filter((skill) =>
        selectedSkills.includes(skill.skill)
      ).length;

      return Math.round((matchingSkills / selectedSkills.length) * 100);
    };

    return contractorList
      .filter(
        (contractor) =>
          contractor.availability === "Full Time" ||
          contractor.availability === "Part Time"
      )
      .filter(
        (contractor) =>
          selectedQualification.length === 0 ||
          selectedQualification.includes(contractor.qualification)
      )
      .filter((contractor) => {
        if (selectedSkills.length === 0) return true;
        return contractor.skills.some((skill) =>
          selectedSkills.includes(skill.skill)
        );
      })
      .filter((contractor) => {
        if (selectedWorkSite.length === 0) return true;
        const contractorWorkSites = Array.isArray(contractor.workSite)
          ? contractor.workSite
          : (contractor.workSite
          ? [contractor.workSite]
          : []);
        return selectedWorkSite.some((worksite) =>
          contractorWorkSites
            .map((ws) => ws.trim().toLowerCase())
            .includes(worksite.trim().toLowerCase())
        );
      })
      .filter((contractor) => {
        if (!country && !state && !city) return true;
        const matchingLocation = contractor.location.toLowerCase();

        return (
          (!country || matchingLocation.includes(country.toLowerCase())) &&
          (!state || matchingLocation.includes(state.toLowerCase())) &&
          (!city || matchingLocation.includes(city.toLowerCase()))
        );
      })
      .map((contractor) => ({
        ...contractor,
        percentMatching: calculatePercentMatching(contractor),
      }));
  };

  const handleOptionQualificationChange = (option) => {
    setSelectedQualification(
      selectedQualification.includes(option) ? [] : [option]
    );
    setSelectedSkills([]);
  };

  const handleOptionWorkSiteChange = (option) => {
    setSelectedWorkSite(selectedWorkSite.includes(option) ? [] : [option]);
  };

  const handleClearAll = () => {
    setSelectedQualification([]);
    setSelectedSkills([]);
    setSelectedWorkSite([]);

    setCountry("");
    setState("");
    setCity("");

    setContractors([]);
  };

  const handleSearch = () => {
    const isFilterApplied =
      selectedSkills.length > 0 ||
      selectedQualification.length > 0 ||
      selectedWorkSite.length > 0 ||
      country ||
      state ||
      city;

    if (isFilterApplied) {
      setContractors(filterContractors());
      setTimeout(() => {
        if (contractorListRef.current) {
          contractorListRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    } else {
      setContractors([]);
    }
  };

  return (
    <div>
      <Navigation />
      <main>
        <h1>Search</h1>
        {!selectedContractor && (
          <div className={style.search_container}>
            <div>
              <p className={style.search_description}>
                &quot;Our success is determined by new developers finding career
                positions in other companies. We foster skill, determine will,
                and help to establish the right attitude in new devs, reducing
                your risk of hiring for your own development team.&quot;
              </p>
              <div className={style.search_qualification_container}>
                <p>Search by qualifications</p>
                <div>
                  {qualificationsList.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={selectedQualification.includes(option)}
                        onChange={() => handleOptionQualificationChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <SearchSkills
              selectedQualification={selectedQualification}
              initialSelectedSkills={selectedSkills}
              getSelectedSkills={(skill) => setSelectedSkills(skill)}
            />
            <div className={style.search_worksite_container}>
              <p>Search by worksite</p>
              <div>
                {workSiteList.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedWorkSite.includes(option)}
                      onChange={() => handleOptionWorkSiteChange(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>{" "}
            </div>
            {(selectedWorkSite.includes("On Site") ||
              selectedWorkSite.includes("Hybrid")) && (
              <div className={style.search_location_container}>
                <p>Search by location</p>
                <div>
                  <CSCSelector
                    initialCountry={country}
                    initialState={state}
                    initialCity={city}
                    getCountry={(country) => setCountry(country)}
                    getState={(state) => setState(state)}
                    getCity={(city) => setCity(city)}
                  />
                </div>
              </div>
            )}
            <div className={style.button_container}>
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleClearAll}>Clear All</button>
            </div>
          </div>
        )}
        {!selectedContractor && (
          <ul ref={contractorListRef}>
            {contractors.length > 0 ? (
              <>
                <div className={style.message}>
                  {contractors.length === 1
                    ? "1 match"
                    : `${contractors.length} matches`}{" "}
                  for your project!
                </div>
                {contractors.map((contractor) => (
                  <div key={contractor?.id}>
                    <MatchCard
                      contractor={contractor}
                      onClick={() => {
                        setScrollPosition(window.scrollY);
                        setSelectedContractor(contractor);
                      }}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className={style.message}>
                No contractors found for your search criteria.
              </div>
            )}
          </ul>
        )}
        {selectedContractor && (
          <ContractorProfile
            data={selectedContractor}
            onClose={() => setSelectedContractor(null)}
          />
        )}
      </main>
    </div>
  );
}
