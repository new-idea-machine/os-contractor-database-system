import React, { useContext } from "react";
import "./ContractorProfile.css";
import { useParams } from "react-router-dom";
import { contractorContext } from "../../contexts/ContractorContext";

const ContractorProfile = () => {
  const { id } = useParams();
  const { contractorList } = useContext(contractorContext);
  // console.log("name", name)
  return (
    <div className="contractor_profile ">
      {contractorList.map((contractor) => {
          if (id === contractor.id)
            return (
              <>
                <div className="contractor_name">{contractor.name}</div>
                <div className='image_wrapper'>
                <img src={contractor?.profileImg} alt="Contractor headshot" />
                </div>
                <div>{contractor.email}</div>
              </>
            );
        })}
    </div>
  );
};

export default ContractorProfile;
