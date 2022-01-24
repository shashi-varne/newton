import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import WVButton from "../../../common/ui/Button/WVButton";
import { Imgc } from "../../../common/ui/Imgc";
import SVG from "react-inlinesvg";
import noop from 'lodash/noop'
import "./FreedomPlanCard.scss";

const FreedomPlanCard = (props) => {
  const { onClick = noop } = props;
  const { productName, styles } = useMemo(getConfig, []);
  return (
    <>
      <div className="card flex-between freedom-plan-card" onClick={onClick}>
        <div className="fpc-content">
          <div className="fpc-title">Introducing freedom plan</div>
          <div className="fpc-subtitle">
            UNLIMITED TRADING <span>|</span> ZERO BROKERAGE
          </div>
          <WVButton variant="outlined" color="secondary" className="fpc-button">
            <div>Explore now</div>
            <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + styles.secondaryColor)
              }
              src={require(`assets/arrow_right.svg`)}
              className="fpc-button-arrow"
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
