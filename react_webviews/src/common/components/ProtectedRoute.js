import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { initData } from "../../kyc/services";
import { storageService } from "utils/validators";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import UiSkelton from "../ui/Skelton";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isNative = getConfig().isNative;
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
    if (!show_component && isNative) {
      nativeCallback({ action: "exit_web" });
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
              <UiSkelton type />
            </div>
          );
        }
        if (showComponent) {
          return <Component {...props} />;
        } else if (!isNative) {
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
