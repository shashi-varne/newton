import React, { useState } from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import Checkbox from "../../../common/ui/Checkbox";
import "./commonStyles.scss";
import SecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer";

const productName = getConfig().productName;
const benefits = [
  {
    icon: "one_account.svg",
    text: "One account for stocks, IPO, F&O",
  },
  {
    icon: "paperless.svg",
    text: "Paperless process - fast & secure",
  },
  {
    icon: "experience.svg",
    text: "Get the best investment experience",
  },
];
const AccountInfo = (props) => {
  const [checkTermsAndConditions, setCheckTermsAndConditions] = useState(true);
  const handleCheckBox = () => {
    setCheckTermsAndConditions(!checkTermsAndConditions);
  };
  return (
    <Container
      buttonTitle="CONTINUE"
      title={"Trading & demat account"}
      hidePageTitle
      disable={!checkTermsAndConditions}
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
          <div className="kaim-key-benefits">
            <div className="generic-page-title">Key benefits</div>
            <div className="kaim-benefits">
              {benefits.map((data, index) => {
                return (
                  <div key={index} className="kaim-benefits-info">
                    <img
                      src={require(`assets/${productName}/${data.icon}`)}
                      alt=""
                    />
                    <div className="kaim-benefits-info-text">{data.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="generic-page-title">{"Fees & charges"}</div>
            <div className="kaim-fees-info">
              <div className="kaim-fees-info-text">
                <div>Account opening charges</div>
                <div className="kaim-fees-info-subtext">(one-time fee)</div>
              </div>
              <div>
                <div className="kaim-no-fees-text1">₹ 250/yr+ GST</div>
                <div className="kaim-no-fees-text2">FREE</div>
              </div>
            </div>
            <div className="kaim-fees-info">
              <div className="kaim-fees-info-text">
                <div>Platform charges</div>
              </div>
              <div>
                <div className="kaim-no-fees-text1">₹ 250/yr+ GST</div>
                <div className="kaim-no-fees-text2">FREE</div>
              </div>
            </div>
          </div>
          <div className="kaim-terms">
            <Checkbox
              checked={checkTermsAndConditions}
              handleChange={handleCheckBox}
            />
            <div>
              I agree to have read and understood the{" "}
              <span>{"Terms & conditions"}</span> and{" "}
              <span>Equity Annexure</span>{" "}
            </div>
          </div>
          <SecurityDisclaimer />
        </main>
      </div>
    </Container>
  );
};

export default AccountInfo;
