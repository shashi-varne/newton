import Api from "utils/api";
import { storageService, isEmpty } from "utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { isReadyToInvest, initData } from "../../kyc/services";

const genericErrorMessage = "Something went wrong!";
export async function initializeComponentFunctions() {
  this.getMyAccount = getMyAccount.bind(this);
  this.navigate = navigateFunc.bind(this.props);
  this.authenticate = authenticate.bind(this);
  this.exportTransactions = exportTransactions.bind(this);
  await initData();
  const currentUser = storageService().getObject("user") || {};
  const userKyc = storageService().getObject("kyc") || {};
  this.setState({ currentUser, userKyc });
  if (this.onload) this.onload();
}

export async function getMyAccount() {
  this.setState({ showLoader: true });
  try {
    const res = await Api.get(`/api/iam/myaccount`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ showLoader: false });
      storageService().setObject(
        "capitalgain",
        result.tax_statement.capital_gains
      );
      storageService().setObject("elss", result.tax_statement.elss);
      storageService().setObject("bank_mandates", result.bank_mandates.banks);
      storageService().setObject("change_requests", result.change_requests);
      let mandate = result.mandate_source;
      let Capitalgain = "";
      if (
        result.tax_statement.capital_gains &&
        result.tax_statement.capital_gains.length
      ) {
        Capitalgain = true;
      }

      let investment80C = "";
      if (result.tax_statement.elss && result.tax_statement.elss.length) {
        investment80C = true;
      }
      let npsUpload =
        this.state.currentUser.nps_investment &&
        !result.nps_registration_details.registration_details
          .additional_details_status;
      storageService().setObject("nps_upload", npsUpload);
      let mandateRequired = result.razorpay_mandates.mandate_needed;
      if (mandateRequired) {
        let npsMandate = result.razorpay_mandates.mandates;
        let npsMandatePaymentLink =
          result.razorpay_mandates.pending_mandate_link;
        this.setState({
          nps_pending_mandate_link: npsMandatePaymentLink,
        });
        storageService().setObject("nps_mandates", npsMandate);
      } else {
        storageService().remove("nps_mandates");
      }

      let pendingMandate = {};
      if (mandate.prompt) {
        const pref = mandate.mandate_preference;
        const type = mandate.source_type;
        if (pref === null && type === "fresh") {
          pendingMandate = {
            show_status: true,
            message: "Create Mandate(OTM) Now",
            state: "otm-options",
            page: "myaccount",
            pref: type,
          };
        } else if (pref === "aadhaar" && type === "fresh") {
          pendingMandate = {
            show_status: true,
            message: "Authenticate E-mandate (Aadhaar based)",
            state: "otm-options",
            type: "aadhaar",
            page: "myaccount",
            pref: pref + "_" + type,
          };
        } else if (pref === "aadhaar" && type === "reject") {
          pendingMandate = {
            show_status: true,
            message: "E-Mandate rejected (Create New)",
            state: "otm-options",
            type: "aadhaar",
            page: "myaccount",
            pref: pref + "_" + type,
          };
        } else if (pref === "aadhaar" && type === "exhaust") {
          pendingMandate = {
            show_status: true,
            message: "Recreate Mandate (limit exceeded)",
            state: "new-mandate",
            page: "new-mandate",
            pref: pref + "_" + type,
          };
        } else if (pref === "electronic" && type === "fresh") {
          pendingMandate = {
            show_status: true,
            message: "Signature pending (Sign on OTM)",
            state: "otm-options",
            type: "electronic",
            page: "myaccount",
            pref: pref + "_" + type,
          };
        } else if (pref === "electronic" && type === "reject") {
          pendingMandate = {
            show_status: true,
            message: "Signature rejected (Sign again on OTM)",
            state: "otm-options",
            type: "electronic",
            page: "myaccount",
            pref: pref + "_" + type,
          };
        } else if (pref === "electronic" && type === "exhaust") {
          pendingMandate = {
            show_status: true,
            message: "Create new Mandate (limit exceeded)",
            state: "new-mandate",
            page: "new-mandate",
            pref: pref + "_" + type,
          };
        } else {
          pendingMandate = { show_status: false };
        }
        storageService.setObject("pending_mandate", pendingMandate);
      }

      let isReadyToInvestBase = isReadyToInvest();
      this.setState({
        pendingMandate: pendingMandate,
        mandate: mandate,
        mandateRequired: mandateRequired,
        npsUpload: npsUpload,
        investment80C: investment80C,
        Capitalgain: Capitalgain,
        isReadyToInvestBase,
      });
    } else {
      toast(result.message || result.error || genericErrorMessage);
    }
    this.setState({ showLoader: false });
  } catch (error) {
    console.log(error);
    toast(genericErrorMessage);
    this.setState({ showLoader: false });
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
      state: data.state || {},
    });
  }
}

export async function authenticate() {
  this.setState({ showLoader: true, loadingMessage: "Please wait..." });
  if (this.state.npsMandatePaymentLink !== "") {
    window.location.href = this.state.npsMandatePaymentLink;
  } else {
    this.setState({ showLoader: true, loadingMessage: "Please wait..." });
    try {
      const res = await Api.post(`/api/nps/invest/mandate/requestmandate`, {
        amount: 50000,
      });
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        this.setState({ showLoader: false });
        let paymentRedirectUrl = encodeURIComponent(
          window.location.href + "nps/mandate/callback"
        );
        let pgLink = result.payment_link;
        pgLink +=
          // eslint-disable-next-line
          (pgLink.match(/[\?]/g) ? "&" : "?") +
          "plutus_redirect_url=" +
          paymentRedirectUrl;
        window.location.href = pgLink;
      } else {
        this.setState({ showLoader: false });
        toast(result.message || result.error || genericErrorMessage);
      }
    } catch (error) {
      console.log(error);
      this.setState({ showLoader: false });
      toast(genericErrorMessage);
    }
  }
}

export async function exportTransactions() {
  this.setState({ showLoader: true });
  try {
    const res = await Api.get(`/api/rta/mine/getaccountsummary`);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({
        showLoader: false,
        openDialog: true,
        buttonTitle1: "Got it!",
        twoButton: false,
        subtitle:
          "Your tax statement has been generated and sent to your registered email.",
      });
    } else {
      this.setState({ showLoader: false });
      toast(result.message || result.error || genericErrorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
    toast(genericErrorMessage);
  }
}

export async function sendInvestmentProof(data) {
  const res = await Api.get(`/api/invest/${data.statement}?year=${data.year}`);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    return result;
  } else {
    throw new Error(result.error || result.message || genericErrorMessage);
  }
}

export const upload = async (file) => {
  const formData = new FormData();
  formData.set("res", file);
  const res = await Api.post(`/api/mandate/blank/signed/upload`, formData);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    return result;
  } else {
    throw new Error(result.error || result.message || genericErrorMessage);
  }
};
