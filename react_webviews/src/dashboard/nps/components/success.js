import React, { Component } from "react";
import Container from "../../common/Container";
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
        buttonTitle="CONTINUE"
        hideInPageTitle
        hidePageTitle
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
      >
        <div>
          <section className="page invest nps">
            <div className="container-padding">
              <div className="payment-sucess">
                <div className="container-padding">
                  <div ng-show="!paymentError">
                    <div className="icon">
                      <img
                        src={require("assets/check_icon.png")}
                        width="80"
                        height="80"
                        alt=""
                      />
                    </div>
                    <h1>Congratulations!</h1>
                    <p>NPS order received</p>
                    <div className="grey_text">
                      <img
                        src={require("assets/eta_icon.png")}
                        alt=""
                        width="30"
                      />{" "}
                      <span>2-3 working days</span>
                    </div>
                  </div>
                  {/* <div className="invest-error" ng-show="paymentError">
                    <h2>Error</h2>
                    <p>{"{paymentMessage}"}</p>
                  </div> */}
                </div>
                <div className="contact container-padding">
                  <p>For any query, reach us at</p>
                  <div className="flex-box">
                    <div className="item">{getConfig().mobile}</div>
                    <div className="item">{getConfig().email}</div>
                  </div>
                </div>
              </div>
              {/* <div className="nps-mandate">
                <img src={require("assets/next_step_icon.png")} />
                <div className="container-padding">
                  <div className="display-flex">
                    <h3>Create One-Time Mandate</h3>
                    <div className="info">Info</div>
                  </div>
                  <p>Get ready with:</p>
                  <div className="flex-box">
                    <div className="item">
                      <img
                        src={require("assets/pan_card_icon.png")}
                        alt=""
                        width="25"
                      />{" "}
                      <span>Aadhar card</span>
                    </div>
                    <div className="item">
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
            <div className="page-footer">
              {/* <md-button ng-show="showMandate" ng-className="{'button-loading' : isApiRunning}" ng-disabled="isApiRunning" ng-click="authenticate()" className="cta-button md-raised md-primary">Proceed</md-button>
            <md-button ng-show="!showMandate" ng-className="{'button-loading' : isApiRunning}" ng-disabled="isApiRunning" ng-click="proceed()" className="cta-button md-raised md-primary">Proceed</md-button> */}
            </div>
          </section>
        </div>
      </Container>
    );
  }
}

export default NpsSuccess;
