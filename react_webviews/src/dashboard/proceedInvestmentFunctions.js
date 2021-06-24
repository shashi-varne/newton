import toast from "../common/ui/Toast";
import { getKycAppStatus } from "../kyc/services";
import Api from "../utils/api";
import { getConfig } from "../utils/functions";
import { storageService, isFunction } from "../utils/validators";
import { apiConstants } from "./Invest/constants";
const config = getConfig();
const partnerCode = config.partner_code;
/* eslint-disable */
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
    handleIsRedirectToPayment,
  } = data;

  let isKycNeeded = false;
  if (
    (partnerCode === "bfdlmobile" && !data.isInvestJourney) ||
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
    if(partnerCode) {
      storageService().set("partner", partnerCode)
    }
    try {
      const res = await Api.post(apiConstants.triggerInvestment, body);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        let pgLink = result.investments[0].pg_link;
        pgLink = `${pgLink}${pgLink.match(/[\?]/g) ? "&" : "?"}redirect_url=${paymentRedirectUrl}${partnerCode ? "&partner_code="+partnerCode : ""}`
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
        if (config.Web) {
          if (config.isIframe) {
            handleIframeInvest(pgLink, result, history, handleApiRunning);
          } else {
            window.location.href = pgLink;
            handleApiRunning(false);
          }
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
          handleApiRunning(false);
        }
      } else {
        if (isFunction(handleIsRedirectToPayment)) {
          handleIsRedirectToPayment(false);
        }
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
        handleApiRunning(false);
      }
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
  let _event = {
    event_name: "journey_details",
    properties: {
      journey: {
        name: "mf",
        trigger: "cta",
        journey_status: "incomplete",
        next_journey: "kyc",
      },
    },
  };
  // send event
  if (!config.Web) {
    window.callbackWeb.eventCallback(_event);
  } else if (config.isIframe) {
    var message = JSON.stringify(_event);
    window.callbackWeb.sendEvent(_event);
  }
  if (kycJourneyStatus === "ground") {
    navigation(history, "/kyc/home");
  } else {
    navigation(history, "/kyc/journey");
  }
}

function navigation(history, pathname, data = {}) {
  history.push({
    pathname: pathname,
    search: config.searchParams,
    state: data.state,
  });
}

export function handleIframeInvest(pgLink, result, history, handleApiRunning) {
  let popup_window = popupWindowCenter(900, 580, pgLink);
  handleApiRunning("page")
  pollProgress(600000, 5000, result.investments[0].id, popup_window).then(
    function (poll_data) {
      popup_window.close();
      if (poll_data.status === "success") {
        // Success
        navigation(
          history,
          `/page/callback/${result.investments[0].order_type}/${result.investments[0].amount}/success/success`
        );
      } else if (poll_data.status === "failed") {
        toast("Payment failed. Please try again");
        // Failed
      } else if (poll_data.status === "closed") {
        // Closed
        toast("Payment window closed. Please try again");
      }
      handleApiRunning(false);
    },
    function (err) {
      popup_window.close();
      handleApiRunning(false);
      console.log(err);
      if (err?.status === "timeout") {
        toast("Payment has been time out. Please try again");
      } else {
        toast("Something went wrong. Please try again.");
      }
    }
  );
}

function pollProgress(timeout, interval, id, popup_window) {
  const endTime = Number(new Date()) + (timeout || 3 * 1000 * 60);
  interval = interval || 1000;
  let checkCondition = async function (resolve, reject) {
    if (popup_window.closed) {
      resolve({ status: "closed" });
    } else {
      try {
        const res = await getInvestmentStatus(id);
        let { result, status_code } = res.pfwresponse;
        if (status_code === 200) {
          if (result.investment.status === "pg_success") {
            resolve({ status: "success" });
          } else if (result.investment.status === "pg_failed") {
            resolve({ status: "failed" });
          } else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
          } else {
            reject({ status: "timeout" });
          }
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }
  };
  return new Promise(checkCondition);
}

function popupWindowCenter(w, h, url) {
  let dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  let dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;
  let left = window.screen.width / 2 - w / 2 + dualScreenLeft;
  let top = window.screen.height / 2 - h / 2 + dualScreenTop;
  return window.open(
    url,
    "_blank",
    "width=" +
      w +
      ",height=" +
      h +
      ",resizable,scrollbars,status,top=" +
      top +
      ",left=" +
      left
  );
}

async function getInvestmentStatus(id) {
  const res = await Api.get(`/api/invest/${id}`);
  return res;
}
