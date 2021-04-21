import React, { useEffect } from "react";
import { getConfig, isIframe } from "../utils/functions";
import { storageService } from "../utils/validators";
import { logout } from "./function";

const Logout = (props) => {
  const config = getConfig();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (config.Web) {
      if (isIframe()) {
        // handle I frame
      } else {
        try {
          storageService().clear();
          window.localStorage.clear();
          await logout();
        } catch (err) {
          console.log(err);
        } finally {
          props.history.push({
            pathname: "/login",
            search: config.searchParams,
          });
        }
      }
    } else {
      // handle logout in native callbacks
    }
  };

  return <div className="logout">Logging out...</div>;
};

export default Logout;
