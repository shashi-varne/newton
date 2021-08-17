import React, { useEffect } from "react";
import { getConfig, navigate as navigateFunc } from "../utils/functions";
import { nativeCallback } from "../utils/native_callback";
import { storageService } from "../utils/validators";
import { logout } from "./function";

const config = getConfig();
const Logout = (props) => {
  const navigate = navigateFunc.bind(props); 

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
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
        window.localStorage.clear();
        await logout();
      } catch (err) {
        console.log(err);
      } finally {
        navigate("/login")
      }
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  return <div className="logout" data-aid='logout-text'>Logging out...</div>;
};

export default Logout;
