import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";

const isLoggedIn = storageService().get("currentUser");

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

export const backButtonHanlder = (fromState, currentState) => {
  const returnObj = {};
  // Todo: need to check fhc-summary
  let landingRedirectPaths = ["fhc-summary", "/sip/payment/callback", "/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"];

  let fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
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

  switch (currentState) {
    case "/kyc/digilocker/failed":
      returnObj.path = "/kyc/journey";
      returnObj.state = { show_aadhaar: true }
      break;
    }
  }
}

var backMapper = {
  '/add-bank': '/my-account',
  '/kyc-esign/nsdl': '/invest',
  '/reports/switched-transaction': '/reports',
  '/account/merge/linked/success': '/logout',
  '/reports/sip/pause-request': '/reports/sip',
  '/reports/sip/details': '/reports/sip',
  '/reports/sip': '/reports',
  '/diy/fundinfo/direct': '/'
}