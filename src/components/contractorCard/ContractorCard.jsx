import React from "react";
import "./contractorCard.css";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePicture";

export default function ContractorCard({ data }) {
  const navigate = useNavigate();
  const pdfURL = data?.resume;


  return (
    <>
      <div
        className="contractorCard flexCenter"
        onClick={() => navigate(`/contractor/${data?.id}`)}
      >
        <ProfilePicture profileImage={data?.profileImg} size="130px" />

        <h1 onClick={() => console.log(data?.name)}>
          {data?.firstName}&nbsp;{data?.lastName}
        </h1>
        <h3>{data?.qualification}</h3>
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
