import './Amount.scss';
import React, { useState } from "react";
import Container from "../../../common/Container";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { flowName, investRedeemData } from "../../constants";
import {
  getGoalRecommendation,
} from "../../common/commonFunctions";
import { navigate as navigateFunc } from 'utils/functions'
import { convertInrAmountToNumber, formatAmountInr } from "../../../../utils/validators";
import useFunnelDataHook from "../../common/funnelDataHook";
import { nativeCallback } from '../../../../utils/native_callback';

const InvestAmount = (props) => {
  const navigate = navigateFunc.bind(props);

  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const sipOrOnetime = funnelData.investTypeDisplay;
  const tags = investRedeemData.tagsMapper[sipOrOnetime];
  const [amount, setAmount] = useState(
    funnelData.amount ||
    (sipOrOnetime === "sip" ? 5000 : 50000)
  );
  const [amountError, setAmountError] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const setIntAmount = (val) => {
    // function to set amount as integer everytime
    setAmount(parseInt(val, 10));
  }

  const handleClick = () => {
    setShowLoader("button");
    sendEvents('next')
    const recommendations = {
      recommendation: [{
        ...funnelData.recommendation[0],
        amount
      }],
      amount,
    };
    updateFunnelData(recommendations);
    navigate('/invest/recommendations');
  };
  
  const handleChange = () => (event) => {
    let value = event.target.value;
    value = convertInrAmountToNumber(value);
    if (!isNaN(value)) {
      setIntAmount(value);
      validateAmount(value);
    } else {
      setIntAmount(0);
      setAmountError("This is required");
    }
  };
  
  const updateAmount = (value) => {
    let data = amount;
    if (!data) data = value;
    else data += value;
    validateAmount(data);
    setIntAmount(data);
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

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": 'select invest amount',
        "flow": flowName['insta-redeem'],
        "amount_value": amount
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='how-would-you-like-to-invest-screen'
      showLoader={showLoader}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      disable={amountError ? true : false}
      title="How much would you like to invest?"
      count="2"
      current="2"
      total="2"
    >
      <div className="insta-redeem-invest-amount" data-aid='insta-redeem-invest-amount'>
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
              data-aid='helper-text'
              className="helper-text"
              style={{
                color: amountError && "red",
              }}
            >
              {amountError}
            </div>
          )}
        </FormControl>
        <div className="tags" data-aid='amt-tags'>
          {tags &&
            tags.map((data, index) => {
              return (
                <div
                  data-aid={`amount-tag-${data.value}`}
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
