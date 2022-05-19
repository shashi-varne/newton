import toast from "common/ui/Toast";
import Api from "utils/api";
import { storageService, getUrlParams, validateEmail } from "utils/validators";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { isEmpty } from "../utils/validators";
import { nativeCallback } from "../utils/native_callback";
import Toast from "../common/ui/Toast";
import { getBasePath, isTradingEnabled } from "../utils/functions";
import { setSummaryData } from "../kyc/services";

const config = getConfig();
const errorMessage = "Something went wrong!";
const basePath = getBasePath();

export function initialize() {
  this.formCheckFields = formCheckFields.bind(this);
  this.triggerOtpApi = triggerOtpApi.bind(this);
  this.initiateOtpApi = initiateOtpApi.bind(this);
  this.resendVerificationLink = resendVerificationLink.bind(this);
  this.otpVerification = otpVerification.bind(this);
  this.otpLoginVerification = otpLoginVerification.bind(this);
  this.authCheckApi = authCheckApi.bind(this);
  this.generateOtp = generateOtp.bind(this);
  this.resendOtp = resendOtp.bind(this);
  this.resendLoginOtp = resendLoginOtp.bind(this);
  this.navigate = navigateFunc.bind(this.props);
  this.getKycFromSummary = getKycFromSummary.bind(this);
  this.redirectAfterLogin = redirectAfterLogin.bind(this);
  this.verifyRecaptchaAndInitiateOtp = verifyRecaptchaAndInitiateOtp.bind(this);
  let main_query_params = getUrlParams();
  let { referrer = "" } = main_query_params;

  let redirectUrl = encodeURIComponent(`${basePath}/${config.searchParams}`);

  const partners = [
    "hbl",
    "sbm",
    "flexi",
    "medlife",
    "life99",
    "taxwin",
    "ippb",
    "quesscorp",
    "sahaj",
    "mspl"
  ];
  const partner = storageService().get("partner") || "";
  if (partners.includes(partner)) {
    referrer = partner;
    const deeplinkUrl = storageService().get("deeplink_url") || "";
    if (deeplinkUrl) {
      redirectUrl = deeplinkUrl;
    }
  }



  this.setState({
    referrer: referrer,
    redirectUrl: redirectUrl,
    rebalancingRedirectUrl: main_query_params.redirect_url,
  });
}

export function formCheckFields(
  keys_to_check,
  form_data,
  userAction,
  loginType,
  secondaryVerification
) {
  let canSubmit = true;
  for (let key of keys_to_check) {
    if (!form_data[key]) {
      form_data[`${key}_error`] = "This is required";
      canSubmit = false;
    }
  }
  if (!canSubmit) {
    this.setState({ form_data: form_data });
    return;
  }
  if (loginType === "email" && !validateEmail(form_data["email"])) {
    toast("Invalid email");
    return;
  } else if (
    loginType === "mobile" &&
    form_data["mobile"].length !== 10 &&
    form_data["code"] === "91"
  ) {
    toast("Invalid mobile number");
    return;
  }

  if (userAction === "REGISTER" && loginType === "email") {
    let passwordCheck = ["password", "confirm_password"];
    for (let key of passwordCheck) {
      if (form_data[key].length < 8) {
        form_data[`${key}_error`] = "Minimum 8 characters required.";
        canSubmit = false;
      }
    }
    if (!canSubmit) {
      this.setState({ form_data: form_data });
      return;
    }
    if (form_data.password !== form_data.confirm_password) {
      toast("Passwords do not match");
      return;
    }
  }

  // let { redirectUrl, referrer = "" } = this.state;

  let body = {};
  this.setState({ isApiRunning: "button" });
  if (loginType === "email" && userAction === "LOGIN") {
    if (secondaryVerification) {
      body.email = form_data["email"];
      body.communicationType = loginType
      body.secondaryVerification = true
      this.triggerOtpApi(body, loginType);
    } else {
      body.auth_type = loginType;
      body.auth_value = form_data["email"];
      this.verifyRecaptchaAndInitiateOtp(body, loginType);
    }
  } else {
    if (secondaryVerification) {     // body.redirect_url = redirectUrl;
      body.secondaryVerification = true
      body.mobile = `${form_data["code"]}|${form_data["mobile"]}`;
      body.whatsapp_consent = form_data["whatsapp_consent"];
      body.communicationType = loginType
      this.triggerOtpApi(body, loginType,);
    } else { 
      // eslint-disable-next-line
      body.auth_type = 'mobile',
      body.auth_value = `${form_data["code"]}|${form_data["mobile"]}`,
      body.need_key_hash = true,
      body.user_whatsapp_consent = form_data["whatsapp_consent"],
      this.verifyRecaptchaAndInitiateOtp(body, loginType);
    }
  }
}

