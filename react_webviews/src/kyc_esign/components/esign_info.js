import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class ESignInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
    }
  }

  handleClick = () => {
    nativeCallback({ action: 'exit_web' });
  }

  render() {
    const {show_loader, productName} = this.state;
    const headerData = {
      icon: "close",
      goBack: this.handleClick
    }

    return (
      <Container
        showLoader={show_loader}
        title= 'eSign KYC'
        handleClick={this.handleClick}
        buttonTitle='PROCEED'
        headerData={headerData}
      >
        <div className="esign-image">
            <img
                src={ require(`assets/${productName}/ils_esign_kyc.svg`)}
                style={{width:"100%"}}
                alt="Digilocker Status" 
            />
        </div>
        <div className="esign-desc">
            eSign is an online electronic signature service by UIDAI to facilitate <strong>Aadhaar holder to digitally sign</strong> documents.
        </div>
        <div className="esign-subtitle">How to eSign documents</div>
        <div className="esign-steps">
            <div className="step">
                <div className="icon-container">
                    <img src={require(`assets/ic_verify_otp_${productName}.svg`)} alt="Verify OTP" />
                </div>
                <div className="step-text">
                    1. Verify mobile and enter Aadhaar number
                </div>
            </div>
            <div className="step">
                <div className="icon-container">
                    <img src={require(`assets/ic_esign_otp_${productName}.svg`)} alt="Esign OTP icon" />
                </div>
                <div className="step-text">
                    2. Enter OTP recieved on your Aadhaar linked mobile number
                </div>
            </div>
            <div className="step">
                <div className="icon-container">
                    <img src={require(`assets/ic_esign_done_${productName}.svg`)} alt="Esign Done icon"/>
                </div>
                <div className="step-text">
                    3. e-Sign is successfully done
                </div>
            </div>
            <div className="esign-bottom">
                <div className="bottom-text">
                    Initiative by
                </div>
                <div className="bottom-image">
                    <img src={require("assets/ic_gov_meit.svg")} alt="Gov Meit icon" />
                </div>
            </div>
        </div>
      </Container>
    );
  }
}

export default ESignInfo;
