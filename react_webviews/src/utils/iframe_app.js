///////////////////////NOTE///////////////////////////////////

// please add the direct enteries path in:
// 1. without param => directEnteries (ex : "/invest/doityourself/direct")
// 2. with param => directEntriesWithParams (ex: "diy/fundlist/direct/:name/:key/:type" should be added as "diy/fundlist/direct")

//////////////////////////////////////////////////////////
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "utils/validators";
import { commonBackMapper } from "utils/constants";
import isEmpty from "lodash/isEmpty";



// required
  // try {
  //   if ($rootScope.currentUser) {
  //     var payload = {
  //       Site: {
  //         Name: $rootScope.currentUser.name,
  //         Identity: $rootScope.currentUser.user_id,
  //         Email: $rootScope.currentUser.email,
  //         "MSG-email": true,
  //         "MSG-push": true,
  //         "MSG-sms": true
  //       }
  //     };
  //     clevertap.profile.push(payload);
  //   }
  // } catch (e) {
  //   console.log(e);
  // }

export const backMapper = (state) => {
  return commonBackMapper[state] || "";
}

export const checkBeforeRedirection = (fromState, toState) => {
  if (getConfig().isLoggedIn) {
    if (
      toState === "/login" ||
      toState === "/register" ||
      toState === "/forgot-password" ||
      toState === "/mobile/verify" || 
      toState?.includes("/partner-authentication")
    ) {
      if (!fromState) {
        return "/";
      } else {
        // $location.path(fromState.url);
      }
    }
  }
};

export const checkAfterRedirection = (fromState, toState) => {
}

export const backButtonHandler = (props, fromState, currentState, params) => {
  const backEnabledPages = [
    "/funds/",
    "/reports",
    "/withdraw",
    "/withdraw/reason",
    "/payment/callback/",
    "/sip/payment/callback/",
    "/new/mandate/"
  ];

  if (backEnabledPages.indexOf(currentState) !== -1) {
    const message = JSON.stringify({
      type: "iframe_close"
    });
    if(getConfig().code === 'moneycontrol' && ["/payment/callback","/sip/payment/callback"].includes(currentState)) {
      return backButtonHandlerWeb(props, fromState, currentState, params)
    } else {
      window.callbackWeb.sendEvent(message);
      storageService().clear();
      return true;
    }
  } else {
    return backButtonHandlerWeb(props, fromState, currentState, params)
  }
}

export const backButtonHandlerWeb = (props, fromState, currentState, params) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const pathName = props.location.pathname;
  const entryPath = storageService().get('entry_path');
  console.log("pathName", pathName);
  console.log("entryPath", entryPath);
  
  const landingRedirectPaths = ["/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/reports"];

  // Note: will have to remove "/invest/explore"  from the direct enteries.
  const directEnteries = ["/invest/doityourself/direct/", "/nps",
     "/direct/gold", "/invest/instaredeem", "/reports", "/invest/savegoal", "/invest", "/withdraw", "/invest/explore", "/kyc/journey"];

  const directEntriesWithParams = ["/diy/fundinfo/direct", "/diy/fundlist/direct"];

  const verifyDirectEntriesWithParams = () => {
    return directEntriesWithParams.find(el => pathName.match(el));
  }
    
  if(directEnteries.indexOf(pathName) !== -1 || !isEmpty(verifyDirectEntriesWithParams())) {
    if(pathName === entryPath) {
      const message = JSON.stringify({
        type: "iframe_close"
      });
      window.callbackWeb.sendEvent(message);
      storageService().clear();
      return true;
    }
  }

  if (landingRedirectPaths.indexOf(currentState) !== -1 || currentState.indexOf("/nps/payment/callback") !== -1) {
    navigate("/landing");
    return true;
  }

  if (currentState === "/kyc/digilocker/failed") {
    navigate("/kyc/journey", {
      state: { show_aadhaar: true }
    });
    return true;
  }

  const diyDirectEntryArr = ["/diy/fundlist/direct", "/diy/fundinfo/direct", "/diy/invest", "/invest/doityourself/direct/"];

  const verifyCurrentStateWithDirect = () => {
    return diyDirectEntryArr.some(el => currentState.match(el));
  }

  if ((currentState === "/kyc-esign/nsdl" && params?.status === "success") || verifyCurrentStateWithDirect()) {
    if (config?.code === 'moneycontrol') {
      navigate("/");
      return true;
    } else {
      navigate("/invest");
      return true;
    }
  }

  switch(currentState) {
    case "/sip/payment/callback":
    case "/kyc/report":
    case "/notification":
    case "/kyc/home":
      if (config?.code === 'moneycontrol') {
        navigate("/");
        return true;
      } else {
        navigate("/landing");
        return true;
      }
    case "/account/merge/linked/success":
      if (config?.code === 'moneycontrol') {
        let message = JSON.stringify({
          type: "iframe_close"
        });
        window.callbackWeb.sendEvent(message);
        storageService().clear();
      } else {
        navigate("/logout");
      }
      return true;
    default:
      const closeIframeStates = ["/", "/invest", "/landing", "/reports", "/withdraw", "/invest/explore"];
      if(closeIframeStates.includes(currentState) && config?.code === 'moneycontrol') {
        let message = JSON.stringify({
          type: "iframe_close"
        });
        window.callbackWeb.sendEvent(message);
        storageService().clear();
        return true; 
      }
      if (backMapper(currentState)) {
        navigate(backMapper(currentState));
        return true;
      } else {
        // $window.history.back();
      }
  }
}