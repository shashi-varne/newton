import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsInvestments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="INVEST MORE"
        hideInPageTitle
        hidePageTitle
        title="NPS Investments"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <section class="page invest nps">
          <div class="nps-investments">
            <div
              class="list"
              ng-if="npscampaign"
              ng-click="redirectNpsCampLink('nps activation pending')"
            >
              <div class="icon">
                <img src={require("assets/warning_icon.svg")} width="40" />
              </div>
              <div class="text">
                <div className="title">NPS activation pending</div>
                <div className="sub-title">e-Sign through Aadhaar</div>
              </div>
            </div>

            <div class="list" ng-click="nps_tax_statement('tax statement')">
              <div class="icon">
                <img
                  src={require("assets/fisdom/icn_tax_statement.svg")}
                  width="40"
                />
              </div>
              <div class="text">
                <div className="title">Tax Statement </div>
                <div className="sub-title">PRAN: {"{npsData.pran}"}</div>
              </div>
              <div
                class="status"
                ng-class="{'green': npsData.pran_status === 'active', 'yellow': npsData.pran_status !== 'active'}"
              >
                <div class="circle"></div>
                <div ng-if="npsData.pran_status === 'active'">ACTIVE</div>
                <div ng-if="npsData.pran_status !== 'active'">FREEZED</div>
              </div>
            </div>
            <div
              class="list"
              ng-hide="partner.code == 'bfdlmobile'"
              ng-click="optionClicked('kyc-journey', 'complete nps transaction')"
              ng-if="currentUser.kyc_registration_v2 === 'init' || currentUser.kyc_registration_v2 === 'incomplete'"
            >
              <div class="icon">
                <img
                  src={require("assets/kyc_icon.svg")}
                  height="40"
                  width="40"
                />
              </div>
              <div class="text">
                <div className="title">KYC</div>
                <div className="sub-title">Complete nps transaction</div>
              </div>
            </div>
            {/* <!-- <div class="list" ui-sref="nps-sip-schedule" ng-show="sipIntents.length > 0">
              <div class="icon">
                <img src="../assets/img/sip.png" width="50" />
              </div>
              <div class="text">
                <div className="title">NPS SIP Schedule</div>
                <div className="sub-title"></div>
              </div>
            </div> --> */}
            <div
              class="list"
              ng-click="optionClicked('nps-performance', 'track nps performance')"
              ng-show="npsPerformance.length > 0"
            >
              <div class="icon">
                <img
                  src={require("assets/fisdom/icn_fundwise_summary.svg")}
                  width="40"
                />
              </div>
              <div class="text">
                <div className="title">Track NPS Performance</div>
                <div className="sub-title">View fund wise summary</div>
              </div>
            </div>
            <div
              class="list"
              ng-click="optionClicked('nps-pending', 'pending order')"
              ng-show="npsPending.length > 0"
            >
              <div class="icon">
                <img
                  src={require("assets/fisdom/icn_fundwise_summary.svg")}
                  width="40"
                />
              </div>
              <div class="text">
                <div className="title">Pending Order</div>
                <div className="sub-title">
                  {"{ pendingAmount | inrFormat }"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsInvestments;
