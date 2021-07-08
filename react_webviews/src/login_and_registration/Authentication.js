import React, { useEffect } from "react";
import UiSkelton from "../common/ui/Skelton";
import toast from "../common/ui/Toast";
import { navigate as navigateFunc } from "../utils/functions";
import { getUrlParams, storageService } from "../utils/validators";
import { partnerAuthentication } from "./function";

const PartnerAuthentication = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props.match.params || {};
  const partnerCode = params.partnerCode || "";
  const { token, view } = getUrlParams();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const result = await partnerAuthentication({
        partnerCode,
        token,
        view,
      });
      storageService().set("currentUser", true);
      window.location.href = result.redirect_path;
    } catch (err) {
      toast(err.message);
      navigate("/logout");
    }
  };

  return (
    <div className="iframeContainerWrapper">
      <UiSkelton type />
    </div>
  );
};

export default PartnerAuthentication;
