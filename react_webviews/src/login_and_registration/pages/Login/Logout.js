import React, { useEffect } from "react";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import { storageService } from "../../../utils/validators";
import { logout } from "../../functions";
import { isRmJourney } from "../../../group_insurance/products/group_health/common_data";
import { persistor } from "../../../dataLayer/store";

const config = getConfig();
const Logout = (props) => {
  const navigate = navigateFunc.bind(props); 
  const isRM = isRmJourney();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    persistor.purge();
    if (config.Web) {
      storageService().clear();
      if (config.isIframe) {
        let message = JSON.stringify({
          type: "iframe_close",
        });
        window.callbackWeb.sendEvent(message);
        return;
      }
      try {
        if(!isRM){
          await logout();
        }
      } catch (err) {
        console.log(err);
      } finally {
        if(isRM){
          navigate("/rm-login")  
        }else{
          navigate("/login", {
            searchParams: `base_url=${config.base_url}`
          })
        }
      }
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  return <div className="logout" data-aid='logout-text'>Logging out...</div>;
};

export default Logout;
