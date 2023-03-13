import React from "react";
import "./contractorCard.css";
import { useNavigate } from "react-router-dom";

export default function ContractorCard({ data }) {
  const navigate = useNavigate();
  const pdfURL = data?.resume;

  return (
    <>
      <div
        className="contractorCard flexCenter"
        onClick={() => navigate(`/contractor/${data?.id}`)}
      >
        <div className="imageWrapper">
          <img src={data?.profileImg} alt="Contractor headshot" />
        </div>
        <h1 onClick={() => console.log(data?.name)}>{data?.name}</h1>
        <h3>{data?.email}</h3>
        {data?.resume && (
          <>
            <h4>Resume</h4>
            <iframe src={pdfURL} width="100%" height="200px" />
          </>
        )}
      </div>
    </>
  );

}
