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
  this.getInstitutionList = getInstitutionList.bind(this);
  this.getIndustryList = getIndustryList.bind(this);
  this.get05Callback = get05Callback.bind(this);
  this.get10Callback = get10Callback.bind(this);
  this.get07State = get07State.bind(this);

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
      count: 0,
    }
    // () => {
    //   this.onload();
    // }
  );

  this.setState({
    show_loader: true,
  });

  let screens = [
    "calculator",
    "know_more_screen",
    "landing_screen",
    "loan_status",
  ];

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

  if (this.state.screen_name === "loan_status") {
    this.getUserStatus();
  }
}

export async function getInstitutionList() {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get("relay/api/loan/idfc/perfios/institutionlist");

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      let banklist = result.data;
      let bankOptions = [];

      if (this.state.screen_name === "bank_upload") {
        bankOptions = banklist.map((item) => {
          return { name: item.institution_name, value: item.institution_id };
        });
      } else {
        bankOptions = banklist.map((item) => item.institution_name);
      }

      this.setState({
        bankOptions: bankOptions,
      });
    } else {
      toast(result.error || result.message || "Something went wrong!");
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }
}

export async function getIndustryList() {
  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get("relay/api/loan/idfc/list/industry");

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      let industryOptions = result.data;

      this.setState({
        industryOptions: industryOptions,
      });
    } else {
      toast(result.error || result.message || "Something went wrong!");
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
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
    const { result } = res.pfwresponse;

    this.setState(
      {
        docList: result.doc_list,
      },
      () => {
        this.onload();
      }
    );
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
      perfios_info: true
    };

    let lead = {};

    const res = await Api.post("relay/api/loan/get/application/idfc", body);
    const { result, status_code: status } = res.pfwresponse;

    lead = result || {};

    if (status === 200) {
      let application_id = result.application_id || "";
      storageService().set("loan_application_id", application_id);
      let { application_status } = result.application_info;

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

      let screens = ["landing_screen", "calculator", "know_more_screen"];
      if (screens.indexOf(this.state.screen_name) !== -1) {
        this.navigate(this.state.next_state);
      }

      if (params && params.reset) {
        this.navigate("home");
      }

      if (application_status === "internally_rejected") {
        this.navigate("loan-status");
      }

      if (
        this.state.screen_name === "loan_bt" ||
        this.state.screen_name === "credit_bt" ||
        this.state.screen_name === "bank_upload"
      ) {
        this.getInstitutionList();
      }

      if (this.state.screen_name === "document_list") {
        await this.getDocumentList();
      }

      if (this.state.screen_name === "document_upload") {
        await this.getDocumentList();
      }

      if (this.state.screen_name === "professional_details_screen") {
        this.getIndustryList();
      }
    } else {
      toast(result.error || result.message || "Something went wrong!");
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  this.setState({
    show_loader: false,
  });
}

export async function getUserStatus(state = "") {
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

      let screens = [
        "requirement_details_screen",
        "journey_screen",
        "perfios_state",
        "bt_info_screen",
        "credit_bt",
      ];

      if (screens.indexOf(this.state.screen_name) !== -1) {
        return result;
      }
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

export async function updateApplication(params, next_state = "") {
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

      if (params.idfc_loan_status === "bt_bypass") {
        await this.get07State();
      } else if (params.idfc_loan_status === "ckyc") {
        this.navigate("personal-details");
      } else {
        this.navigate(next_state || this.state.next_state);
      }
    } else {
      if (typeof result.error === "string") {
        this.setState({
          show_loader: false,
        });
        toast(result.error || result.message || "Something went wrong!");
      } else {
        this.setState({
          show_loader: false,
        });
        toast(result.error[0] || result.message || "Something went wrong!");
      }
    }
  } catch (err) {
    console.log(err);
    this.setState({
      show_loader: false,
    });
    toast("Something went wrong");
  }
}

export async function get05Callback() {
  this.setState({
    show_loader: true,
  });

  // setTimeout(, 3000)
  let result = await this.getUserStatus();
  let { count } = this.state;
  let that = this;

  setTimeout(function () {
    if (
      result.is_dedupe === true ||
      result.idfc_05_callback === true ||
      result.vendor_application_status === "idfc_callback_rejected"
    ) {
      that.navigate("loan-status");
    } else {
      if (count < 20) {
        that.setState({
          count: count + 1,
        });

        that.get05Callback();
      } else {
        that.navigate("error");
      }
    }
  }, 3000);
}

export async function get10Callback(next_state) {
  this.setState({
    show_loader: true,
  });

  // setTimeout(, 3000)
  let result = await this.getUserStatus();
  let { count } = this.state;
  let that = this;

  setTimeout(function () {
    if (result.idfc_10_callback) {
      that.navigate("eligible-loan");
    } else if (
      result.vendor_application_status === "idfc_cancelled" ||
      result.is_cancelled === true
    ) {
      that.navigate("loan-status");
    } else if (count < 20) {
      that.setState({
        count: count + 1,
      });

      that.get10Callback(next_state);
    } else {
      that.navigate("error");
    }
  }, 3000);
}

