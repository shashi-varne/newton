
import { getConfig, isNpsOutsideSdk } from "utils/functions";
import { storageService } from "utils/validators";
import { nativeCallback } from "./native_callback";
import { commonBackMapper } from "utils/constants";

export const backMapper = (state) => {
  const backStatesMapper = {
   '/reports/switched-transaction': '/reports',
   '/reports/sip/pause-request': '/reports/sip',
   '/reports/sip/details': '/reports/sip',
   '/reports/sip': '/reports',
   ...commonBackMapper,
  }

  return backStatesMapper[state] || "";
}

export const checkBeforeRedirection = (fromState, toState) => {
  if (fromState !== '' && toState === '/prepare') {
    nativeCallback({ action: "exit_web" });
  }

  if (storageService().get('native') && (toState === '/' || toState === '/invest')) {
    nativeCallback({ action: "exit_web" });
  }
};

export const checkAfterRedirection = (props, fromState, toState) => {
  if (toState === "/" || isNpsOutsideSdk(fromState, toState)) {
    nativeCallback({ action: "take_back_button_control" });
    nativeCallback({ action: "clear_history" });
  } else {
    nativeCallback({ action: "reset_back_button_control" });
  }
}

export const backButtonHanlder = (fromState, currentState, params) => {
  const returnObj = {};
  // Todo: need to check fhc-summary
  const landingRedirectPaths = ["/sip/payment/callback", "/kyc/report", "/notification", "/diy/fundlist/direct",
    "/diy/fundinfo/direct", "/diy/invest", "/invest/doityourself/direct", "/risk/recommendations/error"];

  const fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
   '/landing', '', '/new/mandate', '/otm-options', '/mandate', '/nps/mandate/callback', '/nps/success',
    '/nps/sip', '/my-account', '/modal', '/page/callback', '/reports/sip/pause-request', '/kyc/journey'];
    
  if (landingRedirectPaths.indexOf(currentState) !== -1) {
    returnObj.path = "/";
  }

  if ("/modal".indexOf(currentState) !== -1) {
    if (fromStateArray.indexOf(fromState) !== -1) {
      nativeCallback({ action: "clear_history" });
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
        nativeCallback({ action: "clear_history" });
        returnObj.path = "/";
      }
    }
  }

  if ("/diy/fundinfo/direct".indexOf(currentState)) {
    nativeCallback({ action: "clear_history" });
  }

  switch (currentState) {
    case "/payment/options":
      if (fromState === "/add/bank") {
        returnObj.path = "/";
      }
      break;
    case "/add-bank":
      if (storageService().get('native')) {
        nativeCallback({ action: "exit_web" });
      } else {
        returnObj.path = "/my-account";
      }
      break;
    case "/kyc/digilocker/failed":
      returnObj.path = "/kyc/journey";
      returnObj.state = { show_aadhaar: true }
      break;
    case "/kyc-esign/nsdl":
      if (params.status === "success") {
        if (storageService().get('native')) {
          nativeCallback({ action: "exit_web" });
        } else {
          returnObj.path = "/invest";
        }
      }
      break;
    case "/invest/money-control":
      nativeCallback({ action: "exit_web" });
      break;
    case "/account/merge/linked/success":
      nativeCallback({ action: "session_expired" });
      break;
    case '/nps/investments':
      if (isNpsOutsideSdk(fromState, currentState)) {
        returnObj.path = "/";
      } else {
        nativeCallback({ action: "exit_web" });
      }
      break;
    default:
      if (currentState === "/" || isNpsOutsideSdk(fromState, currentState)) {
        nativeCallback({ action: "exit_web" });
      } else {
        if (window.history.length > 1) {
          if (backMapper(currentState)) {
            returnObj.path = backMapper(currentState);
          } else {
            // $window.history.back();
          }
        } else {
          nativeCallback({ action: "exit_web" });
        }
      }
  }
  
  const npsDetailsCheckCasesArr = ["/nps/payment/callback", "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"]
  if (npsDetailsCheckCasesArr.indexOf(currentState) !== -1) {
    if (storageService().getObject("nps_additional_details_required")) {
      if (isNpsOutsideSdk(fromState, currentState)) {
        nativeCallback({ action: "clear_history" });
      }
      returnObj.path = "/nps";
    } else {
      nativeCallback({ action: "clear_history" });
      returnObj.path = "/";
    }
  }
}