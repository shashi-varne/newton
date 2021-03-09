import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";
import toast from "../../../common/ui/Toast";
// import Dialog, {
//   DialogActions,
//   // DialogTitle,
//   DialogContent,
//   DialogContentText
// } from 'material-ui/Dialog';
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
  this.openInBrowser = openInBrowser.bind(this);
  this.openInTabApp = openInTabApp.bind(this);
  this.uploadDocs = uploadDocs.bind(this);
  
  let screenData = {};

  // if (this.state.screen_name) {
  //   screenData = nps_config[this.state.screen_name];
  // }

  // let next_screen = this.state.next_screen || "";

  // if (this.state.screen_name && nps_config.get_next[this.state.screen_name]) {
  //   next_screen = nps_config.get_next[this.state.screen_name];

  //   this.setState({
  //     next_state: next_screen,
  //   });
  // }

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

export function navigate(pathname, data = {}, redirect) {
  if (redirect) {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
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
    marital_status: 'marital status'
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

export async function get_recommended_funds(params) {
  try {
    this.setState({
      show_loader: true,
    });
    const res = await Api.get(`api/nps/invest/recommend?amount=${params}`);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    let result = res.pfwresponse;

    // if (status === 200) {
    //   return result;
    // } else {
    //   throw result.error || result.message || genericErrMsg;
    // }
    return result;
  } catch (err) {
    throw err;
  }
}

export async function kyc_submit(params) {
  try {
    this.setState({
      show_loader: true,
    });
    const res = await Api.post("api/kyc/v2/mine", params);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      this.navigate("amount/one-time");
    } else {
      switch (status) {
        case 402:
          this.accountMerge()
          break;
        default:
          toast(result.error || result.message || genericErrMsg);
          break;
      }
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    console.log(err);
    toast("something went wrong");
  }
}

export async function nps_register(params, next_state, body = "") {
  console.log(body);
  try {
    this.setState({
      show_loader: true,
    });
    const res = await Api.post(`api/nps/register/update/v2?${params}`, body);

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      this.navigate(next_state);
    } else {
      this.setState({
        show_loader: false,
      });
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    console.log(err);
    toast("something went wrong");
  }
}

export async function updateMeta(params, next_state) {
  try {
    this.setState({
      show_loader: true,
    });
    const res = await Api.post(`api/nps/invest/updatemeta`, params);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      let nps_additional_details =
        storageService().getObject("nps_additional_details") || {};
      nps_additional_details.nps_details = result.user;

      storageService().setObject(
        "nps_additional_details",
        nps_additional_details
      );

      if (this.state.screen_name === "nps_delivery") {
        if (!result.user.is_doc_required) {
          this.navigate("upload");
        } else {
          this.navigate("success");
        }
      } else {
        this.navigate(next_state);
      }
    } else {
      this.setState({
        show_loader: false,
      });
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    throw err;
  }
}

export async function getInvestmentData(params) {
  try {
    this.setState({
      show_loader: true,
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
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
}

export async function submitPran(params) {
  this.setState({
    show_loader: true
  })

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
      this.setState({
        show_loader: false
      })
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    this.setState({
      show_loader: false
    })
    console.log(err);
  }
}

export async function getNPSInvestmentStatus() {
  this.setState({
    show_loader: true
  })
  try {
    const res = await Api.get(`/api/nps/invest/status/v2`);

    const { result, status_code: status } = res.pfwresponse;
    this.setState({
      show_loader: false
    })

    if (status === 200) {
      storageService().setObject("nps_additional_details", result.registration_details);
      if (this.state.screen_name === 'npsPaymentStatus') {
        return result
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

  } else {
    this.setState({
      show_loader: true
    })

    let userKyc = storageService().getObject("user");
    let pan_number = userKyc.pan.meta_data.pan_number;

    this.checkMerge(pan_number)
  }
}

export async function checkMerge(pan_number) {
  this.setState({
    show_loader: true
  })

  try {
    const res = await Api.post(`/api/user/account/merge?pan_number=${pan_number.toUpperCase()}&verify_only=true`);

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      
    } else {
      switch (status) {
        case 402:
          this.accountMerge()
          break;
        default:
          toast(result.error || result.message || genericErrMsg);
          break;
      }
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    console.log(err);
    toast("something went wrong");
  }
}

export function openInBrowser(url) {
  nativeCallback({
      action: 'open_in_browser',
      message: {
          url: url
      }
  });
}

export function openInTabApp(data = {}) {
  nativeCallback({
      action: 'open_inapp_tab',
      message: {
          url: data.url || '',
          back_url: data.back_url || ''
      }
  });
}

///api/invest/folio/import/image
export async function uploadDocs(file) {
  this.setState({
    show_loader: true
  })

  var uploadurl = '/api/invest/folio/import/image';
  const data = new FormData()
  data.append('res', file);
  data.append('doc_type', file.doc_type);

  try {
    const res = await Api.post(uploadurl, data);


    var resultData = res.pfwresponse.result || {};
    if (res.pfwresponse.status_code === 200 && resultData.message) {

      if (this.state.screen_name === 'nps-identity') {
        return res.pfwresponse
      } else {
        this.navigate('success');
      }

    } else {

      this.setState({
        show_loader: false
      });

      toast(resultData.error || 'Something went wrong');
    }
  } catch (err) {
    console.log(err);
    this.setState({
      show_loader: false
    });
    toast('Something went wrong');
  }
}