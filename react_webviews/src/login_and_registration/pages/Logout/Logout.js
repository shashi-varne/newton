import React, { useEffect } from "react";
import ErrorScreen from "../../../common/responsive-components/ErrorScreen";
import { isRmJourney } from "../../../group_insurance/products/group_health/common_data";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import { storageService } from "../../../utils/validators";
import { logout } from "../../functions";
import { persistor } from "../../../dataLayer/store";
import { useDispatch } from "react-redux";
import { resetDiyData } from "businesslogic/dataStore/reducers/diy";
import { resetMfOrders } from "businesslogic/dataStore/reducers/mfOrders";
import { resetAppData } from "businesslogic/dataStore/reducers/app";
import { resetFundDetails } from "businesslogic/dataStore/reducers/fundDetails";

const config = getConfig();
const Logout = (props) => {
  const navigate = navigateFunc.bind(props); 
  const isRM = isRmJourney();
  const dispatch = useDispatch();
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    dispatch(resetDiyData());
    dispatch(resetMfOrders());
    dispatch(resetFundDetails());
    dispatch(resetAppData());
    persistor.purge();
    if (window.clevertap) {
      window.clevertap.logout();
      window.clevertap.profile= [];
    }
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
        if(!isRM){
          await logout();
        }
      } catch (err) {
        console.log(err);
      } finally {
        if(isRM) {
          navigate("/rm-login")  
        } else {
          setTimeout(() => navigate("/login", {
            searchParams: `base_url=${config.base_url}`
          }), 2000);
        }
      }
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  return (
    <ErrorScreen
      useTemplate
      templateErrTitle="You have been logged out."
      templateErrText="Redirecting to login page..."
    />
  );
};

export default Logout;
