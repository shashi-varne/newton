import React, { useContext, useEffect, useMemo, useState } from "react";
import { Route } from "react-router-dom";
import { getAccountSummary, setSummaryData } from "../../kyc/services";
import { storageService } from "utils/validators";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import UiSkelton from "../ui/Skelton";
import ThemeContext from "../../utils/ThemeContext";
import isObject from 'lodash/isObject';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isSdk, isIframe, isMobileDevice } = useMemo(() => getConfig(), []);
  const theme = useContext(ThemeContext)
  let currentUser = storageService().get("currentUser");
  let user = storageService().getObject("user") || {};
  let kyc = storageService().getObject("kyc") || {};
  let partner = storageService().get("partner") || "";

  const userDataAvailable = currentUser && !isEmpty(kyc) && !isEmpty(user);
  const sdkCheck = isSdk ? !!partner : true; // same as: !isSdk || (isSdk && partner)
  const [showLoader, setShowLoader] = useState(!userDataAvailable || !sdkCheck);
  const [isLoginValid, setIsLoginValid] = useState(userDataAvailable && sdkCheck);

  const fetch = async () => {
    try {
      const result = await getAccountSummary();
      setIsLoginValid(true);
      await setSummaryData(result);
    } catch (err) {
      setIsLoginValid(false);
      if (isObject(err) && [403, 416].includes(err.pfwstatus_code)) {
        return;
      } else {
        nativeCallback({ action: 'login_required' })
      }
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    console.log('rest in Protected route', rest);
    initialize();
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
        if (isLoginValid) {
          return <Component {...props} />;
        } else {
          return (
            <div
              className={
                isIframe ? "iframeContainerWrapper" : "ContainerWrapper"
              }
            >
              {(!isIframe || isMobileDevice) && (
                <div style={{ height: "56px" }}></div>
              )}
              <UiSkelton type />
            </div>
          );
      }}}
    />
  );
};
export default ProtectedRoute;
