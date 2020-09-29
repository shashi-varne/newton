import React, { Component, Fragment } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { getUrlParams } from 'utils/validators';

class DigiStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      params: getUrlParams()
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'digi_kyc_status'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('ok');
    nativeCallback({ action: 'exit' });
  }

  handleClose = () => {
    nativeCallback({ action: 'exit' });
    return;
  }

  render() {
    const {show_loader, productName} = this.state;
    const {status} = this.state.params;
    const headerData = {
        icon: "close",
        goBack: this.handleClose
    }

    return (
      <Container
        showLoader={show_loader}
        title= {status === "success"? 'Digilocker authorisation successful!' : 'Digilocker authorisation failed!'}
        events={this.sendEvents('just_set_events')}
        handleClick={status === "success" ? this.handleClick : ""}
        buttonTitle= {status === "success" ? 'OKAY' : 'RETRY'}
        headerData={headerData}
      >
        <div className="digi-status">
          <img
            src={ require(`assets/${productName}/ils_digilocker_${status}.svg`)}
            style={{width:"100%"}}
            alt="Digilocker Status" 
          />
          {status === "success" ? 
            <div className="digi-status-text">
                <strong>Digilocker is now linked!</strong> Complete remaining steps to start investing
            </div>
            :
            <Fragment>
                <div className="digi-status-text">
                    Aadhaar KYC has been failed because we were not able to connect to your Digilocker.
                </div>
                <div>
                    However, you can <strong>still complete your KYC</strong> and start investing in mutual funds.
                </div>
            </Fragment>
          }
        </div>
      </Container>
    );
  }
}

export default DigiStatus;