export function verifyRecaptchaAndInitiateOtp(body, loginType) {
  const config = getConfig();
  const apiKey = config.apiKey;
  const action = "login"; 
  window.grecaptcha.enterprise.ready(() => {
    window.grecaptcha.enterprise.execute(apiKey, { action }).then(token => {
      body.recaptcha_token = token;
      body.recaptcha_action = action;
      this.initiateOtpApi(body, loginType)
    });
  });
}

export function setBaseHref() {
  var myBaseHref = document.getElementById('myBaseHref');
  var pathname = window.location.pathname;
  var myBaseHrefUrl;
  if(pathname.indexOf('appl/web') !== -1) {
    myBaseHrefUrl = '/appl/web/' + pathname.split('/')[3] +'/' ;
    myBaseHref.href = myBaseHrefUrl;
    window.localStorage.setItem('base_href', myBaseHrefUrl);
  }
  if(pathname.indexOf('webapp') !== -1) {
    myBaseHrefUrl = '/webapp/';
    myBaseHref.href = myBaseHrefUrl;
    window.localStorage.setItem('base_href', myBaseHrefUrl);
  }
}

export async function triggerOtpApi(body, loginType, bottomsheet) {
  try {
    const res = await Api.post(
      `/api/communication/send/otp`, body
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      if(!bottomsheet) this.sendEvents("next");
      if (body?.secondaryVerification) {
        this.navigate("/secondary-otp-verification", {
          state: {
            value: body.mobile ||  body.email,
            otp_id: result?.otp_id,
            communicationType: loginType,
            firstTimeLogin: this.state.firstTimeLogin || false,
          },
        });
      } else {
        this.navigate("login/verify-otp", {
          state: {
            value: body.mobile || body.email,
            otp_id: result?.otp_id,
            communicationType: loginType,
          },
        });
      }
      toast(result?.message || "Success");
    } else throw result?.error || result?.message || errorMessage;
  } catch (error) {
    console.log(error);
    toast(error);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function initiateOtpApi(body, loginType) {
  let formData = new FormData();
  formData.append("auth_type", loginType);
  formData.append("auth_value", body.auth_value);
  formData.append("Content-Type", "application/x-www-form-urlencoded")   // [ "multipart/form-data" ]
  formData.append("user_whatsapp_consent", body?.user_whatsapp_consent);
  formData.append("recaptcha_token", body.recaptcha_token);
  formData.append("recaptcha_action", body.recaptcha_action);
  const referrer = this.state.referrer;
  if(referrer) {
    const item = {
      promo_code: referrer,
    };
    storageService().setObject("user_promo", item);
  }
  try {
    const res = await Api.post(`/api/user/login/v5/initiate`, formData);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw res?.pfwmessage || errorMessage;
    }
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      this.sendEvents("next");
      this.navigate("login/verify-otp", {
        state: {
          value: body.auth_value,
          communicationType: loginType,
          verify_url: result?.verify_url,
          resend_url: result?.resend_url,
        },
      });

    } else throw result?.error || result?.message || errorMessage
  } catch (error) {
    console.log(error);
    toast(error);
  } finally {
    this.setState({ isApiRunning: false });
  }
}


export async function resendVerificationLink() {
  let { loginType, form_data } = this.state;
  if (loginType === "mobile") return;
  if (loginType === "email" && !validateEmail(form_data["email"])) {
    toast("Invalid email");
    return;
  }

  this.setState({ resendVerificationApi: true });

  let body = {
    email: form_data["email"],
  };
  try {
    const res = await Api.get(`/api/resendverfication`, body);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast(
        "Please click on the verification link sent to your email account."
      );
    } else {
      toast(result.error || result.message|| errorMessage);
    }
    this.setState({ resendVerificationApi: false });
  } catch (error) {
    console.log(error);
    toast(errorMessage);
    this.setState({ resendVerificationApi: false });
  }
}

export const redirectToLaunchDiet = async () => {
  const url = '/api/equity/stub/equityvariables?ucc=DEMO100';
  try {
    const res = await Api.post(url);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      window.location.href = `${config.base_url}/page/equity/launchdiet`;
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  }
}

