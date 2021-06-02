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

  handleClick = () => {
    nativeCallback({ action: 'exit_web' });
  }

  render() {
    const {show_loader, productName} = this.state;
    const {status = "failed"} = this.state.params;
    const headerData = {
      icon: "close",
      goBack: this.handleClick
    }

    return (
      <Container
        showLoader={show_loader}
        title= {status === "success" ? 'Digilocker authorisation successful!' : 'Digilocker authorisation failed!'}
        handleClick={this.handleClick}
        buttonTitle='OKAY'
        headerData={headerData}
        data-aid='digilocker-screen'
      >
        <div className="digi-status" data-aid='digi-status'>
          <img
            src={ require(`assets/${productName}/ils_digilocker_${status}.svg`)}
            style={{width:"100%"}}
            alt="Digilocker Status" 
          />
          {status === "success" ? 
            <div className="digi-status-text" data-aid='digi-status-text'>
                <strong>Digilocker is now linked!</strong> Complete remaining steps to start investing
            </div>
            :
            <Fragment>
                <div className="digi-status-text" data-aid='digi-status-text'>
                    Aadhaar KYC has been failed because we were not able to connect to your Digilocker.
                </div>
                <div className="digi-desc">
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
