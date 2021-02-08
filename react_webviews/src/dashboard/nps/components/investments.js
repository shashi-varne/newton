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
          <div class="mainbottom">
            <div
              class="list"
              ng-if="npscampaign"
              ng-click="redirectNpsCampLink('nps activation pending')"
            >
              <div class="icon">
                <img src={require("assets/warning_icon.svg")} width="40" />
              </div>
              <div class="text">
                <h4>NPS activation pending</h4>
                <p>e-Sign through Aadhaar</p>
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
                <h4>Tax Statement </h4>
                <p>PRAN: {"{npsData.pran}"}</p>
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
                <img src={require("assets/kyc_icon.svg")} height="40" width="40" />
              </div>
              <div class="text">
                <div class="title">KYC</div>
                <div>Complete nps transaction</div>
              </div>
            </div>
            {/* <!-- <div class="list" ui-sref="nps-sip-schedule" ng-show="sipIntents.length > 0">
      <div class="icon">
        <img src="../assets/img/sip.png" width="50" />
      </div>
      <div class="text">
        <h4>NPS SIP Schedule</h4>
        <p></p>
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
                <h4>Track NPS Performance</h4>
                <p>View fund wise summary</p>
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
                <h4>Pending Order</h4>
                <p>{"{ pendingAmount | inrFormat }"}</p>
              </div>
            </div>
          </div>
          {/* <div ng-class="{'page-footer': isIframe, 'footer': !isIframe}">
            <md-button
              ng-click="proceed()"
              class="cta-button md-raised md-primary"
            >
              Invest More
            </md-button>
          </div> */}
        </section>
      </Container>
    );
  }
}

export default NpsInvestments;
