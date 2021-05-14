import React, { useEffect } from "react";
import { getConfig, isIframe } from "../utils/functions";
import { nativeCallback } from "../utils/native_callback";
import { storageService } from "../utils/validators";
import { logout } from "./function";

const Logout = (props) => {
  const config = getConfig();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (config.Web) {
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
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  return <div className="logout">Logging out...</div>;
};

export default Logout;
