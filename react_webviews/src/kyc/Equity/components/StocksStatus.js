import React from "react";
import Button from "../../../common/ui/Button";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const StocksStatus = (props) => {
  return (
    <Container noFooter title="Stocks">
      <div
        className="stocks-status-card"
        style={{
          backgroundImage: `url(${require(`assets/${productName}/stocks_cip.svg`)})`,
        }}
      >
        <div className="stocks-title">
          <h3>Complete your KYC application</h3>
          <img
            alt=""
            src={require(`assets/${productName}/kyc_status_icon.svg`)}
          />
        </div>
        <p className="stocks-subtitle">
          Don't miss out on good returns by delaying
        </p>
        <Button
          buttonTitle="COMPLETE NOW"
          classes={{ button: "stocks-button" }}
        />
      </div>
    </Container>
  );
};

export default StocksStatus;
