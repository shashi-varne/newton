import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { initData } from "../../kyc/services";
import { storageService } from "utils/validators";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import UiSkelton from "../ui/Skelton";
import ThemeContext from "../../utils/ThemeContext";
const config = getConfig();
const isSdk = config.isSdk;
const isNative = config.isNative;
const isIframe = config.isIframe;
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const theme = useContext(ThemeContext)
  let currentUser = storageService().get("currentUser");
  let user = storageService().get("user") || {};
  let kyc = storageService().get("kyc") || {};
  let partner = storageService().get("partner") || "";
  let loader =
    currentUser && !isEmpty(kyc) && !isEmpty(user) && (isSdk ? !!partner : true )? false : true;
  const [showLoader, setShowLoader] = useState(loader);
  const [showComponent, setShowComponent] = useState(!loader);
  const fetch = async () => {
    await initData();
    currentUser = storageService().get("currentUser");
    user = storageService().get("user") || {};
    kyc = storageService().get("kyc") || {};
    let renderComponent =
      currentUser && !isEmpty(kyc) && !isEmpty(user) ? true : false;
    setShowComponent(renderComponent);
    if (!renderComponent) {
      if (isNative) {
        nativeCallback({ action: "exit_web" });
      } else if (isSdk) {
        nativeCallback({ action: "session_expired" });
      } else if (isIframe) {
        let message = JSON.stringify({
          type: "iframe_close",
        });
        window.callbackWeb.sendEvent(message);
      }
    }
    setShowLoader(false);
  };

  useEffect(() => {
    initialize()
  }, []);

  const initialize = async () => {
    if (showLoader) {
      await fetch();
    }
    theme.updateTheme();
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (showLoader) {
          return (
            <div
              className={
                isIframe ? "iframeContainerWrapper" : "ContainerWrapper"
              }
            >
              {(!isIframe || config.isMobileDevice) && (
                <div style={{ height: "56px" }}></div>
              )}
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
