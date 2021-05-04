import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "utils/validators";
import { commonBackMapper } from "utils/constants";

const isLoggedIn = storageService().get("currentUser");

export const backMapper = (state) => {
  const backStatesMapper = {
   '/add-bank': '/my-account',
   '/reports/redeemed-transaction': '/reports',
   '/reports/switched-transaction': '/reports',
   '/account/merge/linked/success': '/logout',
   '/reports/sip/pause-request': '/reports/sip',
   '/reports/sip/details': '/reports/sip',
   '/reports/sip': '/reports',
   '/diy/fundinfo/direct': '/',
   ...commonBackMapper
  }

  return backStatesMapper[state] || "";
}

export const checkBeforeRedirection = (fromState, toState) => {
  if (isLoggedIn) {
    if (toState === "/login" && storageService().get("deeplink_url")) {
      window.location.href = decodeURIComponent(
        storageService.get("deeplink_url")
      );
      return;
    } else {
      if (
        toState === "/partner-landing" ||
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
  }
};

export const checkAfterRedirection = (props, fromState, toState) => {
  const navigate = navigateFunc.bind(props);
  if (window.top === window.self) {
    if (
      toState !== "/partner-landing" &&
      toState !== "/login" &&
      toState !== "/register" &&
      toState !== "/forgot-password" &&
      toState !== "/mobile/verify"
    ) {
      if (!isLoggedIn) {
        navigate("/login");
      }
    }
  }
}


export const backButtonHanlder = (fromState, currentState, params) => {
  const returnObj = {};
  const backPath = backMapper(currentState);
  // Todo: need to check fhc-summary
  const landingRedirectPaths = ["fhc-summary", "/sip/payment/callback", "/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"];

  const fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
   '/landing', '', '/new/mandate', '/otm-options', '/mandate', '/nps/mandate/callback', '/nps/success',
    '/nps/sip', '/my-account', '/modal', '/page/callback', '/nps/pran', '/invest/recommendations', '/reports/sip/pause-request', '/kyc/journey'];
    
  if (landingRedirectPaths.indexOf(currentState) !== -1) {
    returnObj.path = "/landing";
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
        returnObj.path = "/landing";
      }
    }
  }

  if (currentState === "/kyc/digilocker/failed") {
    returnObj.path = "/kyc/journey";
    returnObj.state = { show_aadhaar: true }
  }

  if (currentState === "/kyc-esign/nsdl" && params.status === "success") {
    returnObj.path = "/invest";
  }

  if (backPath) {
    returnObj.path = backPath;
  }
}