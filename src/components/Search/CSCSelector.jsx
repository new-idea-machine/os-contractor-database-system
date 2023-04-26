import * as React from "react";
import { Country, State, City } from "country-state-city";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";

export default function CSCSelector(props) {
  const [country, setCountry] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [city, setCity] = React.useState(null);

  function isEmpty(obj) {
    if (obj === null) return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  useEffect(() => {
    if (
      props.initialCountry &&
      props.initialState &&
      props.initialCity &&
      !isEmpty(props.initialCountry) &&
      !isEmpty(props.initialState) &&
      !isEmpty(props.initialCity)
    ) {
      const foundCountry = Country.getCountryByCode(props.initialCountry);
      if (foundCountry) {
        setCountry(foundCountry.isoCode);
        const foundState = State.getStateByCodeAndCountry(
          props.initialState,
          foundCountry.isoCode
        );
        if (foundState) {
          setState(foundState.isoCode);
          const cities = City.getCitiesOfState(
            foundCountry.isoCode,
            foundState.isoCode
          );
          const foundCity = cities.find(
            (city) => city.name === props.initialCity
          );
          if (foundCity) {
            setCity(foundCity.name);
          }
        }
      }
    }
  }, [props.initialCountry, props.initialState, props.initialCity]);

  return (
    <div style={{ display: "flex", textAlign: "center" }}>
      <Box sx={{ width: 300 }}>
        <Autocomplete
value={!isEmpty(props.initialCountry) ? Country.getCountryByCode(props.initialCountry) : null}          
onChange={(event, value) => {
            setCountry(value ? value.isoCode : null);
            props.getCountry(value ? value.isoCode : null);
          }}
          onInputChange={(event, value) => {
            if (!value) {
              setCountry(null);
              props.getCountry(null);
            }
          }}
          id="combo-box-demo"
          options={Country.getAllCountries()}
          filterSelectedOptions
          getOptionLabel={(option) => option?.name || null}
          isOptionEqualToValue={(option, value) =>
            option.isoCode === value.isoCode
          }
          renderInput={(params) => (
            <TextField {...params} label="Country" size="small" />
          )}
        />
      </Box>
      {country ? (
        <Box sx={{ width: 300, marginLeft: "50px" }}>
          <Autocomplete
              value={!isEmpty(props.initialCountry) && !isEmpty(props.initialState) ? State.getStateByCodeAndCountry(props.initialState, props.initialCountry) : null}

            onChange={(event, value) => {
              setState(value ? value.isoCode : null);
              props.getState(value ? value.isoCode : null);
            }}
            onInputChange={(event, value) => {
              if (!value) {
                setState(null);
                props.getState(null);
              }
            }}
            id="combo-box-demo"
            options={State.getAllStates()
              .filter((stateValue) => stateValue.countryCode === country)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterSelectedOptions
            getOptionLabel={(option) => option?.name || null}
            isOptionEqualToValue={(option, value) =>
            //   {console.log("value", value)
            // console.log("option", option)}

              option.isoCode === value.isoCode &&
              option.countryCode === value.countryCode
            }
            renderInput={(params) => (
              <TextField {...params} label="State" size="small" />
            )}
          />
        </Box>
      ) : null}
      {state ? (
        <Box key={state} sx={{ width: 300, marginLeft: "50px" }}>
          <Autocomplete
         value={
          !isEmpty(props.initialState) && !isEmpty(props.initialCity)
            ? City.getCitiesOfState(props.initialCountry, props.initialState).find(
                (city) => city.name === props.initialCity
              )
            : null
        }

            onChange={(event, value) => {
              setCity(value ? value.name : null);
              props.getCity(value ? value.name : null);
            }}
            onInputChange={(event, value) => {
              if (!value) {
                setCity(null);
                props.getCity(null);
              }
            }}
            id="combo-box-demo"
            options={City.getAllCities()
              .filter((cityValue) => cityValue.stateCode === state)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterSelectedOptions
            getOptionLabel={(option) => option?.name || null}
            isOptionEqualToValue={(option, value) =>
              option.name === value.name && option.stateCode === value.stateCode
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
