import React, { Component } from "react";
import { initialize } from "../common/commonFunctions";
import Container from "fund_details/common/Container";
import { storageService } from "utils/validators";

class NpsPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      screen_name: 'npsPaymentStatus'
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = async () => {
    const result = await this.getNPSInvestmentStatus();
    storageService().set('nps_additional_details_required', true);

    let currentUser = storageService().get("currentUser");

    if (result.registration_details.additional_details_status) {
      if (currentUser.kyc_registration_v2 == 'init') {
        this.navigate('home-kyc');
      } else if (currentUser.kyc_registration_v2 == 'incomplete') {
        this.navigate('kyc-journey');
      } else {
        this.navigate('identity');
      }
    } else {
      this.navigate('investments');
    }
  };

  render() {
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="OK"
        hideInPageTitle
        hidePageTitle
        title="Payment Status"
        classOverRideContainer="pr-container"
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="nps-payment-callback">
          <div
            className="invest-sucess container-padding"
            style={{ padding: "20px" }}
          >
            <div ng-show="paymentError == false">
              <div className="icon">
                <img src={require("assets/thumb.svg")} width="80" height="80" />
              </div>
              <h3>Payment Successful</h3>
              <p>
                Payment of <span>50000</span>
              </p>
            </div>
            <div className="invest-error" ng-show="paymentError == true">
              <h2>Error</h2>
              <p>{"{paymentMessage}"}</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPaymentCallback;
