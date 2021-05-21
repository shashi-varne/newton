import React, { useEffect, useState } from "react";
import UiSkelton from "../../../common/ui/Skelton";
import toast from "../../../common/ui/Toast";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getConfig } from "../../../utils/functions";
import { getUrlParams, isEmpty } from "../../../utils/validators";

const CommunicationCallback = (props) => {
  const { error } = getUrlParams();
  const { kyc, isLoading } = useUserKycHook();
  const navigate = (pathname) => {
    props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };
  let checkUser = true;
  if (error) {
    checkUser = false;
    toast(error);
    navigate("/kyc/communication-details");
  }

  const [goNext] = useState(checkUser);

  useEffect(() => {
    if (!isEmpty(kyc) && goNext) {
      const isCompliant = kyc?.kyc_status === "compliant";
      const dlCondition =
        !isCompliant &&
        !kyc.address.meta_data.is_nri &&
        kyc.dl_docs_status !== "" &&
        kyc.dl_docs_status !== "init" &&
        kyc.dl_docs_status !== null;
      let nextState = "/kyc/personal-details4";
      if (isCompliant) {
        nextState = "/kyc/compliant-personal-details4";
      } else if (dlCondition) {
        nextState = "/kyc/dl/personal-details3";
      }
      navigate(nextState);
    }
  }, [kyc]);

  return (
    <div className="ContainerWrapper">
      <UiSkelton type={isLoading} />
    </div>
  );
};

export default CommunicationCallback;
