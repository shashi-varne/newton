import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import {
  isEmpty,
  storageService,
  validateNumber,
  formatAmountInr,
} from "utils/validators";
import { getPathname, storageConstants } from "../constants";
import { initData } from "../services";
import { navigate as navigateFunc } from "../common/functions";
import Input from "common/ui/Input";
import { Checkbox } from "material-ui";
import { Imgc } from "common/ui/Imgc";

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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    initData();
  };

  const handleAmount = () => (event) => {
    let value = event.target ? event.target.value : event;
    if (!validateNumber(value) & value) return;
    let formData = { ...form_data };
    formData.amount = value;
    if (!value) formData.amount_error = "This is required";
    else if (value < investBody.min)
      formData.amount_error = `Minimum investment amount is ${investBody.min}`;
    else if (value % investBody.mul !== 0)
      formData.amount_error = `Amount should be multiple of ${investBody.mul}`;
    else if (value > investBody.max)
      formData.amount_error = `Maximum investment amount is ${investBody.max}`;
    else formData.amount_error = "";
    setFormData({ ...formData });
  };

  const handleClick = () => {
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
  };

  return (
    <Container
      hideInPageTitle={true}
      buttonTitle={title}
      handleClick={() => handleClick()}
      noFooter={isReadyToPayment}
      disable={
        termsCheck && schemeCheck && form_data.amount && !form_data.amount_error
          ? false
          : true
      }
    >
      <div className="reports-invest-more">
        {!isReadyToPayment && (
          <>
            <div className="text">I would like to invest</div>
            <Input
              error={form_data.amount_error ? true : false}
              helperText={
                form_data.amount_error || formatAmountInr(form_data.amount)
              }
              type="number"
              width="40"
              id="amount"
              name="amount"
              value={form_data.amount || ""}
              onChange={handleAmount()}
            />
            <div className="text margin">
              As {params.mode} in {investBody.mfname}
            </div>
            <div className="terms padding">
              <Checkbox
                className="checkbox"
                color="primary"
                checked={termsCheck}
                onChange={() => setTermsCheck(!termsCheck)}
              />
              <div>
                I have read and accepted the{" "}
                <a href="https://www.fisdom.com/terms/" target="_blank">
                  terms and conditions
                </a>
              </div>
            </div>
            <div className="terms">
              <Checkbox
                className="checkbox"
                color="primary"
                checked={schemeCheck}
                onChange={() => setSchemeCheck(!schemeCheck)}
              />
              <div>
                I have read and understood the{" "}
                <a
                  href="https://www.fisdom.com/scheme-offer-documents/"
                  target="_blank"
                >
                  scheme offer documents
                </a>
              </div>
            </div>
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
