import { commonBackMapper } from "utils/constants";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "utils/validators";


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
  if (getConfig().isLoggedIn) {
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
      if (!getConfig().isLoggedIn) {
        navigate("/login");
      }
    }
  }
}

export const backButtonHandler = (props, fromState, currentState, params) => {
  const navigate = navigateFunc.bind(props);
  const backPath = backMapper(currentState);

  const landingRedirectPaths = ["/sip/payment/callback", "/kyc/report", "/notification", "/nps/payment/callback",
    "/nps/mandate/callback", "/nps/success", "/page/invest/campaign/callback", "/invest", "/reports"];

  const fromStateArray = ['/payment/callback', '/nps/payment/callback', '/sip/payment/callback', '/invest', '/reports',
   '/landing', '', '/new/mandate', '/otm-options', '/mandate', '/nps/mandate/callback', '/nps/success',
    '/nps/sip', '/my-account', '/modal', '/page/callback', '/nps/pran', '/invest/recommendations', '/reports/sip/pause-request', '/kyc/journey'];
    
  if (landingRedirectPaths.indexOf(currentState) !== -1) {
     navigate("/landing");
     return true;
  }

  if ("/payment/callback".indexOf(currentState) !== -1) {
    if (fromStateArray.indexOf(fromState) !== -1) {
      let currentUser = storageService().getObject("user") || {}
      if (
        currentUser.kyc_registration_v2 === "init" ||
        currentUser.kyc_registration_v2 === "incomplete"
      ) {
         navigate("/kyc/journey");
      } else {
         navigate("/landing");
      }
      return true;
    }
  }

  if (currentState === "/kyc/digilocker/failed") {
     navigate("/kyc/journey", {
      state: { show_aadhaar: true }
     });
     return true;
  }

  if (currentState === "/kyc-esign/nsdl" && params?.status === "success") {
     navigate("/invest");
     return true;
  }

  if (backPath) {
     navigate(backPath);
     return true;
  }
}