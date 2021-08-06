import React, { useEffect } from "react";
import UiSkelton from "common/ui/Skelton";
import toast from "common/ui/Toast";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { getUrlParams, storageService } from "../../utils/validators";
import { partnerAuthentication } from "../functions";

const config = getConfig();
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
      if (config.isIframe) {
        const message = JSON.stringify({
          type: "iframe_close",
        });
        window.callbackWeb.sendEvent(message);
      } else {
        navigate("/logout");
      }
    }
  };

  return (
    <div
      className={
        config.isIframe ? "iframeContainerWrapper" : "ContainerWrapper"
      }
    >
      <UiSkelton type />
    </div>
  );
};

export default PartnerAuthentication;
