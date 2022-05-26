import toast from "../common/ui/Toast";
import { PATHNAME_MAPPER } from "../kyc/constants";
import { getKycAppStatus } from "../kyc/services";
import Api from "../utils/api";
import { getConfig, popupWindowCenter, isTradingEnabled } from "../utils/functions";
import { storageService } from "../utils/validators";
import { apiConstants, kycStatusMapperInvest } from "./Invest/constants";
/* eslint-disable */
export function isInvestRefferalRequired(partner_code) {
  if (["ktb", "tmb"].includes(partner_code)) {
    return true;
  }
  return false;
}

export async function proceedInvestment(data) {
  const config = getConfig();
  const partnerCode = config.code;
  let userKyc = data.userKyc || storageService().getObject("kyc") || {};
  const kycJourneyStatus = getKycAppStatus(userKyc).status;
  let {
    sipOrOnetime,
    isSipDatesScreen,
    investmentEventData,
    body,
    paymentRedirectUrl,
    handleApiRunning,
    handleDialogStates,
    navigate
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
    redirectToKyc(userKyc, kycJourneyStatus, navigate);
    return;
  }

  if (sipOrOnetime === "sip" && !isSipDatesScreen) {
    storageService().setObject("investmentObjSipDates", body);
    navigate("/sipdates");
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
            handleIframeInvest(pgLink, result, navigate, handleApiRunning);
          } else {
            handleApiRunning("page");
            window.location.href = pgLink;
          }
        } else {
          if (result.rta_enabled) {
            navigate("/payment/options", {
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
            navigate("/kyc/journey", {
              state: { show_aadhaar: (userKyc.address.meta_data.nri || userKyc.kyc_type === "manual") ? false : true } 
            });
          }
          handleApiRunning(false);
        }
      } else {
        let errorMessage = result.error || result.message || "Error";
        storageService().setObject("is_debit_enabled", result.is_debit_enabled);
        switch (status) {
          case 301:
            redirectToKyc(userKyc, kycJourneyStatus, navigate);
            break;
          case 302:
            redirectToKyc(userKyc, kycJourneyStatus, navigate);
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

export function redirectToKyc(userKyc, kycJourneyStatus, navigate) {
  const config = getConfig();
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

  const kycStatusData = kycStatusMapperInvest[kycJourneyStatus];
  if (kycJourneyStatus === "ground_pan") {
    navigate("/kyc/journey", {
      state: { show_aadhaar: (userKyc.address.meta_data.is_nri || userKyc.kyc_type === "manual") ? false : true } 
    });
  } else if (!isTradingEnabled(userKyc) && kycJourneyStatus === "complete") {
    navigate(PATHNAME_MAPPER.kycEsignNsdl, {
      searchParams: `${getConfig().searchParams}&status=success`
    });
  } else if (kycStatusData?.nextState) {
    navigate(kycStatusData.nextState);
  } else {
    navigate("/kyc/journey");
  }
}

export function handleIframeInvest(pgLink, result, navigate, handleApiRunning) {
  let popup_window = popupWindowCenter(900, 580, pgLink);
  handleApiRunning("page")
  pollProgress(600000, 5000, result.investments[0].id, popup_window).then(
    function (poll_data) {
      popup_window.close();
      if (poll_data.status === "success") {
        // Success
        navigate(
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

async function getInvestmentStatus(id) {
  const res = await Api.get(`/api/invest/${id}`);
  return res;
}
