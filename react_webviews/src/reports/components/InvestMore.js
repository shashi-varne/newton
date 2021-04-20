import React, { useState } from "react";
import Container from "../common/Container";
import { isEmpty, storageService, formatAmountInr, convertInrAmountToNumber } from "utils/validators";
import { getPathname, storageConstants } from "../constants";
import { navigate as navigateFunc } from "../common/functions";
import Input from "common/ui/Input";
import Checkbox from "common/ui/Checkbox";
import { Imgc } from "common/ui/Imgc";
import { proceedInvestment } from "../../dashboard/proceedInvestmentFunctions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import PennyVerificationPending from "../../dashboard/Invest/mini-components/PennyVerificationPending";
import InvestError from "../../dashboard/Invest/mini-components/InvestError";
import InvestReferralDialog from "../../dashboard/Invest/mini-components/InvestReferralDialog";

const InvestMore = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.mode) props.history.goBack();
  const state = props.location.state || {};
  if (isEmpty(state) || !state.recommendation) navigate(getPathname.reports);
  const investBody = JSON.parse(state.recommendation) || {};
  const sipOrOnetime = (params.mode || "").toLowerCase();
  let title = "INVEST";
  if (sipOrOnetime === "sip") title = "SELECT SIP DATE";
  const [termsCheck, setTermsCheck] = useState(false);
  const [schemeCheck, setSchemeCheck] = useState(false);
  const [isReadyToPayment, setIsReadyToPayment] = useState(false);
  const [form_data, setFormData] = useState({ amount: "", amount_error: "" });
  const { kyc: userKyc, isLoading } = useUserKycHook();
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPendind: false,
    openInvestError: false,
    openInvestReferral: false,
    errorMessage: "",
  });
  const [isApiRunning, setIsApiRunning] = useState(false);

  const handleAmount = () => (event) => {
    let value = event.target ? event.target.value : event;
    value = Number(convertInrAmountToNumber(value) || "");
    let formData = { ...form_data };
    formData.amount = value;
    if (!value) formData.amount_error = "This is required";
    else if (value < investBody.min)
      formData.amount_error = `Minimum investment amount is ${formatAmountInr(
        investBody.min
      )}`;
    else if (value % investBody.mul !== 0)
      formData.amount_error = `Amount should be multiple of ${formatAmountInr(
        investBody.mul
      )}`;
    else if (value > investBody.max)
      formData.amount_error = `Maximum investment amount is ${formatAmountInr(
        investBody.max
      )}`;
    else formData.amount_error = "";
    setFormData({ ...formData });
  };

  const handleClick = (investReferralData, isReferralGiven) => {
    setIsReadyToPayment(true);
    let investmentObj = {
      investment: {
        amount: form_data.amount,
        type: investBody.type,
        subtype: investBody.subtype,
        payment_type: "additional",
        allocations: [
          {
            mfname: investBody.mfname,
            mfid: investBody.mfid,
            amount: form_data.amount,
            default_date: investBody.default_date,
            sip_dates: investBody.sip_dates,
          },
        ],
      },
    };

    let paymentRedirectUrl = encodeURIComponent(
      `${window.location.origin}/page/callback/${sipOrOnetime}/${investmentObj.investment.amount}`
    );

    let investmentEventData = {
      amount: form_data.amount,
      investment_type: investBody.type,
      journey_name: "mf",
      investment_subtype: investBody.subtype,
    };

    storageService().setObject(
      storageConstants.MF_INVEST_DATA,
      investmentEventData
    );

    const body = {
      investment: investmentObj.investment,
    };

    if (isReferralGiven && investReferralData.code) {
      body.referral_code = investReferralData.code;
    }

    proceedInvestment({
      userKyc: userKyc,
      sipOrOnetime: sipOrOnetime,
      body: body,
      investmentEventData: investmentEventData,
      paymentRedirectUrl: paymentRedirectUrl,
      isSipDatesScreen: false,
      history: props.history,
      handleApiRunning: handleApiRunning,
      handleDialogStates: handleDialogStates,
      handleIsRedirectToPayment,
    });
  };

  const handleApiRunning = (result) => {
    setIsApiRunning(result);
  };

  const handleDialogStates = (key, value, errorMessage) => {
    let dialog_states = { ...dialogStates };
    dialog_states[key] = value;
    if (errorMessage) dialog_states["errorMessage"] = errorMessage;
    setDialogStates({ ...dialog_states });
    handleApiRunning(false);
  };

  const handleIsRedirectToPayment = (result) => {
    setIsReadyToPayment(result);
  };

  return (
    <Container
      hidePageTitle={true}
      buttonTitle={title}
      handleClick={() => handleClick()}
      noFooter={isReadyToPayment}
      disable={
        termsCheck && schemeCheck && form_data.amount && !form_data.amount_error
          ? false
          : true
      }
      showLoader={isApiRunning}
      skelton={isLoading}
    >
      <div className="reports-invest-more">
        {!isReadyToPayment && (
          <>
            <div className="text">I would like to invest</div>
            <Input
              error={form_data.amount_error ? true : false}
              helperText={form_data.amount_error || ""}
              type="text"
              width="40"
              id="amount"
              name="amount"
              value={formatAmountInr(form_data.amount) || ""}
              onChange={handleAmount()}
            />
            <div className="text margin">
              As {params.mode} in {investBody.mfname}
            </div>
            <div className="terms padding">
              <Checkbox
                class="checkbox"
                checked={termsCheck}
                handleChange={() => setTermsCheck(!termsCheck)}
              />
              <div>
                I have read and accepted the{" "}
                <a
                  href="https://www.fisdom.com/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </a>
              </div>
            </div>
            <div className="terms">
              <Checkbox
                class="checkbox"
                checked={schemeCheck}
                handleChange={() => setSchemeCheck(!schemeCheck)}
              />
              <div>
                I have read and understood the{" "}
                <a
                  href="https://www.fisdom.com/scheme-offer-documents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  scheme offer documents
                </a>
              </div>
            </div>
            <PennyVerificationPending
              isOpen={dialogStates.openPennyVerificationPendind}
              handleClick={() => navigate("/kyc/add-bank")}
            />
            <InvestError
              isOpen={dialogStates.openInvestError}
              errorMessage={dialogStates.errorMessage}
              handleClick={() => navigate("/invest")}
              close={() => handleDialogStates("openInvestError", false)}
            />
            <InvestReferralDialog
              isOpen={dialogStates.openInvestReferral}
              proceedInvestment={handleClick}
              close={() => handleDialogStates("openInvestReferral", false)}
            />
          </>
        )}
        {isReadyToPayment && (
          <div className="payment-redirect">
            <Imgc
              src={require(`assets/payment.png`)}
              alt="Redirecting to Payment Gateway"
              className="img"
            />
            <div className="payment-text">
              <h4>Redirecting to your bank...</h4>
              <p>
                This transaction is completely safe as it is handled by your
                bank.
              </p>
              <p>
                Money will be directly transferred to the mutual fund companies.
              </p>
              <p>Amount of purchase will be pre-filled on your banking page.</p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InvestMore;
