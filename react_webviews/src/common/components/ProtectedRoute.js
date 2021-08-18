import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { initData } from "../../kyc/services";
import { storageService, getUrlParams } from "utils/validators";
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
  let user = storageService().getObject("user") || {};
  let kyc = storageService().getObject("kyc") || {};
  let partner = storageService().get("partner") || "";
  const urlParams = getUrlParams();
  const guestLeadId = storageService().get('guestLeadId') || "" 
  const guestUser = urlParams?.guestUser || false;

  const userDataAvailable = (currentUser && !isEmpty(kyc) && !isEmpty(user)) || guestLeadId || guestUser;
  const sdkCheck = isSdk ? !!partner : true; // same as: !isSdk || (isSdk && partner)
  const [showLoader, setShowLoader] = useState(!userDataAvailable || !sdkCheck);
  const [isLoginValid, setIsLoginValid] = useState(userDataAvailable && sdkCheck);

  const fetch = async () => {
    try {
      if(guestUser){
        storageService().setBoolean('guestUser', true);
      }
      if(!guestLeadId && getUrlParams().guestLeadId ){
        storageService().set('guestLeadId', urlParams.guestLeadId);
      }
      if(!guestLeadId && !guestUser){
        await initData();
      }
    } catch (e) {
      console.log(e);
    } finally {
      currentUser = storageService().get("currentUser");
      user = storageService().getObject("user") || {};
      kyc = storageService().getObject("kyc") || {};
      const userDataAvailable = (currentUser && !isEmpty(kyc) && !isEmpty(user)) || guestLeadId || guestUser;
      setIsLoginValid(userDataAvailable);
      if (!userDataAvailable) {
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
    }
  };

  useEffect(() => {
    initialize()
  }, []);

  const initialize = async () => {
    if (showLoader) {
      await fetch();
    }
    // In order to update app theme based on partner code
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
        if (isLoginValid) {
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