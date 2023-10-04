import React from "react";
import { Radio } from "@mui/material";

export default function AvailabilityFilter({ availabilityFilter, onChange }) {
  return (
    <div className="search_options">
      <h2>Search by Availability</h2>
      <div>
        {/* Radio buttons for availability filter */}
        <div className="search_options_radio" key="all">
          <Radio
            checked={availabilityFilter === "all"}
            onClick={() => onChange("all")}
          />
          All
          <br />
        </div>
        <div className="search_options_radio" key="available">
          <Radio
            checked={availabilityFilter === "available"}
            onClick={() => onChange("available")}
          />
          Available
          <br />
        </div>
        <div className="search_options_radio" key="unavailable">
          <Radio
            checked={availabilityFilter === "unavailable"}
            onClick={() => onChange("unavailable")}
          />
          Unavailable
          <br />
        </div>
      </div>
    </div>
  );
}
