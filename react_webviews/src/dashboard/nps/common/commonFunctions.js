import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";
import toast from "../../../common/ui/Toast";
// import { nps_config } from "../constants";

const genericErrMsg = "Something went wrong";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.formCheckUpdate = formCheckUpdate.bind(this);
  this.get_recommended_funds = get_recommended_funds.bind(this);
  this.kyc_submit = kyc_submit.bind(this);
  this.nps_register = nps_register.bind(this);
  this.updateMeta = updateMeta.bind(this);
  this.getInvestmentData = getInvestmentData.bind(this);
  this.submitPran = submitPran.bind(this);
  this.getNPSInvestmentStatus = getNPSInvestmentStatus.bind(this);
  this.accountMerge = accountMerge.bind(this);
  this.checkMerge = checkMerge.bind(this);
  this.openInBrowser = openInBrowser.bind(this);
  this.openInTabApp = openInTabApp.bind(this);
  this.uploadDocs = uploadDocs.bind(this);
  this.setErrorData = setErrorData.bind(this);
  this.handleError = handleError.bind(this);

  nativeCallback({ action: "take_control_reset" });

  this.setState(
    {
      productName: getConfig().productName,
    },
    () => {
      this.onload();
    }
  );
}

export function setErrorData(type) {
  this.setState({
    showError: false,
  });
  if (type) {
    let mapper = {
      onload: {
        handleClick1: this.onload,
        title1: this.state.title1,
        button_text1: "Retry",
      },
      upldateFeedback: {
        handleClick1: () => {
          this.setState({
            showError: false,
          });
        },
        title1: this.state.title1,
        button_text1: "Dismiss",
      },
      submit: {
        handleClick1: this.handleClick,
        button_text1: "Retry",
        title1: this.state.title1,
        handleClick2: () => {
          this.setState({
            showError: false,
          });
        },
        button_text2: "Edit",
      },
    };

    this.setState({
      errorData: { ...mapper[type], setErrorData: this.setErrorData },
    });
  }
}

export function handleError(error, errorType, fullScreen = true) {
  this.setState({
    show_loader: false,
    skelton: false,
    isApiRunning: false,
    errorData: {
      ...this.state.errorData,
      title2: error,
      type: errorType,
    },
    showError: fullScreen ? "page" : true,
  });
}

export function navigate(pathname, data = {}, redirect) {
  if (redirect) {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      state: data,
    });
  } else {
    this.props.history.push({
      pathname: `/nps/${pathname}`,
      search: data.searchParams || getConfig().searchParams,
      state: data,
    });
  }
}

export function formCheckUpdate(keys_to_check, form_data) {
  if (!form_data) {
    form_data = this.state.form_data;
  }

  let canSubmit = true;

  let keysMapper = {
    pan: "pan",
    pran: "pran",
    dob: "dob",
    mobile_no: "mobile no.",
    mother_name: "mother name",
    spouse_name: "spouse_name",
    nominee_name: "nominee_name",
    nominee_dob: "nominee_dob",
    relationship: "relationship",
    pincode: "pincode",
    addressline: "permanent address",
    city: "city",
    state: "state",
    marital_status: "marital status",
  };

  let selectTypeInput = ["relationship"];

  for (var i = 0; i < keys_to_check.length; i++) {
    let key_check = keys_to_check[i];
    let first_error =
      selectTypeInput.indexOf(key_check) !== -1
        ? "Please select "
        : "Please enter ";
    if (!form_data[key_check]) {
      form_data[key_check + "_error"] = first_error + keysMapper[key_check];
      canSubmit = false;
    }
  }

  this.setState({
    form_data: form_data,
    canSubmit: canSubmit,
  });

  return canSubmit;
}

