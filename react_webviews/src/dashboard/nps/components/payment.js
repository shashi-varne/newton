import React, { Component } from "react";
import { initialize } from "../common/commonFunctions";
import Container from "fund_details/common/Container";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";
import { getUrlParams } from "utils/validators";

class NpsPaymentCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      screen_name: 'npsPaymentStatus',
      amount: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let amount = storageService().get('npsAmount');

    let pathname = this.props.history.location.pathname.split('/');
    let status = pathname[pathname.length - 1];

    this.setState({
      amount: amount,
      status: status
    })
  };

  handleClick = async () => {
    const result = await this.getNPSInvestmentStatus();
    storageService().set('nps_additional_details_required', true);

    let currentUser = storageService().get("currentUser");

    if (result.registration_details.additional_details_status) {
      if (currentUser.kyc_registration_v2 == 'init') {
        this.navigate('/home-kyc');
      } else if (currentUser.kyc_registration_v2 == 'incomplete') {
        this.navigate('/kyc-journey');
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
        showLoader={this.state.show_loader}
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
            {this.state.status === 'success' && <div>
              <div className="icon">
                <img src={require("assets/thumb.svg")} width="80" height="80" />
              </div>
              <div className="sub-head">Payment Successful</div>
              <div className="sub-title">
                Payment of <b>{formatAmountInr(this.state.amount)}</b> towards NPS is successful
              </div>
            </div>}
            {this.state.status !== 'success' && <div className="invest-error" ng-show="paymentError == true">
              <h2>Error</h2>
              <p>{"{paymentMessage}"}</p>
            </div>}
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPaymentCallback;
