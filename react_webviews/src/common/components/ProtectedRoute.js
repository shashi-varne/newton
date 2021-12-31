import React, { useEffect, useMemo, useState } from "react";
import { initData } from "../../kyc/services";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import UiSkelton from "../ui/Skelton";
import isObject from 'lodash/isObject';
import { Route } from "react-router-dom";
import { getUrlParams, storageService } from "../../utils/validators";
import Toast from "../ui/Toast";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isIframe, isMobileDevice } = useMemo(getConfig, []);
  let currentUser = storageService().get("currentUser");
  let user = storageService().getObject("user") || {};
  let kyc = storageService().getObject("kyc") || {};
  const referral = storageService().getObject('referral') || {};
  const urlParams = getUrlParams();
  const guestLeadId = storageService().get('guestLeadId') || "" 
  const guestUser = urlParams?.guestUser || false;

  const userDataAvailable = (currentUser && !isEmpty(kyc) && !isEmpty(user) && !isEmpty(referral)) || guestLeadId || guestUser;
  const [showLoader, setShowLoader] = useState(!userDataAvailable);
  const [isLoginValid, setIsLoginValid] = useState(userDataAvailable);

  const fetch = async () => {
    try {
      if(!guestLeadId && !guestUser){
        await initData();
        setIsLoginValid(true);
      }
    } catch (err) {
      setIsLoginValid(false);
      Toast(err.message);
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
    initialize();
  }, []);

  const initialize = async () => {
    if(currentUser && guestLeadId){ // fallback case to remove guestLeadId when user logs in
      storageService().remove('guestLeadId')
    }
    if(guestUser){
      storageService().setBoolean('guestUser', true);
    }
    if(!guestLeadId && urlParams.guestLeadId){
      storageService().set('guestLeadId', urlParams.guestLeadId);
    }

    if (showLoader) {
      await fetch();
    }
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