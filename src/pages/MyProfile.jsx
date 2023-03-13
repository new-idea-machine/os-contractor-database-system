import React, { useContext } from "react";
import { authContext } from "../contexts/auth";
import ContractorProfile from "../components/ContractorProfile/ContractorProfile";
import { contractorContext } from "../contexts/ContractorContext";

export default function MyProfile() {
  const { user } = useContext(authContext);
  const userUid = user.uid;
  const { contractorList } = useContext(contractorContext);

  return (
    <>
      {contractorList.length > 0 &&
        contractorList.map((contractor) =>
          userUid === contractor?.firebaseUID ? (
            <>
              <ContractorProfile key={contractor?.id} data={contractor} />
            </>
          ) : null
        )}
    </>
  );
}
