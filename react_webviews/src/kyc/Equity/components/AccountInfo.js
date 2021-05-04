import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const AccountInfo = (props) => {
  return (
    <Container
      buttonTitle="CONTINUE"
      title={"Trading & demat account"}
      hidePageTitle
    >
      <div className="kyc-account-info">
        <header className="kyc-account-info-header">
          <div className="kaih-text">{"Trading & demat account"}</div>
          <img src={require(`assets/${productName}/ic_upgrade.svg`)} alt="" />
        </header>
        <main className="kyc-account-info-main">
          <div className="kaim-subtitle">
            Invest in India's best performing stocks in just a few clicks!
          </div>
          <div className="generic-page-title">Key benefits</div>
        </main>
      </div>
    </Container>
  );
};

export default AccountInfo;
