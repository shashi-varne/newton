import React, { useMemo } from "react";
import ManualSignature from "../../pages/Nominee/ManualSignature/ManualSignature";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";

const ManualSignatureContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading } = useUserKycHook();
  const email = kyc?.identification?.meta_data.email || "";
  const handleDownloadForm = () => {};

  return (
    <WrappedComponent email={email} onClickDownloadForm={handleDownloadForm} />
  );
};

export default ManualSignatureContainer(ManualSignature);
