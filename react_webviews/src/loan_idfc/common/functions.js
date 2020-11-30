import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import toast from "../../common/ui/Toast";
import { openPdfCall } from "utils/native_callback";
import { nativeCallback } from "utils/native_callback";
import { idfc_config } from "../constants";
import {
  validatePan,
  isValidDate,
  getEditTitle,
  IsFutureDate,
} from "utils/validators";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.openPdf = openPdf.bind(this);
  this.openInBrowser = openInBrowser.bind(this);
  this.openInTabApp = openInTabApp.bind(this);
  this.formCheckUpdate = formCheckUpdate.bind(this);
  this.updateApplication = updateApplication.bind(this);
  this.submitApplication = submitApplication.bind(this);
  this.getOrCreate = getOrCreate.bind(this);
  this.getUserStatus = getUserStatus.bind(this);
  this.startTransaction = startTransaction.bind(this);
  this.netBanking = netBanking.bind(this);
  this.setEditTitle = setEditTitle.bind(this);
  this.getDocumentList = getDocumentList.bind(this);

  let screenData = {};
  if (this.state.screen_name) {
    screenData = idfc_config[this.state.screen_name];
  }

  let next_screen = this.state.next_screen || "";
  if (this.state.screen_name && idfc_config.get_next[this.state.screen_name]) {
    next_screen = idfc_config.get_next[this.state.screen_name];
    this.setState({
      next_state: next_screen,
    });
  }

  nativeCallback({ action: "take_control_reset" });

  this.setState(
    {
      screenData: screenData,
      productName: getConfig().productName,
    },
    () => {
      this.onload();
    }
  );

  this.setState({
    show_loader: true,
  });

  let screens = ["calculator", "know_more_screen", "landing_screen"];

  if (!screens.includes(this.state.screen_name)) {
    this.getOrCreate();
  } else {
    this.setState({
      show_loader: false,
    });
  }

  if (this.state.screen_name === "landing_screen") {
    this.getUserStatus();
  }
}

export async function getDocumentList() {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get(
      `relay/api/loan/idfc/list/document/${this.state.application_id}`
    );
    // const { result, status_code: status } = res.pfwresponse;

    console.log(res);
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
}

