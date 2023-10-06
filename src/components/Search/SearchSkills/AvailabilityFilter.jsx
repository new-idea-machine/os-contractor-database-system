import React from "react";
import { Radio } from "@mui/material";

export default function AvailabilityFilter({
  availabilityFilter,
  setAvailabilityFilter,
  onChange,
}) {
  const handleAvailabilityChange = (filter) => {
    setAvailabilityFilter(filter);
    onChange(filter);
  };

  const handleClearAvailability = () => {
    setAvailabilityFilter(""); 
    onChange("");
  };

  return (
    <div className="search_options">
      <h2>Search by Availability</h2>
      <div>
        <div className="search_options_radio" key="all">
          <Radio
            checked={availabilityFilter === "all"}
            onClick={() => handleAvailabilityChange("all")}
          />
          All
          <br />
        </div>
        <div className="search_options_radio" key="available">
          <Radio
            checked={availabilityFilter === "available"}
            onClick={() => handleAvailabilityChange("available")}
          />
          Available
          <br />
        </div>
        <div className="search_options_radio" key="unavailable">
          <Radio
            checked={availabilityFilter === "unavailable"}
            onClick={() => handleAvailabilityChange("unavailable")}
          />
          Unavailable
          <br />
        </div>
      </div>
      <div className="clear_button">
        <button onClick={handleClearAvailability}>Clear Availability</button>
      </div>
    </div>
  );
}
