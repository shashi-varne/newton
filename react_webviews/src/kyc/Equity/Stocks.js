import React from "react";
import Button from "../../common/ui/Button";
import { getConfig } from "../../utils/functions";
import Container from "../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const Stocks = (props) => {
  return (
    <Container noFooter title="Stocks">
      <div
        className="kyc-stocks-card"
        style={{
          backgroundImage: `url(${require(`assets/${productName}/kyc_cip.svg`)})`,
        }}
      >
        <div className="kyc-stocks-title">
          <h3>Complete your KYC application</h3>
          <img alt="" src={require(`assets/${productName}/kyc_icon.svg`)} />
        </div>
        <p className="kyc-stocks-subtitle">
          Don't miss out on good returns by delaying
        </p>
        <Button
          buttonTitle="COMPLETE NOW"
          classes={{ button: "kyc-stocks-button" }}
        />
      </div>
    </Container>
  );
};

export default Stocks;
