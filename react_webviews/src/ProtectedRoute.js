import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { initData } from "./kyc/services";
import { storageService } from "./utils/validators";
import isEmpty from "lodash/isEmpty";
import { getConfig } from "utils/functions";
import UiSkelton from "./common/ui/Skelton";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  let current_user = storageService().get("currentUser");
  let user = storageService().get("user") || {};
  let kyc = storageService().get("kyc") || {};
  let show_loader =
    current_user && !isEmpty(kyc) && !isEmpty(user) ? false : true;
  const [showLoader, setShowLoader] = useState(show_loader);
  const [showComponent, setShowComponent] = useState(!show_loader);
  const fetch = async () => {
    await initData();
    console.log("inside the protected routes");
    current_user = storageService().get("currentUser");
    user = storageService().get("user") || {};
    kyc = storageService().get("kyc") || {};
    let show_component =
      current_user && !isEmpty(kyc) && !isEmpty(user) ? true : false;
    setShowComponent(show_component);
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
          return <UiSkelton type="g" />;
        }
        if (showComponent) {
          return <Component {...props} />;
        } else {
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
export default ProtectedRoute