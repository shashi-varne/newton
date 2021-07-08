import React, { useEffect } from "react";
import UiSkelton from "../common/ui/Skelton";
import toast from "../common/ui/Toast";
import { getUrlParams, storageService } from "../utils/validators";
import { partnerAuthentication } from "./function";

const PartnerAuthentication = (props) => {
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
      const message = JSON.stringify({
        type: "iframe_close",
      });
      window.callbackWeb.sendEvent(message);
    }
  };

  return (
    <div className="iframeContainerWrapper">
      <UiSkelton type />
    </div>
  );
};

export default PartnerAuthentication;
