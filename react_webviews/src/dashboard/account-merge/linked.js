import React, { useState } from "react";
import { getConfig, isIframe } from "utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import Container from "../common/Container";
import { navigate as navigateFunc } from "../invest/common/commonFunction";
import "./style.scss";

const AccountLinked = (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const productName = config.productName;
  const partner = config.partner;
  const handleClick = () => {
    navigate("/logout");
  };

  const hideImage =
    isIframe() && partner.code === "moneycontrol" && config.isMobileDevice;
  return (
    <Container buttonTitle="CLOSE" hidePageTitle handleClick={handleClick}>
      <div className="account-merge-linked">
        {!hideImage && (
          <div className="outline">
            <Imgc
              alt=""
              className="img"
              src={require(`assets/${productName}/acconts_linked.svg`)}
            />
          </div>
        )}
        <h3>Accounts Linked</h3>
        <p>
          Congratulations! Account linked. Please Close this page, and open
          ‘Mutual Fund’ again.
        </p>
      </div>
    </Container>
  );
};

export default AccountLinked;
