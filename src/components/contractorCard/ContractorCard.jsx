import React from "react";
import "./contractorCard.css";
import { useNavigate } from "react-router-dom";
import Avatar from "../../assets/avatar.png";

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
          {data?.profileImg ? (
            <img src={data?.profileImg} alt="Contractor headshot" />
          ) : (
            <img src={Avatar} alt="Avatar" />
          )}
        </div>
        <h1 onClick={() => console.log(data?.name)}>
          {data?.firstName}&nbsp;{data?.lastName}
        </h1>
        <h3>{data?.email}</h3>
        {/* {data?.resume && (
          <>
            <h4>Resume</h4>
            <iframe src={pdfURL} width="100%" height="200px" />
          </>
        )} */}
      </div>
    </>
  );
}