export async function otpLoginVerification(verify_url, body) {
  let formData = new FormData();
  const userPromo = storageService().getObject("user_promo");
  if(userPromo?.promo_code) {
    formData.append("referrer_code", userPromo?.promo_code);
  }
  formData.append("otp", body?.otp);
  formData.append("user_whatsapp_consent", body?.user_whatsapp_consent);
  formData.append("Content-Type", "application/x-www-form-urlencoded"); //   [ "multipart/form-data" ]
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.post(verify_url, formData);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.sendEvents("next")
      storageService().setObject("user", result.user);

      // Redirect to PIN Verification
      if (result.user.pin_status === 'pin_setup_complete') {
        return this.navigate('verify-pin', { edit: true });
      }

      if (this.state.rebalancing_redirect_url) {
        window.location.href = this.state.rebalancing_redirect_url;
        return;
      }

      const kycResult = await postLoginSetup(true);

      if (!kycResult) {
        this.setState({ isApiRunning: false });
        return;
      }

      const user = kycResult.data.user.user.data;
      this.setState({
        currentUser: true,
        "user-data": { me: user },
        isApiRunning: false,
      });

      if (storageService().get("deeplink_url")) {
        window.location.href = decodeURIComponent(
          storageService().get("deeplink_url")
        );
      } else {
        console.log(config.diet)
        if(config.diet) {
          await redirectToLaunchDiet();
        } else {
          this.redirectAfterLogin(result, user);
        }
      }
    } else {
      if (result?.status_code === 439) {
        this.setState({ isWrongOtp: true })
      }
      toast(result.error || result.message || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export const postLoginSetup = async (getKycResult) => {
  try {
    const kycResult = await getKycFromSummary();
    storageService().set('dataSettedInsideBoot', true)
    setSummaryData(kycResult);
    setBaseHref();
    const eventObj = {
      event_name: "user loggedin",
    };
    nativeCallback({ events: eventObj });
    if (getKycResult) return kycResult;
  } catch (err) {
    throw err;
  }
}

export async function otpVerification(body) {
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.post(
      `/api/communication/verify/otp/${body.otp_id}?otp=${body.otp_value}`
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.sendEvents("next");
      if (this.state.rebalancing_redirect_url) {
        window.location.href = this.state.rebalancing_redirect_url;
        return;
      }
      let userData = {};
      let kycResult = await getKycFromSummary();

      if (!kycResult) {
        this.setState({ isApiRunning: false });
        return;
      }

      storageService().set('dataSettedInsideBoot', true);
      setSummaryData(kycResult);
      let user = kycResult.data.user.user.data;
      userData.me = user;
      setBaseHref();

      this.setState({
        currentUser: true,
        "user-data": userData,
        isApiRunning: false,
      });
      if (storageService().get("deeplink_url")) {
        window.location.href = decodeURIComponent(
          storageService().get("deeplink_url")
        );
      } else {
        if(config.diet) {
          await redirectToLaunchDiet();
        } else {
          this.redirectAfterLogin(result, user);
        }
      }
      toast(result?.error || result.message || errorMessage)
    } else {
      if (result.status_code === 439) {
        this.setState({ isWrongOtp: true })
      }
       throw result.error || result.message || errorMessage;
    }
  } catch (error) {
    console.log(error);
    toast(error);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function resendOtp(otp_id) {
  this.setState({ isResendOtpApiRunning: true });
  try {
    const res = await Api.post(`/api/communication/resend/otp/${otp_id}`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isResendOtpApiRunning: false });
      toast(result.message || "Success!");
    } else {
      throw result.error || result.message || errorMessage;
    }
  } catch (error) {
    console.log(error);
    toast(error);
  } finally {
    this.setState({ isResendOtpApiRunning: false });
  }
}

export async function resendLoginOtp(resend_url) {
  this.setState({ isResendOtpApiRunning: true });
  try {
    const res = await Api.get(resend_url);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      toast(result.message || "Success!");
    } else {
      throw result.error || result.message || errorMessage;
    }
  } catch (error) {
    console.log(error);
    toast(error);
  } finally {
    this.setState({ isResendOtpApiRunning: false });
  }
}