export async function get_recommended_funds(params, pageError = false) {
  let error = "";
  let errorType = "";

  let pran = storageService().get("nps_pran_number");
  try {
    this.setState({
      show_loader: "button",
      showError: false,
    });
    const res = await Api.get(
      `api/nps/invest/recommend?amount=${params}${pran ? `&pran=${pran}` : ""}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      show_loader: false,
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      if (pageError) {
        this.setErrorData("onload");
      } else {
        this.setErrorData("submit");
      }

      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, pageError);
  }
}

export async function kyc_submit(params) {
  let error = "";
  let errorType = "";

  try {
    this.setState({
      show_loader: "button",
    });
    const res = await Api.post("api/kyc/v2/mine", params);

    const { result, status_code: status } = res.pfwresponse;

    this.setState({
      show_loader: false,
    });
    if (status === 200) {
      this.navigate("amount/one-time");
    } else {
      switch (status) {
        case 402:
          this.accountMerge();
          break;
        default: 
          let title1 =
            result.error || result.message || "Something went wrong!";
          this.setState({
            title1: title1,
          });
          this.setErrorData("submit");
          throw error;
      }
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType);
  }
}

export async function nps_register(params, next_state, body = "") {
  let error = "";
  let errorType = "";

  try {
    this.setState({
      show_loader: "button",
      showError: false,
    });
    const res = await Api.post(`api/nps/register/update/v2?${params}`, body);

    const { result, status_code: status } = res.pfwresponse;

    this.setState({
      show_loader: false,
    });

    if (status === 200) {
      this.navigate(next_state);
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });
      this.setErrorData("submit");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false);
  }
}

export async function updateMeta(params, next_state) {
  let error = "";
  let errorType = "";

  try {
    this.setState({
      show_loader: "button",
      showError: false,
    });
    const res = await Api.post(`api/nps/invest/updatemeta`, params);

    const { result, status_code: status } = res.pfwresponse;

    this.setState({
      show_loader: false,
    });
    if (status === 200) {
      let nps_additional_details =
        storageService().getObject("nps_additional_details") || {};
      nps_additional_details.nps_details = result.user;

      storageService().setObject(
        "nps_additional_details",
        nps_additional_details
      );

      if (this.state.screen_name === "nps_delivery") {
        let kyc_app = storageService().getObject("kyc_app") || {};

        kyc_app.address.meta_data = result.user.address;

        storageService().setObject("kyc_app", kyc_app);

        if (result.user.is_doc_required) {
          this.navigate("upload");
        } else {
          this.navigate("success");
        }
      } else {
        this.navigate(next_state);
      }
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });
      this.setErrorData("submit");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false);
  }
}

export async function getInvestmentData(params, pageError = false) {
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
      showError: false,
    });

    const res = await Api.post(`api/nps/invest/v2?app_version=1`, params);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      storageService().set("npsInvestId", result.id);
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("submit");
      throw error;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
    });
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType, pageError);
  }
}

export async function submitPran(params) {
  let error = "";
  let errorType = "";
  
  this.setState({
    show_loader: "button",
    showError: false
  });

  try {
    const res = await Api.post(`/api/nps/user/pran/account/status`, params);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      switch(status) {
        case 301: 
          this.navigate('pan');
          break;
        case 303:
          this.navigate('/kyc/journey', '', true)
          break;
        default: 
          let title1 = result.error || result.message || "Something went wrong!";
          this.setState({
            title1: title1,
          });
        
          this.setErrorData("submit");
          throw title1;
      }

    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false);
  }
}

export async function getNPSInvestmentStatus() {
  this.setState({
    show_loader: "button",
  });
  try {
    const res = await Api.get(`/api/nps/invest/status/v2`);

    const { result, status_code: status } = res.pfwresponse;
    this.setState({
      show_loader: false,
    });

    if (status === 200) {
      storageService().setObject(
        "nps_additional_details",
        result.registration_details
      );
      if (this.state.screen_name === "npsPaymentStatus") {
        return result;
      } else {
        this.navigate("identity");
      }
    } else {
      toast(result.error || result.message || genericErrMsg);
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    console.log(err);
    toast("something went wrong");
  }
}

export async function accountMerge() {
  if (this.state.isIframe) {
    let config = getConfig();
    let email = config.email;
    let name = "fisdom";
    if (config.productName === "finity") name = "finity";
    const toastMessage = `The PAN is already associated with another ${name} account. Kindly send mail to ${email} for any clarification`;
    toast(toastMessage)
  } else {
    this.setState({
      show_loader: true,
    });

    let userKyc = storageService().getObject("kyc");
    let pan_number = userKyc.pan.meta_data.pan_number;

    this.checkMerge(pan_number);
  }
}

export async function checkMerge(pan_number) {

  this.setState({
    show_loader: "button",
  });

  try {
    const res = await Api.post(
      `/api/user/account/merge?pan_number=${pan_number.toUpperCase()}&verify_only=true`
    );

    const { result, status_code: status } = res.pfwresponse;

    this.setState({
      show_loader: false,
    });
    if (status === 200) {
      this.setState({
        auth_ids: result.auth_ids,
        openDialog: true,
        title: "PAN Already Exists",
        subtitle: "Sorry! this PAN is already registered with another account.",
        btn_text: "LINK ACCOUNT",
      });
    } else {
      if (result.different_login) {
        this.setState({
          openDialog: true,
          title: "PAN Is already registered",
          subtitle: result.error || result.message,
          btn_text: "SIGN OUT",
        });
      } else {
        toast(result.error || result.message || 'something went wrong') 
      }
    }
  } catch (err) {
    console.log(err);
    toast("something went wrong");
  }
}

export function openInBrowser(url) {
  nativeCallback({
    action: "open_in_browser",
    message: {
      url: url,
    },
  });
}

export function openInTabApp(data = {}) {
  nativeCallback({
    action: "open_inapp_tab",
    message: {
      url: data.url || "",
      back_url: data.back_url || "",
    },
  });
}

///api/invest/folio/import/image
export async function uploadDocs(file) {
  this.setState({
    show_loader: "button",
    showError: false,
  });

  var uploadurl = "/api/invest/folio/import/image";
  const data = new FormData();
  data.append("res", file);
  data.append("doc_type", file.doc_type);

  let error = "";
  let errorType = "";

  try {
    const res = await Api.post(uploadurl, data);

    var resultData = res.pfwresponse.result || {};
    if (res.pfwresponse.status_code === 200 && resultData.message) {
      if (this.state.screen_name === "nps-identity") {
        return resultData;
      } else {
        this.navigate("success");
      }
    } else {
      let title1 =
        resultData.error || resultData.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("submit");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType, false);
  }
}
