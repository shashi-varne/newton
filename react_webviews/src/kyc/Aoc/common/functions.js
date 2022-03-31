import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getBasePath } from "../../../utils/functions";
import { storageService } from "../../../utils/validators";
import { AOC_STORAGE_CONSTANTS } from "./constants";
import { triggerAocPaymentDecision } from "../../common/api";
import { PATHNAME_MAPPER } from "../../constants";
import { isEquityEsignReady, isRetroMfIRUser } from "../../common/functions";

export const isEquityAocApplicable = (kyc) => {
  return kyc?.is_equity_aoc_applicable;
};

export const isAocPaymentSuccessOrNotApplicable = (kyc) => {
  return (
    kyc.equity_aoc_payment_status === "success" || !isEquityAocApplicable(kyc)
  );
};

export const validateAocPaymentAndRedirect = (
  kyc,
  navigate,
  skipSelectAccount
) => {
  if (isAocPaymentSuccessOrNotApplicable(kyc)) {
    if (isEquityEsignReady(kyc)) {
      navigate(PATHNAME_MAPPER.kycEsign);
    } else {
      navigate(PATHNAME_MAPPER.documentVerification);
    }
  } else if (!isRetroMfIRUser(kyc) && !skipSelectAccount) {
    navigate(PATHNAME_MAPPER.aocSelectAccount);
  } else {
    navigate(PATHNAME_MAPPER.aocPaymentSummary);
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
    setErrorData({
      showError: true,
      title2: err.message,
      handleClick1: retry,
    });
    setShowLoader(false);
  }
};
