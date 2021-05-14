import React, { useEffect, useState } from "react";
import UiSkelton from "../common/ui/Skelton";
import toast from "../common/ui/Toast";
import useUserKycHook from "../kyc/common/hooks/userKycHook";
import { getConfig } from "../utils/functions";
import { getUrlParams, isEmpty, storageService } from "../utils/validators";

const SocialCallback = (props) => {
  const { error, redirect_url } = getUrlParams();
  const { user, isLoading } = useUserKycHook();
  const navigate = (pathname) => {
    props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };
  let checkUser = true;
  if (redirect_url) {
    checkUser = false;
    window.location.href = redirect_url;
  } else if (error) {
    checkUser = false;
    toast(error);
    navigate("/login");
  }

  const [goNext] = useState(checkUser);

  useEffect(() => {
    if (!isEmpty(user) && goNext) {
      storageService().set("dataSettedInsideBoot", true);
      let nextState = "/invest";
      if (user.kyc_registration_v2 === "init") {
        nextState = "/kyc/home";
      } else if (user.kyc_registration_v2 === "incomplete") {
        nextState = "/kyc/journey";
      } else if (user.active_investment) {
        nextState = "/reports";
      }
      navigate(nextState);
    }
  }, [user]);

  return (
    <div className="ContainerWrapper">
      <UiSkelton type={isLoading} />
    </div>
  );
};

export default SocialCallback;
