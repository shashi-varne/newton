import React from 'react';
import Container from '../common/Container';

import account_icon from "assets/account_icon.png"
import bse_icon from "assets/bse_icon.png"
import fund_house_icon from "assets/fund_house_icon.png"
import safe_secure_journey from "assets/safe_secure_journey.png"

import "./style.scss"

const InvestJourney = (props) => {
  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Continue to KYC'
      helpContact
      hideInPageTitle
      hidePageTitle
      title="How it works"
      classOverRideContainer='pr-container'
    >
     <section className="invest-journey-container">
        <div className="invest-journey-header">
            <div>
                <img alt="safe_secure_journey" src={safe_secure_journey} />
            </div>
            <div>
                With fisdom, investment is easy & secure
            </div>
        </div>
        <div className="invest-journey-steps">
            <div className="invest-journey-connect">
                <div className="invest-journey-connect-content">
                    <div className="invest-journey-connect-icon">
                    <img alt="account_icon" src={account_icon} />
                    </div>
                    <div className="invest-journey-connect-step">
                        <p>Step - 1</p>
                        <div>Your bank account</div>
                        <div>₹ 5,000 per month</div>
                    </div>
                </div>
                <div className="invest-journey-connect-content">
                    <div className="invest-journey-connect-icon">
                    <img alt="bse_icon" src={bse_icon} />
                    </div>
                    <div className="invest-journey-connect-step">
                        <p>Step - 2</p>
                        <div>Bombay stock exchange</div>
                        <div>via secured gateway - BillDesk</div>
                    </div>
                </div>
                <div className="invest-journey-connect-content">
                    <div className="invest-journey-connect-icon">
                    <img alt="fund_house_icon" src={fund_house_icon} />
                    </div>
                    <div className="invest-journey-connect-step">
                        <p>Step - 3</p>
                        <div>Fund house</div>
                        <div>On next working day units get allotted</div>
                    </div>
                </div>
            </div>
        </div>
     </section>
    </Container>
  );
};
export default InvestJourney;
