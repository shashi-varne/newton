import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "utils/validators";
import { commonBackMapper } from "utils/constants";

  let _event = {
    event_name: "hide_loader",
    properties: {
      journey: {
        name: "",
        trigger: "",
        journey_status: "",
        next_journey: ""
      }
    }
  };

  //window.callbackWeb.sendEvent(_event);
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

export const checkBeforeRedirection = (props, fromState, toState) => {
  if (getConfig().isLoggedIn) {
    if (
      toState === "/login" ||
      toState === "/register" ||
      toState === "/forgot-password" ||
      toState === "/mobile/verify"
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
    "/withdraw-reason/",
    "/payment/callback/",
    "/sip/payment/callback/",
    "/new/mandate/"
  ];

  if (backEnabledPages.indexOf(currentState) !== -1) {
    var message = JSON.stringify({
      type: "iframe_close"
    });
    if(getConfig().code === 'moneycontrol' && ["/payment/callback","/sip/payment/callback"].includes(currentState)) {
      return backButtonHandlerWeb(props, fromState, currentState, params)
    } else {
      window.callbackWeb.sendEvent(message);
    }
  } else {
    return backButtonHandlerWeb(props, fromState, currentState, params)
  }
}

export const backButtonHandlerWeb = (props, fromState, currentState, params) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  
  const landingRedirectPaths = ["/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"];

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

  const diyDirectEntryArr = ["/diy/fundlist/direct", "/diy/fundinfo/direct", "/diy/invest", "/invest/doityourself/direct"];

  if ((currentState === "/kyc-esign/nsdl" && params?.status === "success") ||
    diyDirectEntryArr.includes(currentState)) {
    if (config?.code === 'moneycontrol') {
      console.log("hello from money")
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
        return true;
      }
      break;
    // case '/invest/money-control':
    //   let message = JSON.stringify({
    //     type: "iframe_close"
    //   });
    //   window.callbackWeb.sendEvent(message);
    //   storageService().clear();
    //   break;
    case '/account/merge/linked/success':
      if (config?.code === 'moneycontrol') {
        window.history.go(-2);
      }// check later
      // navigate kyc home
      break;
    default:
      if(currentState === "/" && config?.code === 'moneycontrol') {
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