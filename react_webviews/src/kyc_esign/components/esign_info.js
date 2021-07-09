import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig, getBasePath } from 'utils/functions';
import toast from '../../common/ui/Toast';
import Api from '../../utils/api';
import otp_img_finity from 'assets/finity/ic_verify_otp_finity.svg';
import esign_otp_img_finity from 'assets/finity/ic_esign_otp_finity.svg';
import done_img_finity from  'assets/finity/ic_esign_done_finity.svg';
import otp_img_fisdom from 'assets/fisdom/ic_verify_otp_fisdom.svg';
import esign_otp_img_fisdom from 'assets/fisdom/ic_esign_otp_fisdom.svg';
import done_img_fisdom from  'assets/fisdom/ic_esign_done_fisdom.svg';



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
    let basepath = getBasePath();
    const redirectUrl = encodeURIComponent(
      basepath + '/kyc-esign/nsdl' + getConfig().searchParams
    );

    this.setState({ show_loader: true });

    try {
      let res = await Api.get(`/api/kyc/formfiller2/kraformfiller/upload_n_esignlink?kyc_platform=app&redirect_url=${redirectUrl}`);
      let resultData = res.pfwresponse.result;
      if (resultData && !resultData.error) {
        if (getConfig().app === 'ios') {
          nativeCallback({
            action: 'show_top_bar', message: {
              title: 'eSign KYC'
            }
          });
        }
        nativeCallback({
          action: 'take_control', message: {
            back_text: 'You are almost there, do you really want to go back?'
          }
        });
        window.location.href = resultData.esign_link;
      } else {
        toast(resultData.error ||
          resultData.message || 'Something went wrong', 'error');
      }

      this.setState({ show_loader: false });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  render() {
    const { show_loader, productName } = this.state;
    const headerData = {
      icon: "close",
      goBack: this.handleBack
    };

    return (
      <Container
        showLoader={show_loader}
        title='eSign KYC'
        handleClick={this.handleClick}
        buttonTitle='PROCEED'
        headerData={headerData}
      >
        <div className="esign-image">
          <img
            src={require(`assets/${productName}/ils_esign_kyc.svg`)}
            style={{ width: "100%" }}
            alt="eSign KYC icon"
          />
        </div>
        <div className="esign-desc">
          eSign is an online electronic signature service by UIDAI to facilitate <strong>Aadhaar holder to digitally sign</strong> documents.
        </div>
        <div className="esign-subtitle">How to eSign documents</div>
        <div className="esign-steps">
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? otp_img_finity :otp_img_fisdom} alt="Verify OTP" />
            </div>
            <div className="step-text">
              1. Verify mobile and enter Aadhaar number
                </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? esign_otp_img_finity :esign_otp_img_fisdom} alt="Esign OTP icon" />
            </div>
            <div className="step-text">
              2. Enter OTP recieved on your Aadhaar linked mobile number
                </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? done_img_finity :done_img_fisdom} alt="Esign Done icon" />
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
  };
}

export default ESignInfo;
