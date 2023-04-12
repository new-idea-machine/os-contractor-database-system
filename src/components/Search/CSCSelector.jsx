import * as React from "react";
import { Country, State, City } from "country-state-city";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";

export default function CSCSelector(props) {
  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");

  return (
    <div style={{ display: "flex", textAlign: "center" }}>
      <Box sx={{ width: 300 }}>
        <Autocomplete
          onChange={(event, value) => {
            setCountry(value ? value.isoCode : "");
            props.getCountry(value ? value.isoCode : "");
          }}
          onInputChange={(event, value) => {
            if (!value) {
              setCountry("");
              props.getCountry("");
            }
          }}
          id="combo-box-demo"
          options={Country.getAllCountries()}
          filterSelectedOptions
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderInput={(params) => (
            <TextField {...params} label="Country" size="small" />
          )}
        />
      </Box>
      {country ? (
        <Box sx={{ width: 300, marginLeft: "50px" }}>
          <Autocomplete
            onChange={(event, value) => {
              setState(value ? value.isoCode : "");
              props.getState(value ? value.isoCode : "");
            }}
            onInputChange={(event, value) => {
              if (!value) {
                setState("");
                props.getState("");
              }
            }}
            id="combo-box-demo"
            options={State.getAllStates()
              .filter((stateValue) => stateValue.countryCode === country)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterSelectedOptions
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField {...params} label="State" size="small" />
            )}
          />
        </Box>
      ) : null}
      {state ? (
        <Box key={state} sx={{ width: 300, marginLeft: "50px" }}>
          <Autocomplete
            onChange={(event, value) => {
              setCity(value ? value.name : "");
              props.getCity(value ? value.name : "");
            }}
            onInputChange={(event, value) => {
              if (!value) {
                setCity("");
                props.getCity("");
              }
            }}
            id="combo-box-demo"
            options={City.getAllCities()
              .filter((cityValue) => cityValue.stateCode === state)
              .sort((a, b) => a.name.localeCompare(b.name))}
            filterSelectedOptions
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField {...params} label="City" size="small" />
            )}
          />
        </Box>
      ) : null}
    </div>
  );
}
