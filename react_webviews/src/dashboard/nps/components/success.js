import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../common/commonFunctions";
import { getConfig } from "utils/functions";

class NpsSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

  }

  authenticate = () => {
    // $scope.authenticate = function () {
    //   $scope.isApiRunning = true;
    //   investService.npsRequestMandate({ amount: 50000 }).then(function (data) {
    //     $scope.isApiRunning = false;
    //     $scope.paymentRedirectUrl = encodeURIComponent(
    //       $location.protocol() + '://' + $location.host() + ':' +$location.port() + '/#!/nps/mandate/callback'
    //     );
    //     var pgLink = data.payment_link;
    //     pgLink += ( pgLink.match( /[\?]/g ) ? '&' : '?' ) + 'plutus_redirect_url='+ $scope.paymentRedirectUrl;
    //     window.location = pgLink;
    //   }, function (err) {
    //     $scope.isApiRunning = false;
    //   });
    // };
  }

  handleClick = () => {
    this.navigate("investments")
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="Confirm Delivery Details"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div>
          <section class="page invest nps">
            <div class="container-padding">
              <div class="payment-sucess">
                <div class="container-padding">
                  <div ng-show="!paymentError">
                    <div class="icon">
                      <img
                        src={require("assets/check_icon.png")}
                        width="80"
                        height="80"
                      />
                    </div>
                    <h1>Congratulations!</h1>
                    <p>NPS order received</p>
                    <div class="grey_text">
                      <img
                        src={require("assets/eta_icon.png")}
                        alt=""
                        width="30"
                      />{" "}
                      <span>2-3 working days</span>
                    </div>
                  </div>
                  {/* <div class="invest-error" ng-show="paymentError">
                    <h2>Error</h2>
                    <p>{"{paymentMessage}"}</p>
                  </div> */}
                </div>
                <div class="contact container-padding">
                  <p>For any query, reach us at</p>
                  <div class="flex-box">
                    <div class="item">+80-30-408363</div>
                    <div class="item">{getConfig().askEmail}</div>
                  </div>
                </div>
              </div>
              {/* <div class="nps-mandate">
                <img src={require("assets/next_step_icon.png")} />
                <div class="container-padding">
                  <div class="display-flex">
                    <h3>Create One-Time Mandate</h3>
                    <div class="info">Info</div>
                  </div>
                  <p>Get ready with:</p>
                  <div class="flex-box">
                    <div class="item">
                      <img
                        src={require("assets/pan_card_icon.png")}
                        alt=""
                        width="25"
                      />{" "}
                      <span>Aadhar card</span>
                    </div>
                    <div class="item">
                      <img
                        src={require("assets/add_bank_icon.png")}
                        alt=""
                        width="25"
                      />{" "}
                      <span>Bank Details</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div class="page-footer">
              {/* <md-button ng-show="showMandate" ng-class="{'button-loading' : isApiRunning}" ng-disabled="isApiRunning" ng-click="authenticate()" class="cta-button md-raised md-primary">Proceed</md-button>
            <md-button ng-show="!showMandate" ng-class="{'button-loading' : isApiRunning}" ng-disabled="isApiRunning" ng-click="proceed()" class="cta-button md-raised md-primary">Proceed</md-button> */}
            </div>
          </section>
        </div>
      </Container>
    );
  }
}

export default NpsSuccess;
