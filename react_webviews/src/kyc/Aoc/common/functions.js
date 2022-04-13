import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getBasePath } from "../../../utils/functions";
import { storageService } from "../../../utils/validators";
import { AOC_STORAGE_CONSTANTS } from "./constants";
import { triggerAocPaymentDecision } from "../../common/api";
import { PATHNAME_MAPPER } from "../../constants";
import { isEquityEsignReady, isRetroMfIRUser } from "../../common/functions";
import { nativeCallback } from "../../../utils/native_callback";

export const isEquityAocApplicable = (kyc) => {
  return kyc?.is_equity_aoc_applicable;
};

export const isAocPaymentSuccessful = (kyc) => {
  return kyc.equity_aoc_payment_status === "success";
};

export const isAocPaymentSkipped = (kyc) => {
  return kyc.equity_aoc_payment_status === "skipped";
};

export const isAocPaymentSuccessOrNotApplicable = (kyc) => {
  return isAocPaymentSuccessful(kyc) || !isEquityAocApplicable(kyc);
};

export const validateAocPaymentAndRedirect = (
  kyc,
  navigate,
  skipSelectAccount
) => {
  if (isAocPaymentSuccessOrNotApplicable(kyc)) {
    validateEquityEsignStatusAndRedirect(kyc, navigate);
  } else if (!isRetroMfIRUser(kyc) && !skipSelectAccount) {
    navigate(PATHNAME_MAPPER.aocSelectAccount);
  } else {
    navigate(PATHNAME_MAPPER.aocPaymentSummary);
  }
};

export const validateEquityEsignStatusAndRedirect = (kyc, navigate) => {
  if (isEquityEsignReady(kyc)) {
    navigate(PATHNAME_MAPPER.kycEsign);
  } else {
    navigate(PATHNAME_MAPPER.documentVerification);
  }
};

export const getAocData = (kyc) => {
  const accountOpeningData = get(
    kyc,
    "equity_account_charges_v2.account_opening",
    {}
  );
  const aocData = {
    amount: accountOpeningData?.base?.rupees,
    totalAmount: accountOpeningData.total?.rupees,
    gst: accountOpeningData.gst?.rupees,
    gstPercentage: accountOpeningData.gst?.percentage || "",
  };

  return aocData;
};

export const triggerAocPayment = async ({
  setErrorData,
  setShowLoader,
  config,
  updateKyc,
}) => {
  try {
    setShowLoader("button");
    const redirectUrl = encodeURIComponent(
      `${getBasePath()}${PATHNAME_MAPPER.aocPaymentStatus}${
        config.searchParams
      }`
    );
    const result = await triggerAocPaymentDecision({
      status: "accept",
      redirectUrl,
    });
    if (!isEmpty(result.kyc)) {
      updateKyc(result.kyc);
    }
    if (!isEmpty(result.equity_payment_details)) {
      storageService().setObject(
        AOC_STORAGE_CONSTANTS.AOC_PAYMENT_DATA,
        result.equity_payment_details
      );
    }
    const backUrl = window.location.href;
    if (!config.isWebOrSdk) {
      const data = {
        url: backUrl,
        message: "You are almost there, do you really want to go back?",
      };
      if (config.iOS) {
        nativeCallback({
          action: "show_top_bar",
          message: { title: "Payment" },
        });
      }
      nativeCallback({ action: "take_control", message: data });
    } else if (config.isSdk) {
      const redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "You are almost there, do you really want to go back?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: encodeURIComponent(backUrl),
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "server",
        },
      };
      if (config.iOS) {
        redirectData.show_toolbar = true;
      }
      nativeCallback({ action: "third_party_redirect", message: redirectData });
    }
    setShowLoader("page");
    window.location.href = result.payment_link;
  } catch (err) {
    const retry = () => {
      setErrorData({});
      triggerAocPayment({
        setErrorData,
        setShowLoader,
        config,
        updateKyc,
      });
    };
    const resetErrorData = () => {
      setErrorData({})
    }
    setErrorData({
      showError: true,
      title2: err.message,
      handleClick1: retry,
      setErrorData: resetErrorData,
    });
    setShowLoader(false);
  }
};