export async function getKycFromSummary(params = {}) {
  if (isEmpty(params)) {
    // Default params
    params = {
      kyc: ["kyc"],
      user: ["user"],
      partner: ["partner"],
      campaign: ["user_campaign"],
      referral: ["subbroker", "p2p"],
      contacts: ["contacts"],
      nps: ['nps_user'],
      equity: ['subscription_status']
    }
  }
  const res = await Api.post(`/api/user/account/summary`, params);
  if (!res || !res.pfwresponse) throw errorMessage;
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    let user = result.data.user.user.data;
    let kyc = result.data.kyc.kyc.data;
    let nps = result.data?.nps?.nps_user?.data;
    storageService().setObject("kyc", kyc);
    storageService().setObject("user", user);
    if (!isEmpty(nps)) {
      storageService().setObject("npsUser", nps);
    }
    return result;
  } else {
    throw result.error || result.message || errorMessage;
  }
}

export function redirectAfterLogin(data, user, navigateFunc) {
  const kyc = storageService().getObject("kyc");
  const ipoContactNotVerified = storageService().get("ipoContactNotVerified") || false;
  const sdkStocksRedirection = storageService().getBoolean("sdkStocksRedirection");
  user = user || storageService().getObject("user");
  const navigate = navigateFunc || this.navigate;
  const appConfig = getConfig();
  const TRADING_ENABLED = isTradingEnabled(kyc);
  if (appConfig.odin && TRADING_ENABLED) {
    navigate("/direct/odin");
  } else if (data.firstLogin) {
    navigate("/referral-code", { state: { goBack: "/", communicationType: data?.contacts?.auth_type } });
  } else if (sdkStocksRedirection) {
    storageService().setBoolean("sdkStocksRedirection", false);
    storageService().setBoolean("openEquityCallback", true);
    navigate("/invest", { edit: true, state: { goBack: "/" } });
  } else if (ipoContactNotVerified){
    storageService().set("ipoContactNotVerified", false);
    navigate("/market-products", { state: { goBack: "/invest" } });
  } else if (
    user.kyc_registration_v2 === "incomplete" &&
    user.active_investment
  ) {
    navigate("/kyc/journey", { state: { goBack: "/invest" } });
  } else if (
    user.kyc_registration_v2 === "incomplete" &&
    !user.active_investment
  ) {
    navigate("/invest", { edit: true, state: { goBack: "/" } });
  } else if (
    kyc &&
    !kyc.pan.meta_data.pan_number &&
    user.kyc_registration_v2 === "init"
  ) {
    navigate("/invest", { edit: true, state: { goBack: "/invest" } });
  } else if (user.active_investment) {
    navigate("/invest", { edit: true, state: { goBack: "/invest" } });
  } else {
    navigate("/invest", { edit: true, state: { goBack: "/" } });
  }
}

export const logout = async () => {
  try {
    const res = await Api.get("api/logout");

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw res?.pfwmessage || errorMessage;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      storageService().clear();
      return result;
    } else {
      throw result.error || result.message || errorMessage;
    }
  } catch (e) {
    console.log(e);
    toast(e);
  }
};

export async function authCheckApi(type, data) {
  let error = "";
  try {
    this.setState({
      loading: true,
      isApiRunning: "button"
    });
    // Checking if that id has some other account associated
    const response = await Api.get(
      `/api/iam/auth/check?contact_type=${type}&contact_value=${data.contact_value}`
    );
    const { result, status_code: status } = response.pfwresponse;
    if (status === 200) {
      return result;
    } else {
      error =
        result.error ||
        result.message ||
        "Something went wrong!";
      throw error;
    }
  } catch (err) {
    console.log(err)
    toast(err);
  } finally {
    this.setState({
      loading: false,
      isApiRunning: false
    });
  }
}

export async function generateOtp(data) {
  let error = "";
  try {
    const otpResponse = await Api.post("/api/communication/send/otp", data);
    if (otpResponse.pfwresponse.status_code === 200) {
      // OTP_ID GENERATED, NAGIVATE TO THE OTP VERIFICATION SCREEN
      return otpResponse;
    } else {
      error =
        otpResponse.pfwresponse.result.error ||
        otpResponse.pfwresponse.result.message ||
        "Something went wrong!";
      throw error;
    }
  } catch (err) {
    Toast(err);
  }
}

export const partnerAuthentication = async (data) => {
  const res = await Api.post(`/api/partner/${data.partnerCode}/redirect?token=${data.token}&view=${data.view}`);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(res?.pfwmessage || errorMessage);
  }

  const { result, status_code: status } = res.pfwresponse;

  if (status === 200) {
    return result;
  } else {
    throw new Error(result.error || result.message || errorMessage);
  }
}

// todo will make login as functional component, this is temp fix
export const loadScriptInBody = (id, url) => {
  const isScriptLoaded = document.getElementById(id);
  if (!isScriptLoaded) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.id = id;
    document.body.appendChild(script);
  }
}
