import toast from "../common/ui/Toast";
import { getKycAppStatus } from "../kyc/services";
import Api from "../utils/api";
import { getConfig } from "../utils/functions";
import { storageService } from "../utils/validators";
import { apiConstants } from "./Invest/constants";

export function isInvestRefferalRequired(partner_code) {
  if (partner_code === "ktb") {
    return true;
  }
  return false;
}

export async function proceedInvestment(data) {
  let userKyc = data.userKyc || storageService().getObject("kyc") || {};
  const kycJourneyStatus = getKycAppStatus(userKyc).status;
  let {
    sipOrOnetime,
    isSipDatesScreen,
    investmentEventData,
    body,
    paymentRedirectUrl,
    history,
    handleApiRunning,
    handleDialogStates,
  } = data;

  let isKycNeeded = false;
  if (
    (getConfig().partner.code === "bfdlmobile" && !data.isInvestJourney) ||
    data.isInvestJourney ||
    data.isSipDatesScreen
  ) {
    isKycNeeded = !canDoInvestment(userKyc);
  }

  if (isKycNeeded) {
    redirectToKyc(kycJourneyStatus, history);
    return;
  }

  if (sipOrOnetime === "sip" && !isSipDatesScreen) {
    storageService().setObject("investmentObjSipDates", body);
    navigation(history, "/sipdates");
  } else {
    if (!investmentEventData) {
      investmentEventData = storageService().getObject("mf_invest_data") || {};
    }
    handleApiRunning("button");
    try {
      const res = await Api.post(apiConstants.triggerInvestment, body);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        // eslint-disable-next-line
        let pgLink = result.investments[0].pg_link;
        pgLink +=
          // eslint-disable-next-line
          (pgLink.match(/[\?]/g) ? "&" : "?") +
          "redirect_url=" +
          paymentRedirectUrl +
          getConfig().searchParams;

        investmentEventData["payment_id"] = result.investments[0].id;
        storageService().setObject("mf_invest_data", investmentEventData);

        if (isSipDatesScreen) {
          this.setState({
            openSuccessDialog: true,
            investResponse: result,
            isApiRunning: false,
          });
          return;
        }
        if (getConfig().Web) {
          // handleIframe
          window.location.href = pgLink;
        } else {
          if (result.rta_enabled) {
            navigation(history, "/payment/options", {
              state: {
                pg_options: result.pg_options,
                consent_bank: result.consent_bank,
                investment_type: result.investments[0].order_type,
                remark: result.investments[0].remark_investment,
                investment_amount: result.investments[0].amount,
                redirect_url: paymentRedirectUrl,
              },
            });
          } else {
            navigation(history, "/kyc/journey");
          }
        }
      } else {
        let errorMessage = result.error || result.message || "Error";
        storageService().setObject("is_debit_enabled", result.is_debit_enabled);
        switch (status) {
          case 301:
            redirectToKyc(kycJourneyStatus, history);
            break;
          case 302:
            redirectToKyc(kycJourneyStatus, history);
            break;
          case 305:
            handleDialogStates("openPennyVerificationPending", true);
            break;
          default:
            handleDialogStates("openInvestError", true, errorMessage);
            break;
        }
      }
      handleApiRunning(false);
    } catch (error) {
      console.log(error);
      handleApiRunning(false);
      toast("Something went wrong!");
    }
  }
}

export function canDoInvestment(kyc) {
  if (kyc.kyc_allow_investment_status === "INVESTMENT_ALLOWED") {
    return true;
  }
  return false;
}

export function redirectToKyc(kycJourneyStatus, history) {
  if (kycJourneyStatus === "ground") {
    navigation(history, "/kyc/home");
  } else {
    navigation(history, "/kyc/journey");
  }
}

function navigation(history, pathname, data = {}) {
  history.push({
    pathname: pathname,
    search: getConfig().searchParams,
    state: data.state,
  });
}
