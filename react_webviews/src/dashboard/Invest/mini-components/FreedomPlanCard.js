import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import WVButton from "../../../common/ui/Button/WVButton";
import { Imgc } from "../../../common/ui/Imgc";
import "./FreedomPlanCard.scss";

const FreedomPlanCard = (props) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <>
      <div className="card flex-between-center freedom-plan-card">
        <div className="fpc-content">
          <div className="fpc-title">Introducing freedom plan</div>
          <div className="fpc-subtitle">UNLIMITED TRADING | ZERO BROKERAGE</div>
          <WVButton variant="outlined" color="secondary">
            <div>Explore now</div>
            <Imgc
              className="fpc-button-arrow"
              src={require(`assets/next_nav_bar_icon.svg`)}
            />
          </WVButton>
        </div>
        <Imgc
          className="fpc-icon"
          src={require(`assets/${productName}/iv_freedomplanIntro.svg`)}
        />
      </div>
    </>
  );
};

export default FreedomPlanCard;
