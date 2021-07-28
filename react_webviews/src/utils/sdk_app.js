///////////////////////NOTE///////////////////////////////////

// please add the direct enteries path in:
// 1. without param => directEnteries (ex : "/invest/doityourself/direct")
// 2. with param => directEntriesWithParams (ex: "diy/fundlist/direct/:name/:key/:type" should be added as "diy/fundlist/direct")

//////////////////////////////////////////////////////////

import { navigate as navigateFunc, isNpsOutsideSdk } from "utils/functions";
import { storageService } from "utils/validators";
import { nativeCallback } from "./native_callback";
import { commonBackMapper } from "utils/constants";
import { getConfig } from "./functions";
import isEmpty from "lodash/isEmpty";

export const backMapper = (state) => {
  return commonBackMapper[state] || "";
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
    // Todo: Remove this code later - https://fisdom.atlassian.net/browse/WVFIS-1073
    nativeCallback({ action: "reset_back_button_control" });
  }
}

export const backButtonHandler = (props, fromState, currentState, params) => {
  const navigate = navigateFunc.bind(props);
  const pathName = props.location.pathname;
  const entryPath = storageService().get('entry_path');
  console.log("pathName", pathName);
  console.log("entryPath", entryPath);
  
  const landingRedirectPaths = ["/sip/payment/callback", "/kyc/report", "/notification", "/diy/fundlist/direct",
    "/diy/fundinfo/direct", "/diy/invest", "/invest/doityourself/direct/", "/risk/recommendations/error"];

  // const fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
  //  '/landing', '', '/new/mandate', '/otm-options', '/mandate', '/nps/mandate/callback', '/nps/success',
  //   '/nps/sip', '/my-account', '/modal', '/page/callback', '/reports/sip/pause-request', '/kyc/journey'];
  
  // Note: will have to remove "/invest/explore"  from the direct enteries.
  const directEnteries = ["/invest/doityourself/direct/", "/nps",
     "/direct/gold", "/invest/instaredeem", "/reports", "/invest/savegoal", "/invest", "/withdraw", "/invest/explore", "/kyc/journey"];

  const directEntriesWithParams = ["/diy/fundinfo/direct", "/diy/fundlist/direct"];

  const verifyDirectEntriesWithParams = () => {
    return directEntriesWithParams.find(el => pathName.match(el));
  }
    
  if(directEnteries.indexOf(pathName) !== -1 || !isEmpty(verifyDirectEntriesWithParams())) {
    if(pathName === entryPath) {
      nativeCallback({ action: "exit_web" });
      return true;
    }
  }

  if (landingRedirectPaths.indexOf(currentState) !== -1) {
    navigate("/");
    return true;
  }

  if (currentState.indexOf("/diy/fundinfo/direct") !== -1) {
    nativeCallback({ action: "clear_history" });
  }

  switch (currentState) {
    case "/payment/options":
      if (fromState === "/add/bank") {
        navigate("/");
        return true;
      }
      break;
    case "/kyc/add-bank":
      if (storageService().get('native')) {
        nativeCallback({ action: "exit_web" });
      } else {
        navigate("/my-account");
        return true;
      }
      break;
    case "/kyc/digilocker/failed":
      navigate("/kyc/journey", {
        state: { show_aadhaar: true }
      });
      return true;
    case "/kyc-esign/nsdl":
      if (params?.status === "success") {
        if (storageService().get('native')) {
          nativeCallback({ action: "exit_web" });
        } else {
          navigate("/invest");
          return true;
        }
      }
      break;
    case "/account/merge/linked/success":
      nativeCallback({ action: "session_expired" });
      break;
    case '/nps/investments':
      if (isNpsOutsideSdk(fromState, currentState)) {
        navigate("/");
        return true;
      } else {
        nativeCallback({ action: "exit_web" });
      }
      break;
    default:
      const landingScreenPaths = ["/", "/invest", "/landing"]
      if(landingScreenPaths.includes(currentState) && getConfig().code === 'moneycontrol') {
        nativeCallback({ action: "exit_web" });
        return true; 
      }
      if (currentState === "/" || isNpsOutsideSdk(fromState, currentState)) {
        nativeCallback({ action: "exit_web" });
      } else {
        if (window.history.length > 1) {
          if (backMapper(currentState)) {
            navigate(backMapper(currentState));
            return true;
          } else {
            // window.history.back();
          }
        } else {
          nativeCallback({ action: "exit_web" });
        }
      }
  }
  
  let npsDetailsCheckCasesArr = ["/nps/payment/callback", "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback"];
  if(getConfig().code !== 'moneycontrol') {
    npsDetailsCheckCasesArr = [...npsDetailsCheckCasesArr, "/invest", "/reports"];
  }
  if (npsDetailsCheckCasesArr.indexOf(currentState) !== -1 || currentState.indexOf("/nps/payment/callback") !== -1) {
    if (storageService().getObject("nps_additional_details_required")) {
      if (isNpsOutsideSdk(fromState, currentState)) {
        nativeCallback({ action: "clear_history" });
      }
      navigate("/nps");
      return true;
    } else {
      navigate("/");
      return true;
    }
  }
}