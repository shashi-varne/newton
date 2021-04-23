import './Amount.scss';
import React, { useState } from "react";
import Container from "../../../common/Container";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { investRedeemData } from "../../constants";
import {
  getGoalRecommendation,
  navigate as navigateFunc,
} from "../../common/commonFunctions";
import { convertInrAmountToNumber, formatAmountInr } from "../../../../utils/validators";
import useFunnelDataHook from "../../common/funnelDataHook";

const InvestAmount = (props) => {
  const navigate = navigateFunc.bind(props);

  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const sipOrOnetime = funnelData.investTypeDisplay;
  const tags = investRedeemData.tagsMapper[sipOrOnetime];
  const [amount, setAmount] = useState(
    funnelData.userEnteredAmt ||
    (sipOrOnetime === "sip" ? 5000 : 50000)
  );
  const [amountError, setAmountError] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleClick = () => {
    setShowLoader("button");
    const recommendations = {
      recommendation: [{
        ...funnelData.recommendation[0],
        amount
      }],
      // eslint-disable-next-line
      userEnteredAmt: parseInt(amount),
    };
    updateFunnelData(recommendations);
    navigate('recommendations');
  };

  const handleChange = () => (event) => {
    let value = event.target.value;
    value = convertInrAmountToNumber(value);
    // eslint-disable-next-line
    if (!isNaN(parseInt(value))) {
      // eslint-disable-next-line
      setAmount(parseInt(value));
      validateAmount(amount);
    } else {
      setAmount("");
      setAmountError("This is required");
    }
  };

  const updateAmount = (value) => {
    let data = amount;
    if (!data) data = value;
    else data += value;
    validateAmount(data);
    setAmount(data);
  };

  const validateAmount = (value) => {
    let goal = getGoalRecommendation();
    let max = 0;
    let min = 0;
    if (sipOrOnetime === "sip") {
      max = goal.max_sip_amount;
      min = goal.min_sip_amount;
    } else {
      max = goal.max_ot_amount;
      min = goal.min_ot_amount;
    }
    let amount_error = "";
    if (value > max) {
      amount_error =
        "Investment amount cannot be more than " + formatAmountInr(max);
    } else if (value < min) {
      amount_error = "Minimum amount should be atleast " + formatAmountInr(min);
    } else {
      amount_error = "";
    }
    setAmountError(amount_error);
  };

  return (
    <Container
      showLoader={showLoader}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      disable={amountError ? true : false}
      title="How would you like to invest?"
      count="2"
      current="2"
      total="2"
    >
      <div className="insta-redeem-invest-amount">
        <FormControl className="form-field">
          <InputLabel htmlFor="standard-adornment-password">
            Enter amount
          </InputLabel>
          <Input
            id="amount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amount ? formatAmountInr(amount) : ""}
            error={amountError ? true : false}
            onChange={handleChange("amount")}
            autoFocus
            endAdornment={
              sipOrOnetime === "sip" && (
                <InputAdornment position="end">per month</InputAdornment>
              )
            }
          />
          {amountError && (
            <div
              className="helper-text"
              style={{
                color: amountError && "red",
              }}
            >
              {amountError}
            </div>
          )}
        </FormControl>
        <div className="tags">
          {tags &&
            tags.map((data, index) => {
              return (
                <div
                  key={index}
                  className="tag"
                  onClick={() => updateAmount(data.value)}
                >
                  +{data.name}
                </div>
              );
            })}
        </div>
      </div>
    </Container>
  );
};

export default InvestAmount;
