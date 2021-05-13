import React, { useEffect } from "react";
import toast from "../common/ui/Toast";
import useUserKycHook from "../kyc/common/hooks/userKycHook";
import { getConfig } from "../utils/functions";
import { getUrlParams, isEmpty, storageService } from "../utils/validators";

const SocialCallback = (props) => {
  const { error, redirect_url } = getUrlParams();
  const { user } = useUserKycHook();
  const navigate = (pathname) => {
    props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      if (redirect_url) {
        window.location.href = redirect_url;
      } else if (error) {
        toast(error);
        navigate("/login");
      } else {
        storageService().set("dataSettedInsideBoot", true);
        let nextState = "/invest";
        if (user.kyc_registration_v2 == "init") {
          nextState = "/kyc/home";
        } else if (user.kyc_registration_v2 == "incomplete") {
          nextState = "/kyc/journey";
        } else if (user.active_investment) {
          nextState = "/reports";
        }
        navigate(nextState);
      }
    }
  }, [user]);

  return <div></div>;
};

export default SocialCallback;
