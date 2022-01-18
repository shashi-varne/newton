import React, { useEffect, useMemo, useState } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig } from "../../utils/functions";
import { formatAmountInr } from "../../utils/validators";
import { SkeltonRect } from "../../common/ui/Skelton";
import isEmpty from "lodash/isEmpty";
import noop from "lodash/noop";
import "./mini-components.scss";

const SelectFreedomPlan = ({
  isOpen = false,
  showLoader = true,
  freedomPlanData = {},
  freedomPlanList = [],
  onClick = noop,
  onClose = noop,
}) => {
  const [plan, setPlan] = useState(freedomPlanData);
  const [errorMessage, setErrorMessage] = useState("");
  const handlePlanChange = (value) => () => {
    if (!isEmpty(errorMessage)) {
      setErrorMessage("");
    }
    setPlan(value);
  };

  useEffect(() => {
    setPlan(freedomPlanData);
  }, [freedomPlanData]);

  useEffect(() => {
    if (isOpen) {
      setPlan(freedomPlanData);
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleClick = () => {
    if (isEmpty(plan)) {
      setErrorMessage("please choose a plan");
      return;
    }
    onClick(plan);
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
        disabled: showLoader,
      }}
      classes={{
        container: "select-freedom-plan"
      }}
    >
      <>
        <div className="select-freedom-plan-container">
          {showLoader || isEmpty(freedomPlanList) ? (
            <>
              <SkeltonRect className="sfpc-loader" />
              <SkeltonRect className="sfpc-loader" />
              <SkeltonRect className="sfpc-loader" />
            </>
          ) : (
            freedomPlanList.map((data, index) => (
              <Plan
                key={index}
                {...data}
                handlePlanChange={handlePlanChange(data)}
                isSelected={data.duration === plan.duration}
              />
            ))
          )}
        </div>
        {errorMessage && (
          <div className="helper-text error-message">{errorMessage}</div>
        )}
        <div className="helper-note">*GST at 18% would apply</div>
      </>
    </WVBottomSheet>
  );
};

const Plan = ({ name, amount, isSelected, is_popular, handlePlanChange }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <div
      className={`freedom-plan-option ${isSelected && `selected-plan`} ${is_popular && `popular-plan`}`}
      onClick={handlePlanChange}
    >
      {isSelected && (
        <Imgc
          src={require(`assets/${productName}/completed.svg`)}
          alt="completed"
          className="selected-icon"
        />
      )}
      {is_popular && <div className="fpo-popular">MOST POPULAR</div>}
      <div className="fpo-name">{name}</div>
      <div className="fpo-amount">{formatAmountInr(amount)}</div>
    </div>
  );
};

export default SelectFreedomPlan;
