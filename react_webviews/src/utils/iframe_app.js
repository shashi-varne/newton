import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";
import { commonBackMapper } from "utils/constants";

// required
  // var _event = {
  //   event_name: "hide_loader",
  //   properties: {
  //     journey: {
  //       name: "",
  //       trigger: "",
  //       journey_status: "",
  //       next_journey: ""
  //     }
  //   }
  // };

  // appService.sendEvent(_event);
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
  const backStatesMapper = {
    '/reports/redeemed-transaction': '/reports',
    '/reports/switched-transaction': '/reports',
    '/reports/sip/pause-request': '/reports/sip',
    '/reports/sip/details': '/reports/sip',
    '/reports/sip': '/reports',
    ...commonBackMapper,
  }

  return backStatesMapper[state] || "";
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

export const backButtonHanlder = (fromState, currentState, params) => {
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
      backButtonHanlderWeb(fromState, currentState)
    } else {
      // appService.sendEvent(message);
    }
  } else {
    backButtonHanlderWeb(fromState, currentState, params)
  }
}

export const backButtonHanlderWeb = (fromState, currentState, params) => {
  const returnObj = {};
  const config = getConfig();
  
  // Todo: need to check fhc-summary
  const landingRedirectPaths = ["fhc-summary", "/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"];

  const fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
   '/landing', '', '/new/mandate', '/otm-options', '/mandate', '/nps/mandate/callback', '/nps/success',
    '/nps/sip', '/my-account', '/modal', '/page/callback', '/nps/pran', '/invest/recommendations', '/reports/sip/pause-request', '/kyc/journey'];
    
  if (landingRedirectPaths.indexOf(currentState) !== -1) {
    returnObj.path = "/landing";
  }

  switch(currentState) {
    case "/sip/payment/callback":
    case "/kyc/report":
    case "/notification":
      if (config?.code === 'moneycontrol') {
        returnObj.path = "/invest/money-control";
      } else {
        returnObj.path = "/landing";
      }
      break;
    case "/account/merge/linked/success":
      if (config?.code === 'moneycontrol') {
        var message = JSON.stringify({
          type: "iframe_close"
        });
        // appService.sendEvent(message);
        storageService().clear();
      } else {
        returnObj.path = "/logout";
      }
      break;
    case '/invest/money-control':
      var message = JSON.stringify({
        type: "iframe_close"
      });
      // appService.sendEvent(message);
      storageService().clear();
      break;
    case '/account/merge/linked/success':
      if (config?.code === 'moneycontrol') {
        window.history.go(-2);
      }// check later
      // navigate kyc home
      break;
    default:
      if (backMapper(currentState)) {
        returnObj.path = backMapper(currentState);
      } else {
        // $window.history.back();
      }
  }

  if ("/payment/callback".indexOf(currentState) !== -1) {
    if (fromStateArray.indexOf(fromState) !== -1) {
      let currentUser = storageService().getObject("user") || {}
      if (
        currentUser.kyc_registration_v2 === "init" ||
        currentUser.kyc_registration_v2 === "incomplete"
      ) {
        returnObj.path = "/kyc/journey";
      } else {
        if (config?.code === 'moneycontrol') {
          returnObj.path = "/invest/money-control";
        } else {
          returnObj.path = "/landing";
        }
      }
    }
  }

  if (currentState === "/kyc/digilocker/failed") {
    returnObj.path = "/kyc/journey";
    returnObj.state = { show_aadhaar: true }
  }

  const diyDirectEntryArr = ["/diy/fundlist/direct", "/diy/fundinfo/direct", "/diy/invest", "/invest/doityourself/direct"];

  if ((currentState === "/kyc-esign/nsdl" && params.status === "success") ||
    diyDirectEntryArr.includes(currentState)) {
    if (config?.code === 'moneycontrol') {
      returnObj.path = "/invest/money-control";
    } else {
      returnObj.path = "/invest";
    }
  }
}