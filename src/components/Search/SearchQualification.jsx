import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Navigation } from "../index";

const SearchQualification = () => {
  const navigate = useNavigate();
  return (
    <div >
      <Navigation />

      <div style={{ textAlign: "center", marginTop: "40px", height: "100vh" }}>
        <div>
        What you are looking for?
      </div>
      <div className="search_qualification">
        <button onClick={() => navigate(`/search/developers`)}>
          Developers
        </button>
        <button onClick={() => navigate(`/search/designers`)}>Designers</button>
        <button onClick={() => navigate(`/search/projectmanagers`)}>Project Managers</button>
        <button onClick={() => navigate(`/search/productmanagers`)}>Product Managers</button>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchQualification;
