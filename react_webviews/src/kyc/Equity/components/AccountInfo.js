import React, { useState } from "react";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import Container from "../../common/Container";
import Checkbox from "../../../common/ui/Checkbox";
import "./commonStyles.scss";
import SecurityDisclaimer from "../../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer";
import { isEmailOrMobileVerified } from "../../common/functions";
import { PATHNAME_MAPPER } from "../../constants";
import useUserKycHook from "../../common/hooks/userKycHook";

const productName = getConfig().productName;
const BENEFITS = [
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
  const navigate = navigateFunc.bind(props);
  const [checkTermsAndConditions, setCheckTermsAndConditions] = useState(true);
  const { kyc, isLoading } = useUserKycHook();
  const handleCheckBox = () => {
    setCheckTermsAndConditions(!checkTermsAndConditions);
  };

  const handleClick = () => {
    if (kyc?.application_status_v2 === "submitted" || kyc?.application_status_v2 === "complete") {
      if (!isEmailOrMobileVerified()) {
        navigate(PATHNAME_MAPPER.communicationDetails);
      } else {
        navigate(PATHNAME_MAPPER.tradingExperience);
      }
    } else {
      navigate(PATHNAME_MAPPER.homeKyc);
    }
  };

  return (
    <Container
      buttonTitle="CONTINUE"
      title="Trading & demat account"
      hidePageTitle
      data-aid='kyc-demate-account-screen'
      disable={!checkTermsAndConditions}
      handleClick={handleClick}
      skelton={isLoading}
    >
      <div className="kyc-account-info" data-aid='kyc-account-info'>
        <header className="kyc-account-info-header" data-aid='kyc-account-info-header'>
          <div className="kaih-text">Trading & demat account"</div>
          <img src={require(`assets/${productName}/ic_upgrade.svg`)} alt="" />
        </header>
        <main className="kyc-account-info-main" data-aid='kyc-account-info-main'>
          <div className="kaim-subtitle" data-aid='kyc-subtitle'>
            Invest in India's best performing stocks in just a few clicks!
          </div>
          <div className="kaim-key-benefits" data-aid='key-benefits'>
            <div className="generic-page-title">Key benefits</div>
            <div className="kaim-benefits">
              {BENEFITS.map((data, index) => {
                return (
                  <div key={index} className="kaim-benefits-info" data-aid='kaim-benefits-info'>
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
            <div className="generic-page-title" data-aid='kyc-free-charges'>Fees & charges</div>
            <div className="kaim-fees-info" data-aid='kyc-opening-charges'>
              <div className="kaim-fees-info-text">
                <div>Account opening charges</div>
                <div className="kaim-fees-info-subtext">(one-time fee)</div>
              </div>
              <div>
                <div className="kaim-no-fees-text1">₹ 250/yr+ GST</div>
                <div className="kaim-no-fees-text2">FREE</div>
              </div>
            </div>
            <div className="kaim-fees-info" data-aid='kyc-platform-charges'>
              <div className="kaim-fees-info-text">
                <div>Platform charges</div>
              </div>
              <div>
                <div className="kaim-no-fees-text1">₹ 250/yr+ GST</div>
                <div className="kaim-no-fees-text2">FREE</div>
              </div>
            </div>
          </div>
          <div className="kaim-terms" data-aid='kaim-terms'>
            <Checkbox
              checked={checkTermsAndConditions}
              handleChange={handleCheckBox}
            />
            <div className="kaim-terms-info">
              I agree to have read and understood the{" "}
              <span>Terms & conditions</span> and{" "}
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