export async function getOrCreate(params) {
  try {
    this.setState({
      show_loader: true,
    });

    let body = {
      create_new: (params && params.create_new) || false,
      reset_application: (params && params.reset) || false,
      application_info: true,
      personal_info: true,
      professional_info: true,
      address_info: true,
      bank_info: true,
      document_info: true,
      vendor_info: true,
      bt_info: true,
    };

    let lead = {};

    const res = await Api.post("relay/api/loan/get/application/idfc", body);
    const { result, status_code: status } = res.pfwresponse;

    lead = result || {};

    if (status === 200) {
      let application_id = result.application_id || "";
      storageService().set("loan_application_id", application_id);

      this.setState(
        {
          lead: lead,
          application_id: application_id,
          mobile_no: result.personal_info.mobile_no || "",
        },
        () => {
          if (this.onload && !this.state.ctaWithProvider) {
            this.onload();
          }
        }
      );

      if (this.state.screen_name === "landing_screen") {
        this.navigate(this.state.next_state);
      }

      if (this.state.screen_name === "document_list") {
        this.getDocumentList();
      }
    } else {
      toast(result.error || result.message || "Something went wrong!");
      // this.onload();
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
}

export async function getUserStatus() {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get("relay/api/loan/user/status/idfc");

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      this.setState({
        ...(result || {}),
      });
    } else {
      toast(result.error || result.message || "Something went wrong!");
      this.onload();
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState(
    {
      show_loader: false,
    },
    () => {
      this.onload();
    }
  );
}

export function setEditTitle(string) {
  if (this.props.edit) {
    return getEditTitle(string);
  }

  return string;
}

export async function updateApplication(params) {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.post(
      `relay/api/loan/update/application/idfc/${this.state.application_id}`,
      params
    );

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      this.setState({
        ...(result || ""),
      });

      if (this.state.screen_name === "mobile_verification") {
        this.navigate(this.state.next_state, {
          params: {
            ...(result || ""),
          },
        });
      }
      if (params.idfc_loan_status === "ckyc") {
        this.navigate("personal-details");
      } else {
        this.navigate(this.state.next_state);
      }
    } else {
      toast(result.error || result.message || "Something went wrong!");
      this.onload();
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
}

export async function submitApplication(params, state, update) {
  try {
    let screens = ["address_details", "requirement_details_screen"];
    this.setState({
      loaderWithData: screens.includes(this.state.screen_name),
      show_loader: true,
    });
    const res = await Api.post(
      `relay/api/loan/submit/application/idfc/${this.state.application_id}?state=${state}&update=${update}`,
      params
    );

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      if (result.message === "Success") {
        this.navigate(this.state.next_state);
      }
    } else {
      // if (this.state.screen_name === "professional_details_screen") {
      //   this.navigate("application-status");
      // } else {

      this.navigate("loan-status");
      // toast(result.error || result.message || "Something went wrong!");
      // this.onload();
      // }
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
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

export async function formCheckUpdate(
  keys_to_check,
  form_data,
  state = "",
  update = ""
) {
  if (!form_data) {
    form_data = this.state.form_data;
  }

  let canSubmitForm = true;

  let keysMapper = {
    dob: "dob",
    pan_no: "pan number",
    employment_type: "employment type",
    educational_qualification: "educational qualification",
    first_name: "first name",
    middle_name: "middle name",
    last_name: "last name",
    gender: "gender",
    marital_status: "marital status",
    father_name: "father name",
    mother_name: "mother name",
    religion: "religion",
    email_id: "email id",
    company_name: "company name",
    business_name: "business name",
    office_email: "office email",
    net_monthly_salary: "net monthly salary",
    salary_mode: "salary receipt mode",
    constitution: "constitution",
    organisation: "organisation",
    department: "department",
    industry: "industry",
    current_address1: "address line 1",
    current_address2: "address line 2",
    current_address3: "address line 3",
    current_landmark: "landmark",
    current_pincode: "pincode",
    current_city: "city",
    current_state: "state",
    permanent_address1: "address line 1",
    permanent_address2: "address line 2",
    permanent_address3: "address line 3",
    permanent_landmark: "landmark",
    permanent_pincode: "pincode",
    permanent_city: "city",
    permanent_state: "state",
    amount_reuired: "loan amount",
    office_address: "office address",
    pincode: "pincode",
    city: "city",
    mailing_address_preference: "mailing address preference",
  };

  let selectTypeInput = ["educational_qualification"];

  for (var i = 0; i < keys_to_check.length; i++) {
    let key_check = keys_to_check[i];
    let first_error =
      selectTypeInput.indexOf(key_check) !== -1
        ? "Please select "
        : "Please enter ";
    if (!form_data[key_check]) {
      form_data[key_check + "_error"] = first_error + keysMapper[key_check];
      canSubmitForm = false;
    }
  }

  if (form_data.pan_no && !validatePan(form_data.pan_no)) {
    form_data.pan_no_error = "Invalid PAN number";
    canSubmitForm = false;
  }

  if (form_data.dob && !isValidDate(form_data.dob)) {
    form_data.dob_error = "Please enter valid dob";
    canSubmitForm = false;
  } else if (form_data.dob && IsFutureDate(form_data.dob)) {
    form_data.dob_error = "Future date is not allowed";
    canSubmitForm = false;
  }

  this.setState({
    form_data: form_data,
  });

  if (canSubmitForm) {
    let body = {};
    this.setState({
      show_loader: true,
    });

    for (var j in keys_to_check) {
      let key = keys_to_check[j];
      body[key] = form_data[key] || "";
    }

    if (state !== "") {
      this.submitApplication(body, state, update);
    } else {
      this.updateApplication(body);
    }
  }
}

export async function netBanking(url) {
  // let back_url =
  //   window.location.origin +
  //   `/loan/idfc/income-details` +
  //   getConfig().searchParams;

  // let redirectionUrl =
  //   window.location.origin + `/loan/idfc/bt-info` + getConfig().searchParams;

  // if (getConfig().web) {
  //   redirectionUrl = back_url;
  // }

  // var netBanking_link = url;

  // var pgLink = netBanking_link;

  // let app = getConfig().app;
  // // eslint-disable-next-line
  // pgLink +=
  //   (pgLink.match(/[\?]/g) ? "&" : "?") +
  //   "plutus_redirect_url=" +
  //   redirectionUrl +
  //   "&app=" +
  //   app +
  //   "&back_url=" +
  //   back_url;

  // if (getConfig().generic_callback) {
  //   pgLink += "&generic_callback=" + getConfig().generic_callback;
  // }
  // let paymentRedirectUrl = encodeURIComponent(
  //   window.location.origin +
  //     `/loan/idfc/income-details` +
  //     getConfig().searchParams
  // );

  // let back_url = encodeURIComponent(
  //   window.location.origin +
  //     `/loan/instant-kyc-status` +
  //     getConfig().searchParams +
  //     "&flow=kyc&okyc_id=" +
  //     this.state.application_id
  // );

  // // for web no issue
  // if (getConfig().Web) {
  //   paymentRedirectUrl = back_url;
  // }

  // var payment_link = url;
  // var pgLink = payment_link;
  // let app = getConfig().app;

  // // eslint-disable-next-line
  // pgLink +=
  //   (pgLink.match(/[\?]/g) ? "&" : "?") +
  //   "plutus_redirect_url=" +
  //   paymentRedirectUrl +
  //   "&app=" +
  //   app +
  //   "&back_url=" +
  //   back_url;
  // if (getConfig().generic_callback) {
  //   pgLink += "&generic_callback=" + getConfig().generic_callback;
  // }

  // this.openInTabApp({
  //   url: pgLink,
  //   back_url: back_url,
  // });
}

export async function startTransaction(transaction_type) {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get(
      `relay/api/loan/idfc/perfios/start/${this.state.application_id}?transaction_type=${transaction_type}`
    );

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      if (transaction_type === "manual_upload") {
        this.navigate("upload-bank");
      }

      if (transaction_type === "netbanking") {
        this.netBanking(result.netbanking_url || "");
      }
    } else {
      toast(result.error || result.message || "Something went wrong!");
      this.onload();
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
}

export function openPdf(url, type) {
  if (!url) {
    return;
  }
  this.sendEvents("tnc_clicked");
  if (!getConfig().Web) {
    this.setState({
      show_loader: true,
    });
  }

  let mapper = {
    tnc: {
      header_title: "Terms & Conditions",
    },
    read_document: {
      header_title: "Read Detailed Document",
    },
  };

  let mapper_data = mapper[type];

  let data = {
    url: url,
    header_title: mapper_data.header_title,
    icon: "close",
  };

  openPdfCall(data);
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
