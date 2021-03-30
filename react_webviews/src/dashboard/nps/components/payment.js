import React, { Component } from "react";
import { initialize } from "../common/commonFunctions";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";

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
    if (this.state.status !== 'success') {
      this.navigate('/invest', '', true)
    } else {
      const result = await this.getNPSInvestmentStatus();
      storageService().set('nps_additional_details_required', true);
  
      let currentUser = storageService().get("currentUser");
  
      if (result.registration_details.additional_details_status) {
        if (currentUser.kyc_registration_v2 == 'init') {
          this.navigate('/home-kyc');
        } else if (currentUser.kyc_registration_v2 == 'incomplete') {
          this.navigate('/kyc-journey', '', true);
        } else {
          this.navigate('identity');
        }
      } else {
        this.navigate('investments');
      }
    }
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="OK"
        title="Payment Status"
        handleClick={this.handleClick}
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
            {this.state.status !== 'success' && <div className="invest-error">
              <h2>Error</h2>
              <p>Payment Failed</p>
            </div>}
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsPaymentCallback;
