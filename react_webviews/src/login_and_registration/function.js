import { validateEmail } from "utils/validators";
import toast from "../common/ui/Toast";
import Api from "utils/api";
import { storageService, getUrlParams } from "utils/validators";
import { getConfig } from "utils/functions";

const isMobileView = getConfig().isMobileDevice;

export function initialize() {
  this.formCheckFields = formCheckFields.bind(this);
  this.emailLogin = emailLogin.bind(this);
  this.mobileLogin = mobileLogin.bind(this);
  this.verifyCode = verifyCode.bind(this);
  this.emailRegister = emailRegister.bind(this);
  this.resendVerificationLink = resendVerificationLink.bind(this);
  this.otpVerification = otpVerification.bind(this);
  this.resendOtp = resendOtp.bind(this);
  this.forgotPassword = forgotPassword.bind(this);
  this.navigate = navigate.bind(this);
  let main_query_params = getUrlParams();
  let { referrer } = main_query_params;
  let referrerParam = referrer || "";
  let rebalancing_redirect_url =
    getConfig().redirect_url !== undefined
      ? "?redirect_url=" + getConfig().redirect_url
      : "";

  let socialRedirectUrl = encodeURIComponent(
    window.location.href + "/#/social/callback" + rebalancing_redirect_url
  );

  let facebookUrl =
    getConfig().base_url +
    "/auth/facebook?redirect_url=" +
    socialRedirectUrl +
    "&referrer=" +
    referrerParam;
  let googleUrl =
    getConfig().base_url +
    "/auth/google?redirect_url=" +
    socialRedirectUrl +
    "&referrer=" +
    referrerParam;
  this.setState({
    referrer: referrerParam,
    facebookUrl: facebookUrl,
    googleUrl: googleUrl,
  });
}

export function formCheckFields(
  keys_to_check,
  form_data,
  userAction,
  loginType
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

  let redirectUrl = encodeURIComponent(window.location.href);
  let body = {
    redirect_url: redirectUrl,
  };

  this.setState({ isApiRunning: true });
  if (loginType === "email" && userAction === "LOGIN") {
    body.email = form_data["email"];
    body.password = form_data["password"];
    body.referrer = this.state.referrer;
    this.emailLogin(body);
  } else if (loginType === "email" && userAction === "REGISTER") {
    body.email = form_data["email"];
    body.password = form_data["password"];
    body.referrer_code = form_data["referral_code"] || "";
    body.referrer = this.state.referrer;
    this.emailRegister(body);
  } else if (userAction === "RESET") {
    if (loginType === "mobile")
      body.mobile_number = `${form_data["code"]}|${form_data["mobile"]}`;
    else body.email = form_data.email;
    this.forgotPassword(body);
  } else {
    body.mobile_number = `${form_data["code"]}|${form_data["mobile"]}`;
    this.mobileLogin(body);
  }
}

export async function emailLogin(body) {
  try {
    const res = await Api.post(`/api/user/login`, body);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      storageService().setObject("user", result.user);
      if (!isMobileView && result.firstLogin) {
        storageService().setObject("first_login", result.firstLogin);
      }
      storageService().set("currentUser", true);
      toast("Login Successful");
      // handle user kyc
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ isApiRunning: false });
  }
}

export async function mobileLogin(body) {
  try {
    const res = await Api.get(
      `/api/iam/userauthstatus?auth_type=mobile&auth_value=${body.mobile_number}`
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast("OTP is sent successfully to your mobile number.");
      if (this.state.referrer) {
        let item = {
          promo_code: this.state.referrer,
        };
        storageService.setObject("user_promo", item);
      }

      if (this.state.isPromoSuccess && this.state.referral_code !== "") {
        let item = {
          promo_code: this.state.referral_code,
        };
        storageService().setObject("user_promo", item);
      }
      let rebalancing_redirect_url =
        getConfig().redirect_url !== undefined
          ? getConfig().redirect_url
          : false;

      this.props.history.push(
        {
          pathname: "mobile/verify",
          search: getConfig().searchParams,
        },
        {
          mobile_number: body.mobile_number,
          rebalancing_redirect_url: rebalancing_redirect_url,
        }
      );
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ isApiRunning: false });
  }
}

export async function emailRegister(body) {
  try {
    const res = await Api.post(
      `/api/user/register?email=${body.email}&password=${body.password}&redirect_url=${body.redirectUrl}&referrer_code=${body.referrer_code}`,
      body
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      // if (getConfig().redirect_url !== undefined) {
      //   window.location = getConfig().redirect_url;
      //   return;
      // }
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
      this.setState({ resendVerification: true });
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
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
      toast(result.message || result.error || "Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
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
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ resendVerificationApi: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ resendVerificationApi: false });
  }
}

export async function otpVerification(body) {
  this.setState({ isApiRunning: true });
  try {
    const res = await Api.post(
      `/api/mobile/login?mobile_number=${body.mobile_number}&otp=${body.otp}`
    );
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast("Login Successful");
      applyCode(result.user);
      storageService().setObject("user", result.user);
      storageService().set("currentUser", true);
      if (this.state.rebalancing_redirect_url) {
        window.location.href = this.state.rebalancing_redirect_url;
        return;
      }
      // handle user kyc
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
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

export async function resendOtp() {
  this.setState({ isApiRunning: true });
  try {
    const res = await Api.get(`/api/resendotp`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      toast(result.message || "Success!");
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ isApiRunning: false });
  }
}

export async function forgotPassword(body) {
  try {
    const res = await Api.get(`/api/forgotpassword`, body);
    const { result, status_code: status } = res.pfwresponse;
    let { loginType } = this.state;
    if (status === 200) {
      if (loginType === "email") toast(`A link has been sent to ${body.email}`);
      else {
        this.props.history.push(
          {
            pathname: "mobile/verify",
            search: getConfig().searchParams,
          },
          {
            mobile_number: body.mobile_number,
          }
        );
      }
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ isApiRunning: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ isApiRunning: false });
  }
}

export function navigate(pathname, data = {}) {
  if (this.props.edit || data.edit) {
    this.props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  } else {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      params: data.params || {},
    });
  }
}
