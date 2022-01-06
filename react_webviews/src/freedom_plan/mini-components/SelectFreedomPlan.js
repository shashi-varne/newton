import React, { useEffect, useMemo, useState } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig } from "../../utils/functions";
import { formatAmountInr } from "../../utils/validators";
import { FREEDOM_PLANS } from "../common/constants";
import "./mini-components.scss";
import noop from "lodash/noop";

const SelectFreedomPlan = ({
  isOpen = false,
  showLoader = false,
  freedomPlanData = {},
  onClick = noop,
  onClose = noop,
  getFreedomPlanData = noop,
}) => {
  const [plan, setPlan] = useState(freedomPlanData);
  const handlePlanChange = (value) => () => {
    setPlan(value);
  };

  useEffect(() => {
    if (isOpen) {
      setPlan(freedomPlanData);
    }
  }, [isOpen]);

  const handleClick = () => {
    if (plan.duration === freedomPlanData.duration && freedomPlanData.plan_id) {
      onClick();
    } else {
      getFreedomPlanData(
        {
          amount: plan.amount,
          duration: plan.duration,
        },
        onClick
      );
    }
  };

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select a plan that’s right for you"
      subtitle="Enjoy brokerage free unlimited trading"
      button1Props={{
        title: "BUY NOW",
        variant: "contained",
        onClick: handleClick,
        showLoader: showLoader,
      }}
    >
      <div className="select-freedom-plan">
        <div className="select-freedom-plan-container">
          {FREEDOM_PLANS.map((data, index) => (
            <Plan
              key={index}
              {...data}
              handlePlanChange={handlePlanChange(data)}
              isSelected={data.duration === plan.duration}
            />
          ))}
        </div>
        <div className="helper-note">*GST at 18% would apply</div>
      </div>
    </WVBottomSheet>
  );
};

const Plan = ({ name, amount, isSelected, isPopular, handlePlanChange }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <div
      className={`freedom-plan-option ${isSelected && `selected-plan`}`}
      onClick={handlePlanChange}
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
