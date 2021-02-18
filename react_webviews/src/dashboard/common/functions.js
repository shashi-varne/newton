import Api from "utils/api";
import { storageService, isEmpty } from "utils/validators";
import toast from "common/ui/Toast";
import { getConfig } from "utils/functions";
import { isReadyToInvest, initData } from "../kyc/services";

export async function initialize() {
  let isLoggedIn = storageService().get("currentUser");
  if (!isLoggedIn) {
    this.props.history.push({
      pathname: "login",
      search: getConfig().searchParams,
    });
  }

  this.getMyAccount = getMyAccount.bind(this);
  this.getNotifications = getNotifications.bind(this);
  this.navigate = navigate.bind(this);
  this.authenticate = authenticate.bind(this);
  this.exportTransactions = exportTransactions.bind(this);

  let currentUser = storageService().getObject("user") || {};
  let userKyc = storageService().getObject("kyc") || {};
  if (isEmpty(userKyc) || isEmpty(currentUser)) {
    await initData();
    currentUser = storageService().getObject("user") || {};
    userKyc = storageService().getObject("kyc") || {};
  }
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
        var pref = mandate.mandate_preference;
        var type = mandate.source_type;
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
      toast(result.message || result.error || "Something went wrong!");
    }
    this.setState({ showLoader: false });
  } catch (error) {
    console.log(error);
    toast("Something went wrong!");
    this.setState({ showLoader: false });
  }
}

export async function getNotifications() {
  this.setState({ showLoader: true, loaderMessage: "Please wait..." });
  try {
    const res = await Api.post(`/api/user/account/summary`, {
      campaign: ["user_campaign"],
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setState({ showLoader: false });
      let campSections = ["notification", "profile"];
      let notifications = filterCampaignTargetsBySection(
        campSections,
        result.data.campaign.user_campaign.data
      );
      this.setState({ notifications: notifications });
      storageService().set("campaign", notifications);
    } else {
      this.setState({ showLoader: false });
      toast(result.message || result.error || "Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
    toast("Something went wrong!");
  }
}

export function filterCampaignTargetsBySection(sections, notifications) {
  if (!notifications) {
    notifications = storageService().get("campaign") || [];
  }

  let notificationsData = [];

  for (let i = 0; i < notifications.length; i++) {
    if (
      notifications[i].notification_visual_data &&
      notifications[i].notification_visual_data.target
    ) {
      for (
        let j = 0;
        j < notifications[i].notification_visual_data.target.length;
        j++
      ) {
        let camTarget = notifications[i].notification_visual_data.target[j];
        if (sections.indexOf(camTarget.section) !== -1) {
          camTarget.campaign_name = notifications[i].campaign.name;
          notificationsData.push(camTarget);
          break;
        }
      }
    }
  }

  return notificationsData;
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
        toast(result.message || result.error || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      this.setState({ showLoader: false });
      toast("Something went wrong!");
    }
  }
}

export function getRedirectionUrlWebview(
  url,
  redirect_path,
  type,
  redirect_url
) {
  let webRedirectionUrl = url;
  let is_secure = storageService().get("is_secure");
  let plutus_redirect_url = window.location.href;
  if (redirect_path) {
    plutus_redirect_url += redirect_path;
  }
  plutus_redirect_url += "?is_secure=" + is_secure;
  plutus_redirect_url = encodeURIComponent(plutus_redirect_url);
  if (redirect_url) {
    webRedirectionUrl +=
      // eslint-disable-next-line
      (webRedirectionUrl.match(/[\?]/g) ? "&" : "?") +
      "generic_callback=true&redirect_url=" +
      plutus_redirect_url;
  } else {
    webRedirectionUrl +=
      // eslint-disable-next-line
      (webRedirectionUrl.match(/[\?]/g) ? "&" : "?") +
      "generic_callback=true&plutus_redirect_url=" +
      plutus_redirect_url;
  }

  if (type === "campaigns") {
    webRedirectionUrl += "&campaign_version=1";
  }

  return webRedirectionUrl;
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
      toast(result.message || result.error || "Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
    toast("Something went wrong!");
  }
}
