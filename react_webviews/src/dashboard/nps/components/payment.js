import React, { Component } from "react";
import { initialize } from "../common/commonFunctions";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";
import { getConfig, isIframe } from "../../../utils/functions";

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
      this.navigate('/invest')
    } else {
      const result = await this.getNPSInvestmentStatus();
      storageService().set('nps_additional_details_required', true);
      storageService().setObject('nps_additional_details', result.registration_details);
      storageService().setObject('kyc_app', result.kyc_app);
  
      let currentUser = storageService().getObject("user");
      let _event = {
        event_name: "journey_details",
        properties: {
          journey: {
            name: "nps",
            trigger: "cta",
            journey_status: "incomplete",
            next_journey: "kyc",
          },
        },
      };
      if (!result.registration_details.additional_details_status) {
        if (currentUser.kyc_registration_v2 === 'init') {
          // send event
          if (!getConfig().Web) {
            window.callbackWeb.eventCallback(_event);
          } else if (isIframe()) {
            window.callbackWeb.sendEvent(_event);
          }
          this.navigate('/kyc/journey');
        } else if (currentUser.kyc_registration_v2 === 'incomplete') {
          // send event
          if (!getConfig().Web) {
            window.callbackWeb.eventCallback(_event);
          } else if (isIframe()) {
            window.callbackWeb.sendEvent(_event);
          }
          this.navigate('/kyc/journey');
        } else {
          this.navigate('/nps/identity');
        }
      } else {
        let _event = {
          'event_name': 'journey_details',
          'properties': {
            'journey': {
              'name': 'nps',
              'trigger': 'cta',
              'journey_status': 'complete',
              'next_journey': 'reports'
            }
          }
        };
        // send event
        if (!getConfig().Web) {
          window.callbackWeb.eventCallback(_event);
        } else if (isIframe()) {
          window.callbackWeb.sendEvent(_event);
        }
        this.navigate('/nps/investments');
      }
    }
  };

  goBack = () => {
    this.navigate('/landing');
  }
 
  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle="OK"
        title="Payment Status"
        handleClick={this.handleClick}
        headerData={{
          goBack: this.goBack
        }}
      >
        <div className="nps-payment-callback">
          <div
            className="invest-sucess container-padding"
            style={{ padding: "20px" }}
          >
            {this.state.status === 'success' && <div>
              <div className="icon">
                <img
                  alt=""
                  src={require("assets/thumb.svg")}
                  width="80"
                  height="80"
                />
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
