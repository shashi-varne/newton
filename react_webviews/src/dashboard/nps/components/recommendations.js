import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { get_recommended_funds } from "../common/api";
import toast from "common/ui/Toast";

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      recommendations: '',
    };
  }

  componentWillMount() {
    this.fetchRecommendedFunds();
  }

  fetchRecommendedFunds = async () => {
    try {
      this.setState({
        show_loader: true,
      });

      const params = {
        type: "buildwealth",
      };
      const data = await get_recommended_funds(params);

      this.setState({
        recommendations: data.recommended[0],
        show_loader: false,
      });
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast(err);
    }
  };

  getFormatted = (value) => {
    return value
      .split("_")
      .join(" ")
      .replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      });
  };

  render() {
    let { recommendations, show_loader } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Recommended fund"
        showLoader={show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <div className="fund">
          <div className="replace">Replace</div>
          <div className="name">
            <div className="icon">
              <img
                src={recommendations && recommendations.pension_house.image}
                alt={recommendations}
                width="90"
              />
            </div>
            <div className="text">
              <h3>{recommendations && recommendations.pension_house.name}</h3>
            </div>
          </div>
        </div>

        <div className="fund-detail">
          <div className="risk">
            <p>
              <b>Risk:</b> {this.getFormatted(recommendations.risk || "")}
            </p>
            <span className="edit-icon edit">Edit</span>
          </div>
          <div className="allocation">
            <div className="graph">
              <canvas
                id="doughnut"
                className="chart chart-doughnut"
                chart-data="data"
                chart-labels="labels"
                chart-colors="colors"
                chart-options="options"
              ></canvas>
              <div
                className="text-center"
                style={{ color: "rgb(135, 135, 135)", marginTop: "10px" }}
              >
                Asset allocation
              </div>
            </div>
            <div className="stats">
              <ul>
                <li>
                  <div className="">
                    <b>Class E</b>
                  </div>
                  <div className="">
                    <span className="color3">
                      {recommendations && recommendations.e_allocation}%
                    </span>{" "}
                    in equity
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class C</b>
                  </div>
                  <div className="">
                    <span className="color4">
                      {recommendations && recommendations.c_allocation}%
                    </span>{" "}
                    in corporate debt
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class G</b>
                  </div>
                  <div className="">
                    <span className="color2">
                      {recommendations && recommendations.g_allocation}%
                    </span>{" "}
                    in govt. bonds
                  </div>
                </li>
                <li>
                  <div className="">
                    <b>Class A</b>
                  </div>
                  <div className="">
                    <span className="color1">
                      {recommendations && recommendations.a_allocation}%
                    </span>{" "}
                    in AIFs
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bill">
          {/* <!-- <div class="heading">
            <div class="flex-box">
              <div class="left">Total payable amount</div>
              <div class="right">{{ paymentDetail.total_amount | inrFormat }}</div>
            </div>
          </div>
          <div class="flex-box">
            <div class="left">Investment amount</div>
            <div class="right">{{ paymentDetail.amount }}</div>
          </div>
          <div class="flex-box">
            <div class="left">Onboarding charges (One-time)</div>
            <div class="right">{{ paymentDetail.onboarding_charges }}</div>
          </div>
          <div class="flex-box">
            <div class="left">Transaction charges</div>
            <div class="right">{{ paymentDetail.transaction_charges }}</div>
          </div>
          <div class="flex-box">
            <div class="left">GST (18%)</div>
            <div class="right">{{ paymentDetail.gst }}</div>
          </div> --> */}
          <div
            className="flex-box"
            ng-repeat="charge in paymentDetail track by $index"
            ng-class="{'heading' : charge.key === 'total_amount'}"
            ng-if="charge.value > 0"
          >
            <div className="left">{"{ 'charge.text' }"}</div>
            <div className="right">{"{ 'charge.value' | inrFormatDecimal }"}</div>
          </div>
          <div className="note">
            <div className="heading">Note:</div>
            <div>
              <span>1.</span> Your subsequent investments will go into the above
              selected pension fund house. Switch facility can be availed only
              once per year.
            </div>
            <div>
              <span>2.</span> At this point, we are only catering customers who
              will be onboarded by us.
            </div>
            <div>
              <span>3.</span> Standard charges stipulated by PFRDA will apply on
              your investment.
            </div>
            {/* //<div className="more" ng-click="more()">Know More...</div> */}
          </div>
          <div className="terms">
            <img src="../assets/img/terms_agree.png" alt="" width="25" />
            <div ng-if="!finity && isWeb">
              By tapping on proceed, I agree that I have read the <br />
              <a href="https://www.fisdom.com/terms/" target="_blank">
                terms & conditions
              </a>
              .
            </div>
            <div ng-if="!finity && !isWeb">
              By tapping on proceed, I agree that I have read the <br />
              <a ng-click="native_Intent('https://www.fisdom.com/terms/')">
                terms & conditions
              </a>
              .
            </div>
            <div ng-if="finity">
              By tapping on accept, I agree that I have read the <br />
              <a
                ng-class="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
              By tapping on proceed, I agree that I have read the <br />
              <a
                ng-class="{'button-loading' : showTncLoader}"
                style={{ textDecoration: "underline" }}
                ng-click="showTnC($event)"
              >
                terms & conditions.
              </a>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Recommendations;
