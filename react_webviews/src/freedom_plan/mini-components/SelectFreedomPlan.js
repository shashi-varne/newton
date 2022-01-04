import React, { useMemo } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig } from "../../utils/functions";
import { formatAmountInr } from "../../utils/validators";
import { FREEDOM_PLANS } from "../common/constants";
import "./mini-components.scss";
import noop from "lodash/noop";

const SelectFreedomPlan = ({
  isOpen = false,
  selectedPlan,
  onChange = noop,
  onClick = noop,
}) => {
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Select a plan that’s right for you"
      subtitle="Enjoy brokerage free unlimited trading"
      button1Props={{
        title: "BUY NOW",
        variant: "contained",
        onClick: onClick,
      }}
    >
      <div className="select-freedom-plan">
        <div className="select-freedom-plan-container">
          {FREEDOM_PLANS.map((data, index) => (
            <Plan
              key={index}
              {...data}
              onChange={onChange}
              isSelected={data.value === selectedPlan}
            />
          ))}
        </div>
        <div className="helper-note">*GST at 18% would apply</div>
      </div>
    </WVBottomSheet>
  );
};

const Plan = ({ name, amount, isSelected, isPopular, onChange }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <div
      className={`freedom-plan-option ${isSelected && `selected-plan`}`}
      onClick={onChange}
    >
      {isSelected && (
        <Imgc
          src={require(`assets/${productName}/completed.svg`)}
          alt="completed"
          className="selected-icon"
        />
      )}
      {isPopular && <div className="fpo-popular">MOST POPULAR</div>}
      <div>{name}</div>
      <div className="fpo-amount">{formatAmountInr(amount)}</div>
    </div>
  );
};

export default SelectFreedomPlan;
