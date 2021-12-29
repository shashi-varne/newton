import { commonBackMapper } from "utils/constants";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "utils/validators";


export const backMapper = (state) => {
  const backStatesMapper = {
   '/kyc/add-bank': '/my-account',
   '/account/merge/linked/success': '/logout',
   '/diy/fundinfo/direct': '/',
   ...commonBackMapper
  }

  return backStatesMapper[state] || "";
}

export const checkBeforeRedirection = (fromState, toState) => {
  if (getConfig().isLoggedIn) {
    if (toState === "/login" && storageService().get("deeplink_url")) {
      window.location.href = decodeURIComponent(
        storageService().get("deeplink_url")
      );
      return;
    } else {
      if (
        toState === "/partner-landing" ||
        toState === "/login" ||
        toState === "/login/verify-otp" ||
        toState === "/prepare"
        // toState === "/register" ||
        // toState === "/forgot-password" ||
        // toState === "/mobile/verify"
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
      toState !== "/login/verify-otp" &&
      toState === "/prepare" &&
      !toState.includes("/partner-authentication")
      // toState !== "/register" &&
      // toState !== "/forgot-password" &&
      // toState !== "/mobile/verify"
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

  if (currentState === "/kyc-esign/nsdl" && params?.status === "success") {
     navigate("/invest");
     return true;
  }

  if (backPath) {
     navigate(backPath);
     return true;
  }
}