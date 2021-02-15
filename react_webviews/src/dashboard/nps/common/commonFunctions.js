import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";
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

export function navigate(pathname, data, redirect) {
  if (redirect) {
    this.props.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
    });
  } else {
    this.props.history.push({
      pathname: `/nps/${pathname}`,
      search: data?.searchParams || getConfig().searchParams,
      state: { graphData: data },
    });
  }
}

export function formCheckUpdate(keys_to_check, form_data) {
  if (!form_data) {
    form_data = this.state.form_data;
  }

  let keysMapper = {
    pan: "pan",
    pran: "pran",
    dob: "dob",
    mobile_no: "mobile no.",
  };

  let selectTypeInput = [];

  for (var i = 0; i < keys_to_check.length; i++) {
    let key_check = keys_to_check[i];
    let first_error =
      selectTypeInput.indexOf(key_check) !== -1
        ? "Please select "
        : "Please enter ";
    if (!form_data[key_check]) {
      form_data[key_check + "_error"] = first_error + keysMapper[key_check];
    }
  }

  this.setState({
    form_data: form_data,
  });
}

export async function get_recommended_funds(params) {
  try {
    const res = await Api.get(`api/nps/invest/recommend?amount=50000`);
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
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
}

export async function kyc_submit(params) {
  try {
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
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
}

export async function nps_register(params, next_state) {
  try {
    this.setState({
      show_loader: true,
    });
    const res = await Api.post(`api/nps/register/update/v2?${params}`);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      this.navigate(next_state);
    } else {
      this.setState({
        show_loader: true,
      });
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    this.setState({
      show_loader: true,
    });
    throw err;
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
        if (result.user.is_doc_required) {
          this.navigate("upload");
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
    const res = await Api.post(`api/nps/invest/v2?app_version=1`, params);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;
    console.log(result);

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
}
