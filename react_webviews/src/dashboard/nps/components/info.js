import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { storageService } from "utils/validators";
import { navigate } from "../common/commonFunctions";

class NpsInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      currentuser: false,
      benefits: false,
      withdraw: false,
    };

    this.navigate = navigate.bind(this);
  }

  componentWillMount() {
    this.setState({
      currentuser: storageService().get("currentUser"),
    });
  }

  handleClick = (name) => {
    if (name) {
      this.setState({
        [name]: true
      })
    } else {
      if (this.state.currentuser.nps_investment) {
        // this,navigate('')
      } else {
        this.navigate("pan");
      }
    }
  };

  render() {
    let { benefits, withdraw } = this.state;
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="CONTINUE"
        title="Why NPS?"
        classOverRideContainer="pr-container"
        handleClick={this.handleClick}
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
                <div className="title">Save addtional tax</div>
                <div className="subtitle">
                  Invest in Tier I account and save additional tax upto Rs.
                  15,450.
                </div>
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
                <div className="title">Enjoy life after 60 years</div>
                <div className="subtitle">
                  Withdraw amount after 60 years age and enjoy your retirement
                  to the fullest.
                </div>
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
                <div className="title">Assets allocation flexibility</div>
                <div className="subtitle">
                  Flexibility across equity, corporate bonds and government
                  securities
                </div>
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
                <div className="title">Regulated & transparent</div>
                <div className="subtitle">
                  Promoted & regulated by PFRDA, Government of India
                </div>
              </div>
            </li>
          </ul>
        </div>

        {!benefits && <div
          className="nps-know-more-header"
          onClick={() => this.handleClick("benefits")}
        >
          <div>Know more about tax benefits</div>
        </div>}
        {benefits && <div className="nps-know-more">
          <div className="detail">
            <div className="head">Exclusive tax benefits in NPS:</div>
            <div className="statement">
              {"a)"} Any individual who is subscriber of NPS can claim tax
              deduction up to 10 % of gross income under Sec 80 CCD (1) with in
              the overall ceiling of Rs. 1.5 lakhs under Sec 80 CCE.
            </div>
            <div className="statement">
              {"b)"} An additional deduction for the investment up to Rs. 50,000
              in NPS (Tier I account) has been exclusively available for NPS
              under subsection 80CCD (1B). This is over and above the deduction
              of Rs. 1.5 lakhs available under sec 80C of Income Tax Act. 1961.
            </div>
            <div className="statement">
              {"c)"} Tax benefits are applicable for investments in Tier I
              account only & hence, fisdom doesn't offer investments in Tier II
              at this time.
            </div>
          </div>
        </div>}

        {!withdraw && benefits && <div
          className="nps-know-more-header"
          onClick={() => this.handleClick("withdraw")}
        >
          <div>Know more about withdrawal</div>
        </div>}
        {withdraw && <div className="nps-know-more">
          <div className="detail">
            <div className="head">Withdrawal:</div>
            <div className="statement">
              As per Pension Fund Regulatory & Development Authority (PFRDA)
              Exit Rules, following Withdrawal categories are allowed:
            </div>
            <div className="statement">
              <b>{"a)"} Upon normal superannuation - </b> At least 40% of the
              accumulated pension wealth of the subscriber has to be utilized
              for purchase of annuity providing for monthly pension of the
              subscriber and the balance is paid as lump sum to the subscriber.
            </div>
            <div className="statement">
              In case the total corpus in the account is less than Rs. 2 Lakhs
              as on the Date of attaining the age of 60, the subscriber can
              avail the option of complete Withdrawal.
            </div>
            <div className="statement">
              <b>{"b)"} Upon death - </b> The entire accumulated pension wealth
              (100%) would be paid to the nominee/legal heir of the subscriber
              and there would not be any purchase of annuity/monthly pension.
            </div>

            <div className="statement">
              <b>
                {"c)"} Exit from NPS Before the age of normal superannuation -{" "}
              </b>{" "}
              At least 80% of the accumulated pension wealth of the subscriber
              should be utilized for purchase of an annuity providing the
              monthly pension of the subscriber and the balance is paid as a
              lump sum to the subscriber.
            </div>

            {/* <!-- commenting obc specific nps flow obc_nps_flow -->
              <!-- <p ng-if="partner.code == 'obc'">
                d) Once invested in NPS, you won't be able to change pension fund house.
              </div> --> */}
          </div>
        </div>}
      </Container>
    );
  }
}

export default NpsInfo;
