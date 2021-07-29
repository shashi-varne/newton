import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig, getBasePath, navigate as navigateFunc } from 'utils/functions';
import toast from '../../common/ui/Toast';
import Api from '../../utils/api';
import ConfirmBackModal from './confirm_back'
import { storageService } from "../../utils/validators";
import { isEmpty } from "../../utils/validators";
import { isIframe } from '../../utils/functions';
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
      productName: getConfig().productName || 'fisdom',
      backModal: false,
      dl_flow: false,
      showAadharDialog: false,
    }

    this.navigate = navigateFunc.bind(props);
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    const kyc = storageService().getObject("kyc");
    if (!isEmpty(kyc)) {
      if (
        kyc.kyc_status !== "compliant" &&
        !kyc.address.meta_data.is_nri &&
        kyc.dl_docs_status !== "" &&
        kyc.dl_docs_status !== "init" &&
        kyc.dl_docs_status !== null
      ) {
        this.setState({ dl_flow: true });
      }
    }
  };

  handleBack = () => {
    this.setState({ backModal: true })
  }

  confirm = () => {
    const navigate = navigateFunc.bind(this.props);
    navigate('/kyc/journey');
  }

  cancel = () => {
    this.setState({ backModal: false })
  }

  closeAadharDialog = () => {
    this.setState({showAadharDialog: false})
  }

  handleClick = async () => {
    this.sendEvents('next','e sign kyc')
    let basepath = getBasePath();
    const redirectUrl = encodeURIComponent(
      basepath + '/kyc-esign/nsdl' + getConfig().searchParams
    );

    this.setState({ show_loader: "button" });

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
          action: 'take_back_button_control', message: {
            back_text: 'You are almost there, do you really want to go back?'
          }
        });
        window.location.href = resultData.esign_link;
      } else {
        if (resultData && resultData.error === "all documents are not submitted") {
          toast("Document pending, redirecting to kyc");
          setTimeout(() => {
            if (this.state.dl_flow) {
              this.navigate('/kyc/journey', {
                state: {
                  show_aadhaar: true,
                }
              });
            } else {
              this.navigate('/kyc/journey');
            }
          }, 3000)
        } else {
          toast(resultData.error ||
            resultData.message || 'Something went wrong', 'error');
        }
      }

      this.setState({ show_loader: false });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  sendEvents = (userAction, screenName) => {
    const kyc = storageService().getObject("kyc");
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "" ,
        "screen_name": screenName || "",
        "rti": "",
        "initial_kyc_status": kyc.initial_kyc_status || "",
        "flow": 'digi kyc'
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
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
        events={this.sendEvents("just_set_events")}
        showLoader={show_loader}
        title='eSign KYC'
        handleClick={this.handleClick}
        buttonTitle='PROCEED'
        headerData={headerData}
        iframeRightContent={require(`assets/${productName}/esign-kyc.svg`)}
        data-aid='kyc-esign-screen'
      >
        {
          !isIframe() &&
            <div className="esign-image">
              <img
                src={require(`assets/${productName}/ils_esign_kyc.svg`)}
                style={{ width: "100%" }}
                alt="eSign KYC icon"
                />
            </div>
        }
        <div className="esign-desc" data-aid='esign-desc'>
          eSign is an online electronic signature service by UIDAI to facilitate <strong>Aadhaar holder to digitally sign</strong> documents.
        </div>
        <div className="esign-subtitle" data-aid='esign-subtitle'>How to eSign documents</div>
        <div className="esign-steps" data-aid='esign-steps'>
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? otp_img_finity :otp_img_fisdom} alt="Verify OTP" />
            </div>
            <div className="step-text" data-aid='step-text-1'>
              1. Verify mobile and enter Aadhaar number
                </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? esign_otp_img_finity :esign_otp_img_fisdom} alt="Esign OTP icon" />
            </div>
            <div className="step-text" data-aid='step-text-2'>
              2. Enter OTP recieved on your Aadhaar linked mobile number
                </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <img src={getConfig().productName !== 'fisdom' ? done_img_finity :done_img_fisdom} alt="Esign Done icon" />
            </div>
            <div className="step-text" data-aid='step-text-3'>
              3. e-Sign is successfully done
                </div>
          </div>
          <div className="esign-bottom" data-aid='esign-bottom'>
            <div className="bottom-text">
              Initiative by
                </div>
            <div className="bottom-image">
              <img src={require("assets/ic_gov_meit.svg")} alt="Gov Meit icon" />
            </div>
          </div>
        </div>
        <ConfirmBackModal id="kyc-esign-confirm-modal" open={this.state.backModal} cancel={this.cancel} confirm={this.confirm} />
      </Container>
    );
  };
}

export default ESignInfo;