export async function get07State() {
  this.setState({
    show_loader: true,
  });

  // setTimeout(, 3000)
  let result = await this.getUserStatus();
  let { count } = this.state;
  let that = this;

  setTimeout(function () {
    if (result.perfios_status === "bypass") {
      that.submitApplication({}, "one", "", "eligible-loan");
    } else if (result.idfc_07_state === "failed") {
      that.navigate('error')
    } else if (result.idfc_07_state === "triggered" && result.bt_eligible) {
      let body = {
        idfc_loan_status: "bt_init",
      };
      that.updateApplication(body, "bt-info");
    } else if (result.idfc_07_state === "success" && !result.bt_eligible) {
      that.submitApplication({}, "one", "", "eligible-loan");
    } else {
      if (count < 20) {
        that.setState({
          count: count + 1,
        });

        that.get07State();
      } else {
        that.navigate("error");
      }
    }
  }, 3000);
}

export async function submitApplication(
  params,
  state,
  update = "",
  next_state = ""
) {
  try {
    this.setState({
      show_loader: true,
    });

    let screens = [
      "address_details",
      "requirement_details_screen",
      "additional_details",
      "credit_bt",
      "eligible_loan",
      "bank_upload",
    ];
    this.setState({
      show_loader: true,
      loaderWithData: screens.includes(this.state.screen_name),
    });
    const res = await Api.post(
      `relay/api/loan/submit/application/idfc/${
        this.state.application_id
      }?state=${state}${update && "&update=" + update}`,
      params
    );

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      if (result.message === "Success") {
        if (state === "point_five") {
          this.get05Callback();
        } else if (state === "one") {
          this.get10Callback(next_state);
        } else {
          this.navigate(next_state || this.state.next_state);
        }
      }
    } else {
      let rejection_cases = [
        "CreateLoan null API Failed",
        "CreateLoan 05 API Failed",
        "CreateLoan 10 API Failed",
        "CreateLoan 11 API Failed",
        "CreateLoan 17 API Failed",
        "CreateLoan 3 API Failed",
        "CreateLoan 4 API Failed",
        "Age",
        "Salary",
        "Salary receipt mode",
      ];
      if (
        typeof result.error === "string" &&
        rejection_cases.indexOf(result.error) === -1
      ) {
        this.setState({
          show_loader: false,
        });
        toast(result.error || result.message || "Something went wrong!");
      } else if (
        typeof result.error === "string" &&
        rejection_cases.indexOf(result.error) !== -1
      ) {
        this.navigate("loan-status");
      } else {
        this.setState({
          show_loader: false,
        });
        toast(result.error[0] || result.message || "Something went wrong!");
      }
    }
  } catch (err) {
    console.log(err);
    this.setState({
      show_loader: false,
    });
    toast("Something went wrong");
  }

  // this.setState({
  //   show_loader: false,
  // });
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
    amount_required: "loan amount",
    purpose: "purpose",
    tenor: "tenor",
    office_address: "office address",
    pincode: "pincode",
    city: "city",
    mailing_address_preference: "mailing address preference",
  };

  let selectTypeInput = [
    "educational_qualification",
    "gender",
    "marital_status",
    "religion",
  ];

  for (var i = 0; i < keys_to_check.length; i++) {
    let key_check = keys_to_check[i];
    let first_error =
      selectTypeInput.indexOf(key_check) !== -1
        ? "Please select "
        : "Please enter ";
    if (!form_data[key_check] && key_check !== "middle_name") {
      form_data[key_check + "_error"] = first_error + keysMapper[key_check];
      canSubmitForm = false;
    }
  }

  if (form_data.pan_no && !validatePan(form_data.pan_no)) {
    form_data.pan_no_error = "Invalid PAN number";
    canSubmitForm = false;
  }

  if (form_data.maxAmount && form_data.amount_required > form_data.maxAmount) {
    form_data.amount_required_error =
      "amount cannot be greater than max loan amount";
    canSubmitForm = false;
  }

  // eslint-disable-next-line
  if (form_data.amount_required && parseInt(form_data.amount_required) < parseInt("100000")) {
    form_data.amount_required_error = "Minimum loan amount should be ₹1 lakh";
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
  let plutus_redirect_url = encodeURIComponent(
    window.location.origin +
      `/loan/idfc/perfios-status` +
      getConfig().searchParams
  );

  var pgLink = url;

  pgLink +=
    // eslint-disable-next-line
    (pgLink.match(/[\?]/g) ? "&" : "?") +
    "plutus_redirect_url=" +
    plutus_redirect_url;
  window.location.href = pgLink;
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
      // toast(result.error || result.message || "Something went wrong!");
      // this.onload();
      this.navigate("perfios-status");
    }
  } catch (err) {
    console.log(err);
    toast("Something went wrong");
  }

  // this.setState({
  //   show_loader: false,
  // });
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
