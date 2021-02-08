import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsInfo extends Component {
  render() {
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="CONTINUE"
        title="Why NPS?"
        classOverRideContainer="pr-container"
      >
        <div className="nps-info">
          <ul>
            <li>
              <div className="icon">
                <img
                  src={require("assets/nps_save_tax_icon.png")}
                  alt="Gold funds"
                  width="70"
                />
              </div>
              <div className="text">
                <h4>Save addtional tax</h4>
                <p>
                  Invest in Tier I account and save additional tax upto Rs.
                  15,450.
                </p>
              </div>
            </li>
            <li>
              <div className="icon">
                <img
                  src={require("assets/nps_retirement_icon.png")}
                  alt="Gold funds"
                  width="70"
                />
              </div>
              <div className="text">
                <h4>Enjoy life after 60 years</h4>
                <p>
                  Withdraw amount after 60 years age and enjoy your retirement
                  to the fullest.
                </p>
              </div>
            </li>
            <li>
              <div className="icon">
                <img
                  src={require("assets/nps_asset_allocation_icon.png")}
                  alt="Gold funds"
                  width="70"
                />
              </div>
              <div className="text">
                <h4>Assets allocation flexibility</h4>
                <p>
                  Flexibility across equity, corporate bonds and government
                  securities
                </p>
              </div>
            </li>
            <li>
              <div className="icon">
                <img
                  src={require("assets/nps_regulated_icon.png")}
                  alt="Gold funds"
                  width="70"
                />
              </div>
              <div className="text">
                <h4>Regulated & transparent</h4>
                <p>Promoted & regulated by PFRDA, Government of India</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="nps-know-more-header">
          <h4>Know more about tax benefits</h4>
        </div>
        <div className="nps-know-more">
          <div className="detail">
            <div className="head">Exclusive tax benefits in NPS:</div>
            <p>
              {"a)"} Any individual who is subscriber of NPS can claim tax deduction
              up to 10 % of gross income under Sec 80 CCD (1) with in the
              overall ceiling of Rs. 1.5 lakhs under Sec 80 CCE.
            </p>
            <p>
              {"b)"} An additional deduction for the investment up to Rs. 50,000 in
              NPS (Tier I account) has been exclusively available for NPS under
              subsection 80CCD (1B). This is over and above the deduction of Rs.
              1.5 lakhs available under sec 80C of Income Tax Act. 1961.
            </p>
            <p ng-if="!finity">
              {"c)"} Tax benefits are applicable for investments in Tier I
              account only & hence, fisdom doesn't offer investments in Tier II
              at this time.
            </p>
            <p ng-if="finity">
              {"c)"} Tax benefits are applicable for investments in Tier I
              account only & hence, finity doesn't offer investments in Tier II
              at this time.
            </p>
          </div>
        </div>

        <div className="nps-know-more-header">
          <h4>Know more about withdrawal</h4>
        </div>
        <div className="nps-know-more">
          <div className="detail">
            <div className="head">Withdrawal:</div>
            <p>
              As per Pension Fund Regulatory & Development Authority (PFRDA)
              Exit Rules, following Withdrawal categories are allowed:
            </p>
            <p>
              <b>{"a)"} Upon normal superannuation - </b> At least 40% of the
              accumulated pension wealth of the subscriber has to be utilized
              for purchase of annuity providing for monthly pension of the
              subscriber and the balance is paid as lump sum to the subscriber.
            </p>
            <p>
              In case the total corpus in the account is less than Rs. 2 Lakhs
              as on the Date of attaining the age of 60, the subscriber can
              avail the option of complete Withdrawal.
            </p>
            <p>
              <b>{"b)"} Upon death - </b> The entire accumulated pension wealth
              (100%) would be paid to the nominee/legal heir of the subscriber
              and there would not be any purchase of annuity/monthly pension.
            </p>

            <p>
              <b>
                {"c)"} Exit from NPS Before the age of normal superannuation -{" "}
              </b>{" "}
              At least 80% of the accumulated pension wealth of the subscriber
              should be utilized for purchase of an annuity providing the
              monthly pension of the subscriber and the balance is paid as a
              lump sum to the subscriber.
            </p>

            {/* <!-- commenting obc specific nps flow obc_nps_flow -->
              <!-- <p ng-if="partner.code == 'obc'">
                d) Once invested in NPS, you won't be able to change pension fund house.
              </p> --> */}
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsInfo;
