import React from "react";
import { formatAmountInr, numDifferentiation } from "../../../utils/validators";
import Slider from "common/ui/Slider";

const CheckInvestment = ({ investData, handleChange, handleInvestData }) => {
  return (
    <div className="check-investment" data-aid='check-investment'>
      <p>Check what would you have made with mutual funds?</p>
      <label>Mode :</label>
      <div className="invest-type" data-aid='invest-type'>
        <div className="invest-type-button">
          <div className="text">Monthly(SIP)</div>
          <span
            className={`hollow-dot ${
              investData.investType === "sip" && "selected"
            }`}
            onClick={() => {
              if (investData.investType !== "sip")
                handleInvestData("investType", "sip");
            }}
          >
            <span className="dot"></span>
          </span>
        </div>
        <div className="invest-type-button">
          <div className="text">One-time</div>
          <span
            className={`hollow-dot ${
              investData.investType === "one-time" && "selected"
            }`}
            onClick={() => {
              if (investData.investType !== "one-time")
                handleInvestData("investType", "one-time");
            }}
          >
            <span className="dot"></span>
          </span>
        </div>
      </div>
      <div className="invested-slider-container" data-aid='invested-slider-container'>
        <div className="invested-slider-head">
          Invested Amount :{" "}
          <span>
            {formatAmountInr(investData.amount)}{" "}
            {investData.investType === "sip" && "Monthly"}
          </span>
        </div>
        <div className="invested-slider">
          <Slider
            value={investData.amount}
            min={investData.investType === "sip" ? 500 : 5000}
            max={investData.investType === "sip" ? 50000 : 500000}
            onChange={handleChange("amount")}
          />
        </div>
        <div className="invested-slider-range">
          <div className="invested-slider-left">
            {numDifferentiation(investData.investType === "sip" ? 500 : 5000)}
          </div>
          <div className="invested-slider-ratio-text">
            <span>Slide to change amount</span>
          </div>
          <div className="invested-slider-right">
            {numDifferentiation(
              investData.investType === "sip" ? 50000 : 500000
            )}
          </div>
        </div>
      </div>
      <div className="invested-slider-container" data-aid='invested-slider-time-container'>
        <div className="invested-slider-head">
          For :{" "}
          <span>
            {investData.time} Year{investData.time > 1 && "s"}
          </span>
        </div>
        <div className="invested-slider">
          <Slider
            value={investData.time}
            min={1}
            max={20}
            onChange={handleChange("time")}
          />
        </div>
        <div className="invested-slider-range">
          <div className="invested-slider-left">1 Y</div>
          <div className="invested-slider-ratio-text">
            <span>Slide to change time</span>
          </div>
          <div className="invested-slider-right">20 Y</div>
        </div>
      </div>
      <div className="report-result-tile" data-aid='report-result-tile'>
        You could have made : {formatAmountInr(investData.projectedValue)}
      </div>
    </div>
  );
};

export default CheckInvestment;
