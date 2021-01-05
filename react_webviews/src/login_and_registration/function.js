import { validateEmail } from "utils/validators";
import toast from "../common/ui/Toast";
import Api from "utils/api";
import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

let servletUrl = "https://sdk-dot-plutus-staging.appspot.com";

export function formCheckFields(keys_to_check, form_data, loginType) {
  this.emailLogin = emailLogin.bind(this);
  this.mobileLogin = mobileLogin.bind(this);
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
  let redirectUrl = encodeURIComponent(
    window.location.protocol +
      "://" +
      window.location.host +
      ":" +
      window.location.port +
      "/#!/"
  );
  let body = {
    redirectUrl: redirectUrl,
  };

  this.setState({isApiRunning : true });
  if (loginType === "email") {
    body.email = form_data["email"];
    body.password = form_data["password"];
    this.emailLogin(body);
  } else {
    body.mobile_number = `${form_data["code"]}|${form_data["mobile"]}`;
    this.mobileLogin(body);
  }
}

export async function emailLogin(body) {
  try {
    const res = await Api.post(`${servletUrl}/api/user/login`, body);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      storageService().setObject("user", result.user);
      if (!isMobileView && result.firstLogin) {
        storageService().setObject("first_login", result.firstLogin);
      }
      storageService().set("currentUser", true);
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({isApiRunning : false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
  }
}

export async function mobileLogin(body) {
  try {
    const res = await Api.get(`${servletUrl}/api/iam/userauthstatus?auth_type=mobile&auth_value=${body.mobile_number}`);
    const { result, status_code: status } = res.pfwresponse;
    console.log(res)
    if (status === 200) {
        toast('OTP is sent successfully to your mobile number.')
    } else {
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({isApiRunning : false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({isApiRunning : false });
  }
}
