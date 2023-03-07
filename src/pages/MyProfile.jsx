import React, { useContext, useEffect } from "react";
import { authContext } from "../contexts/auth";
import ContractorProfile from "../components/ContractorProfile/ContractorProfile";
import { contractorContext } from "../contexts/ContractorContext";

export default function MyProfile() {
  const { user } = useContext(authContext);
  const userUid = user.uid;
  const { contractorList } = useContext(contractorContext);

  return (
    <>
      {contractorList.map((contractor) => {
        if (userUid === contractor?.firebaseUID)
          return <ContractorProfile key={contractor?.id} data={contractor} />;
      })}
    </>
  );
}
