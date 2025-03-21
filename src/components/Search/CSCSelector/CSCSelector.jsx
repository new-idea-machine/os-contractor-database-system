import React, { useEffect } from "react";
import "./CSCSelector.css";
import { Country, State, City } from "country-state-city";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";

export default function CSCSelector(props) {
  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");

  function isEmpty(obj) {
    if (obj === "") return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  useEffect(() => {
    if (
      props?.initialCountry &&
      props?.initialState &&
      props?.initialCity &&
      !isEmpty(props?.initialCountry) &&
      !isEmpty(props?.initialState) &&
      !isEmpty(props?.initialCity)
    ) {
      const foundCountry = Country.getCountryByCode(props?.initialCountry);
      if (foundCountry) {
        setCountry(foundCountry?.isoCode);
        const foundState = State.getStateByCodeAndCountry(
          props?.initialState,
          foundCountry?.isoCode
        );
        if (foundState) {
          setState(foundState?.isoCode);
        }
      }
    }
  }, [props.initialCountry, props.initialState, props.initialCity]);

  return (
    <div className="selector_container">
      <Box className="selector_country">
        <Autocomplete
          value={
            !isEmpty(props?.initialCountry)
              ? Country.getCountryByCode(props?.initialCountry)
              : null
          }
          onChange={(event, value) => {
            setCountry(value ? value?.isoCode : "");
            props?.getCountry(value ? value?.isoCode : "");
          }}
          onInputChange={(event, value) => {
            if (!value) {
              setCountry("");
              props?.getCountry("");
            }
          }}
          id="combo-box-demo"
          options={Country.getAllCountries()}
          filterOptions={(options, params) => {
            const filtered = options.filter((option) =>
              option.name
                .toLowerCase()
                .startsWith(params.inputValue.toLowerCase())
            );
            return filtered;
          }}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.isoCode === value?.isoCode
          }
          renderInput={(params) => (
            <TextField {...params} label="Country" size="small" />
          )}
        />
      </Box>
      {country ? (
        <Box className="selector_country_state">
          <Autocomplete
            value={
              !isEmpty(props?.initialCountry) && !isEmpty(props?.initialState)
                ? State.getStateByCodeAndCountry(
                    props?.initialState,
                    props?.initialCountry
                  )
                : null
            }
            onChange={(event, value) => {
              setState(value ? value?.isoCode : "");
              props?.getState(value ? value?.isoCode : "");
            }}
            onInputChange={(event, value) => {
              if (!value) {
                setState("");
                props?.getState("");
              }
            }}
            id="combo-box-demo"
            options={State.getAllStates()
              .filter((stateValue) => stateValue?.countryCode === country)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) =>
                option.name
                  .toLowerCase()
                  .startsWith(params.inputValue.toLowerCase())
              );
              return filtered;
            }}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) =>
              option?.isoCode === value?.isoCode &&
              option?.countryCode === value?.countryCode
            }
            renderInput={(params) => (
              <TextField {...params} label="State" size="small" />
            )}
          />
        </Box>
      ) : null}
      {state ? (
        <Box key={state} className="selector_state_city">
          <Autocomplete
            value={
              !isEmpty(props?.initialState) && !isEmpty(props?.initialCity)
                ? City.getCitiesOfState(country, state).find(
                    (city) => city?.name === props?.initialCity
                  )
                : null
            }
            onChange={(event, value) => {
              props.getCity(value ? value?.name : "");
            }}
            onInputChange={(event, value) => {
              if (!value) {
                props?.getCity("");
              }
            }}
            id="combo-box-demo"
            options={City.getCitiesOfState(country, state)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) =>
                option.name
                  .toLowerCase()
                  .startsWith(params.inputValue.toLowerCase())
              );
              return filtered;
            }}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) =>
              option?.name === value?.name &&
              option?.stateCode === value?.stateCode
            }
            renderInput={(params) => (
              <TextField {...params} label="City" size="small" />
            )}
          />
        </Box>
      ) : null}
    </div>
  );
}
