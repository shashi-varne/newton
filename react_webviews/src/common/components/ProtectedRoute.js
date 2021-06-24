import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { initData } from "../../kyc/services";
import { storageService } from "utils/validators";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import UiSkelton from "../ui/Skelton";
const config = getConfig();
const isSdk = config.isSdk;
const isNative = config.isNative;
const isIframe = config.isIframe;
const ProtectedRoute = ({ component: Component, ...rest }) => {
  let current_user = storageService().get("currentUser");
  let user = storageService().get("user") || {};
  let kyc = storageService().get("kyc") || {};
  let show_loader = current_user && !isEmpty(kyc) && !isEmpty(user) ? false : true;
  const [showLoader, setShowLoader] = useState(show_loader);
  const [showComponent, setShowComponent] = useState(!show_loader);
  const fetch = async () => {
    await initData();
    current_user = storageService().get("currentUser");
    user = storageService().get("user") || {};
    kyc = storageService().get("kyc") || {};
    let show_component =
      current_user && !isEmpty(kyc) && !isEmpty(user) ? true : false;
    setShowComponent(show_component);
    if (!show_component) {
      if (isNative) {
        nativeCallback({ action: "exit_web" });
      } else if (isSdk) {
        nativeCallback({ action: "session_expired" });
      } else if(isIframe) {
        // handle iframe close
      }
    }
    setShowLoader(false);
  };
  useEffect(() => {
    if (showLoader) {
      fetch();
    }
  }, []);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (showLoader) {
          return (
            <div className="ContainerWrapper">
              <div style={{ height: "56px" }}>
              </div>
              <UiSkelton type />
            </div>
          );
        }
        if (showComponent) {
          return <Component {...props} />;
        } else if (!isNative && !isSdk && !isIframe) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
                search: getConfig().searchParams,
              }}
            />
          );
        }
      }}
    />
  );
};
export default ProtectedRoute;
