import { validateEmail } from "utils/validators";
import toast from "common/ui/Toast";
import Api from "utils/api";
import { storageService, getUrlParams } from "utils/validators";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { isEmpty } from "../utils/validators";
import { nativeCallback } from "../utils/native_callback";
import { getBasePath } from "../utils/functions";
import Toast from "../common/ui/Toast";

const config = getConfig();
const isMobileView = config.isMobileDevice;
const errorMessage = "Something went wrong!";
const basePath = getBasePath();
export function initialize() {
  this.formCheckFields = formCheckFields.bind(this);
  this.emailLogin = emailLogin.bind(this);
  this.triggerOtpApi = triggerOtpApi.bind(this);
  this.initiateOtpApi = initiateOtpApi.bind(this);
  this.verifyCode = verifyCode.bind(this);
  this.emailRegister = emailRegister.bind(this);
  this.resendVerificationLink = resendVerificationLink.bind(this);
  this.otpVerification = otpVerification.bind(this);
  this.otpLoginVerification = otpLoginVerification.bind(this);
  this.resendOtp = resendOtp.bind(this);
  this.resendLoginOtp = resendLoginOtp.bind(this);
  this.forgotPassword = forgotPassword.bind(this);
  this.verifyForgotOtp = verifyForgotOtp.bind(this);
  this.navigate = navigateFunc.bind(this.props);
  this.getKycFromSummary = getKycFromSummary.bind(this);
  this.redirectAfterLogin = redirectAfterLogin.bind(this);
  this.setUserAgent = setUserAgent.bind(this);
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
  ];
  const partner = storageService().get("partner") || "";
  if (partners.includes(partner)) {
    referrer = partner;
    const deeplinkUrl = storageService().get("deeplink_url") || "";
    if (deeplinkUrl) {
      redirectUrl = deeplinkUrl;
    }
  }
  const rebalancingRedirectUrl = main_query_params.redirect_url
    ? `?redirect_url=${main_query_params.redirect_url}`
    : "";

  let socialRedirectUrl = encodeURIComponent(
    basePath + "/social/callback" + rebalancingRedirectUrl
  );

  this.setUserAgent();

  let facebookUrl =
    config.base_url +
    "/auth/facebook?redirect_url=" +
    socialRedirectUrl +
    "&referrer=" +
    referrer;
  let googleUrl =
    config.base_url +
    "/auth/google?redirect_url=" +
    socialRedirectUrl +
    "&referrer=" +
    referrer;
  this.setState({
    referrer: referrer,
    facebookUrl: facebookUrl,
    googleUrl: googleUrl,
    redirectUrl: redirectUrl,
    rebalancingRedirectUrl: main_query_params.redirect_url,
  });
}

export function setUserAgent() {
  nativeCallback({
    action: "set_user_agent", message: {
      user_agent: "Mozilla/5.0 AppleWebKit/537.36 Chrome/65.0.3325.181 Mobile Safari/537.36"
    }
  })
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
      this.initiateOtpApi(body, loginType);
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
      body.auth_value = `${form_data["code"]}${form_data["mobile"]}`,
      body.need_key_hash = true,
      body.user_whatsapp_consent = form_data["whatsapp_consent"],
      this.initiateOtpApi(body, loginType);
    }
  }
}

export function setBaseHref() {
  var myBaseHref = document.getElementById('myBaseHref');
  var pathname = window.location.pathname;
  if (pathname.indexOf('appl/webview') !== -1) {
    var myBaseHrefUrl = '/appl/webview/' + pathname.split('/')[3] + '/';
    myBaseHref.href = myBaseHrefUrl;
    window.sessionStorage.setItem('base_href', myBaseHrefUrl);
  }
}

