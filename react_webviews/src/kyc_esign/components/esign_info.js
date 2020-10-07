import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import toast from '../../common/ui/Toast';
import Api from '../../utils/api';

class ESignInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
    }
  }

  handleBack = () => {
    nativeCallback({ action: 'exit_web' });
  }

  handleClick = async () => {
    const redirectUrl = "https://app.fisdom.com/#/kyc-esign/nsdl";
    // this.sendEvents('next');
    this.setState({showLoader: true});
    
    try {
        let res = await Api.get(`/api/kyc/formfiller2/kraformfiller/upload_n_esignlink?kyc_platform=app&redirect_url=${redirectUrl}`);
        var resultData = res.pfwresponse.result;
        console.log(resultData);
        this.setState({showLoader: false});
    } catch(err) {
        console.log(err)
        this.setState({
            show_loader: false
        });
        toast('Something went wrong');
    }
  }

//   sendEvents(user_action) {
//     let eventObj = {
//       "event_name": 'e-mandate',
//       "properties": {
//         "user_action": user_action,
//         "screen_name": 'set_up_easy_sip'
//       }
//     };

//     if (user_action ===sendEvents(user_action) {
//     let eventObj = {
//       "event_name": 'e-mandate',
//       "properties": {
//         "user_action": user_action,
//         "screen_name": 'set_up_easy_sip'
//       }
//     };

//     if (user_action === 'just_set_events') {
//       return eventObj;
//     } else {
//       nativeCallback({ events: eventObj });
//     }
//   } 'just_set_events') {
//       return eventObj;
//     } else {
//       nativeCallback({ events: eventObj });
//     }
//   }

  render() {
    const {show_loader, productName} = this.state;
    const headerData = {
      icon: "close",
      goBack: this.handleBack
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
