import React from "react";
import "./contractorCard.css";
import ProfilePicture from "../ProfilePicture";

export default function ContractorCard({ data, onClick }) {

  return (
    <>
      <div className="card contractorCard flexCenter" onClick={onClick}>
        <ProfilePicture profileImage={data?.profileImg} size="130px" />

        <h1>{data?.firstName}&nbsp;{data?.lastName}</h1>
        <h3>{data?.qualification}</h3>
      </div>
    </>
  );
}