export async function emailLogin(body) {
  try {
    const res = await Api.post(`/api/user/login`, body);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      if (this.state.rebalancingRedirectUrl) {
        window.location.href = this.state.rebalancingRedirectUrl;
        return;
      }
      storageService().setObject("user", result.user);
      if (!isMobileView && result.firstLogin) {
        storageService().setObject("first_login", result.firstLogin);
      }
      storageService().set("currentUser", true);
      let userData = {};
      let kycResult = await getKycFromSummary();
      if (!kycResult) {
        this.setState({ isApiRunning: false });
        return;
      }
      if (config.Web && kycResult.data.partner.partner.data) {
        storageService().set(
          "partner",
          kycResult.data.partner.partner.data.name
        );
      }

      let user = kycResult.data.user.user.data;
      userData.me = user;
      storageService().set("dataSettedInsideBoot", true);
      storageService().setObject("referral", kycResult.data.referral);
      storageService().setObject(
        "campaign",
        kycResult.data.campaign.user_campaign.data
      );
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
        this.redirectAfterLogin(result, user);
      }
    } else {
      toast(result.message || result.error || errorMessage);
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast(error || errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function triggerOtpApi(body, loginType) {
  try {
    const res = await Api.post(
      `/api/communication/send/otp`, body
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast("OTP is sent successfully to your mobile number.");
      this.setState({ isApiRunning: false });
      if (body?.secondaryVerification) {
        this.navigate("secondary-otp-verification", {
          state: {
            value: body.mobile ||  body.email,
            rebalancing_redirect_url: this.state.rebalancingRedirectUrl,
            otp_id: result?.otp_id,
            communicationType: loginType,
          },
        });
      } else {
        this.navigate("verify-otp", {
          state: {
            value: body.mobile || body.email,
            rebalancing_redirect_url: this.state.rebalancingRedirectUrl,
            otp_id: result?.otp_id,
            communicationType: loginType,
          },
        });
      } if (this.state.referrer) {
        let item = {
          promo_code: this.state.referrer,
        };
        storageService.setObject("user_promo", item);
      }

      if (this.state.isPromoSuccess && this.state.form_data.referral_code !== "") {
        let item = {
          promo_code: this.state.form_data.referral_code,
        };
        storageService().setObject("user_promo", item);
      }
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function initiateOtpApi(body, loginType) {
  let formData = new FormData();
  formData.append("auth_type", loginType);
  formData.append("auth_value", body.auth_value);
  formData.append("Content-Type", "application/x-www-form-urlencoded")   // [ "multipart/form-data" ]
  try {
    const res = await Api.post(`/api/user/login/v4/initiate`, formData)
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast("OTP is sent successfully to your mobile number.");
      this.setState({ isApiRunning: false });
      this.navigate("verify-otp", {
        state: {
          value: body.auth_value,
          rebalancing_redirect_url: this.state.rebalancingRedirectUrl,
          communicationType: loginType,
          verify_url: result?.verify_url,
          resend_url: result?.resend_url,
          user_whatsapp_consent: body?.user_whatsapp_consent || '',
        },
      });
      toast(result?.message || result?.error || errorMessage);
    } else {
      toast(result?.message || result?.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function emailRegister(body) {
  try {
    const res = await Api.post(
      `/api/user/register?email=${body.email}&password=${body.password}&redirect_url=${body.redirect_url}&referrer_code=${body.referrer_code}`,
      body
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      if (this.state.rebalancingRedirectUrl) {
        window.location.href = this.state.rebalancingRedirectUrl;
        return;
      }
      if (this.state.isPromoSuccess) {
        var item = {
          user_id: result.user.user_id,
          promo_code: body.referrer_code,
        };
        storageService().setObject("user_promo", item);
      }

      toast(
        "Please click on the verification link sent to your email account."
      );
      this.setState({ resendVerification: true, isApiRunning: false });
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function verifyCode(form_data) {
  if (!form_data.referral_code) {
    form_data[`referral_code_error`] = "This is required";
    this.setState({ form_data: form_data });
    return;
  }
  this.setState({ isPromoApiRunning: true });
  let body = {
    code: form_data.referral_code,
  };
  try {
    const res = await Api.get(`/api/checkpromocode`, body);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast("Success");
      this.setState({
        isPromoSuccess: true,
        promo_status: "Valid",
        isPromoApiRunning: false,
      });
    } else {
      this.setState({
        isPromoSuccess: false,
        promo_status: "Invalid",
        isPromoApiRunning: false,
      });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
    this.setState({ isPromoApiRunning: false });
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
      toast(result.message || result.error || errorMessage);
    }
    this.setState({ resendVerificationApi: false });
  } catch (error) {
    console.log(error);
    toast(errorMessage);
    this.setState({ resendVerificationApi: false });
  }
}

export async function otpLoginVerification(verify_url, body) {
  let formData = new FormData();
  formData.append("otp", body?.otp);
  formData.append("user_whatsapp_consent", body?.user_whatsapp_consent);
  formData.append("Content-Type", "application/x-www-form-urlencoded"); //   [ "multipart/form-data" ]
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.post(verify_url, formData);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      let eventObj = {
        event_name: "user loggedin",
      };
      nativeCallback({ events: eventObj });
      applyCode(result.user);
      storageService().setObject("user", result.user);
      storageService().set("currentUser", true);
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

      if (config.Web && kycResult.data.partner.partner.data) {
        storageService().set(
          "partner",
          kycResult.data.partner.partner.data.name
        );
      }

      let user = kycResult.data.user.user.data;
      userData.me = user;
      storageService().set("dataSettedInsideBoot", true);
      storageService().setObject("referral", kycResult.data.referral);
      storageService().setObject(
        "campaign",
        kycResult.data.campaign.user_campaign.data
      );
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
        this.redirectAfterLogin(result, user);
      }
    } else {
      if (result?.error === "Wrong OTP is Entered" || result?.error === "Verification failed") {
        this.setState({ isWrongOtp: true })
      }
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
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
      let eventObj = {
        event_name: "user loggedin",
      };
      nativeCallback({ events: eventObj });
      applyCode(result.user);
      storageService().setObject("user", result.user);
      storageService().set("currentUser", true);
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

      if (config.Web && kycResult.data.partner.partner.data) {
        storageService().set(
          "partner",
          kycResult.data.partner.partner.data.name
        );
      }

      let user = kycResult.data.user.user.data;
      userData.me = user;
      storageService().set("dataSettedInsideBoot", true);
      storageService().setObject("referral", kycResult.data.referral);
      storageService().setObject(
        "campaign",
        kycResult.data.campaign.user_campaign.data
      );
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
        this.redirectAfterLogin(result, user);
      }
    } else {
      if (result.error === "Wrong OTP is Entered") {
        this.setState({ isWrongOtp: true })
      }
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}


export async function applyCode(user) {
  var userPromo = storageService().getObject("user_promo");
  if (userPromo && user.user_id) {
    try {
      const res = await Api.post(`/api/referral/apply`, {
        code: userPromo.promo_code,
      });
      const { status_code: status } = res.pfwresponse;
      if (status === 200) {
        storageService.remove("user_promo");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function resendOtp(otp_id) {
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.post(`/api/communication/resend/otp/${otp_id}`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      toast(result.message || "Success!");
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function resendLoginOtp(resend_url) {
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.get(resend_url);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      toast(result.message || "Success!");
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function forgotPassword(body) {
  try {
    const res = await Api.get(`/api/forgotpassword`, body);
    const { result, status_code: status } = res.pfwresponse;
    let { loginType } = this.state;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      if (loginType === "email") toast(`A link has been sent to ${body.email}`);
      else {
        this.navigate("mobile/verify", {
          state: {
            mobile_number: body.mobile,
            forgot: true,
          },
        });
      }
    } else {
      toast(result.message || result.error || errorMessage);
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function verifyForgotOtp(body) {
  this.setState({ isApiRunning: "button" });
  try {
    const res = await Api.post(`/api/user/verifymobile?otp=${body.otp}`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ isApiRunning: false });
      toast("Login to continue");
      this.navigate("/login");
    } else {
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    toast(errorMessage);
  } finally {
    this.setState({ isApiRunning: false });
  }
}

export async function getKycFromSummary() {
  const res = await Api.post(`/api/user/account/summary`, {
    kyc: ["kyc"],
    user: ["user"],
    partner: ["partner"],
    campaign: ["user_campaign"],
    referral: ["subbroker", "p2p"],
    contacts: ["contacts"],
  });
  if (!res || !res.pfwresponse) throw errorMessage;
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    let user = result.data.user.user.data;
    let kyc = result.data.kyc.kyc.data;
    storageService().setObject("kyc", kyc);
    storageService().setObject("user", user);
    return result;
  } else {
    throw result.message || result.error || errorMessage;
  }
}

export function redirectAfterLogin(data, user) {
  const kyc = storageService().getObject("kyc");
  if (data.firstLogin) {
    this.navigate("/referral-code", { state: { goBack: "/", communicationType: data?.contacts?.auth_type } });
  } else if (
    user.kyc_registration_v2 === "incomplete" &&
    user.active_investment
  ) {
    this.navigate("/kyc/journey", { state: { goBack: "/invest" } });
  } else if (
    user.kyc_registration_v2 === "incomplete" &&
    !user.active_investment
  ) {
    this.navigate("/", { state: { goBack: "/" } });
  } else if (
    kyc &&
    !kyc.pan.meta_data.pan_number &&
    user.kyc_registration_v2 === "init"
  ) {
    this.navigate("/kyc/home", { state: { goBack: "/invest" } });
  } else if (user.active_investment) {
    this.navigate("/landing", { state: { goBack: "/landing" } });
  } else {
    this.navigate("/", { state: { goBack: "/" } });
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
      window.localStorage.clear();
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
        result.message ||
        result.error ||
        "Something went wrong!";
      throw error;
    }
  } catch (err) {
    Toast(err, "error");
  } finally {
    this.setState({
      loading: false,
    });
  }
}

export async function generateOtp(data) {
  let error = "";
  try {
    this.setState({
      loading: true,
    });
    const otpResponse = await Api.post("/api/communication/send/otp", data);
    if (otpResponse.pfwresponse.status_code === 200) {
      // OTP_ID GENERATED, NAGIVATE TO THE OTP VERIFICATION SCREEN
      return otpResponse;
    } else {
      error =
        otpResponse.pfwresponse.result.message ||
        otpResponse.pfwresponse.result.error ||
        "Something went wrong!";
      throw error;
    }
  } catch (err) {
    Toast(err);
  } finally {
    this.setState({
      loading: false,
    });
  }
}
