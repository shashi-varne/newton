import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import HowToSteps from "../../../common/ui/HowToSteps";
import JourneySteps from "../../../common/ui/JourneySteps";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";

class LoanKnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "main_landing_screen",
      partnerData: {},
      top_cta_title: "APPLY NOW",
      skelton: 'g',
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { screenData, provider } = this.state;

    this.setState({
      partnerData: screenData.loan_partners[provider].partnerData,
      journeyData: screenData.loan_partners[provider].journeyData,
      stepContentMapper: screenData.loan_partners[provider].stepContentMapper,
      faqsInfo: screenData.loan_partners[provider].faqsInfo,
      documents: screenData.loan_partners[provider].documents,
    });

    if (provider === 'idfc') {
      this.setState({
        top_cta_title:
          this.state.application_exists && this.state.otp_verified
            ? "RESUME"
            : "APPLY NOW",
        next_state:
          this.state.application_exists && this.state.otp_verified
            ? "journey"
            : "edit-number",
      });
    }
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getUserStatus,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.errorTitle,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_introduction",
      properties: {
        user_action: user_action,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  getNextState = () => {
    let dmi_loan_status = this.state.vendor_info.dmi_loan_status || '';
    let application_status = this.state.application_info.application_status || '';

    let state = '';
    if(this.state.process_done) {
      state = 'report-details';
    } else {
      if(this.state.location_needed) {//condition for mobile
        state = 'permissions';
      } else if(dmi_loan_status === 'application_rejected' || application_status === 'internally_rejected') {
        state = 'instant-kyc-status';
      }else {
        state = 'journey';
      }
    }

    return state;
  }

  handleClick = () => {
    this.sendEvents("next");
    let { provider } = this.state;

    if (provider === 'dmi') {
      let state =  this.getNextState();
      let rejection_reason = this.state.reason || '';
  
      if (state === 'instant-kyc-status') {
        let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
        this.navigate(`/loan/dmi/${state}`, {
          searchParams: searchParams,
          params: {
            rejection_reason: rejection_reason
          }
        });
      
      } else {
        this.navigate(`/loan/dmi/${state}`);
      }
    }

    if (provider === 'idfc') {
      let params = {
        create_new:
          this.state.application_exists && this.state.otp_verified ? false : true,
      };
  
      let { vendor_application_status, pan_status, is_dedupe, rejection_reason, perfios_status, application_status } = this.state;
  
      let rejection_cases = [
        "idfc_null_rejected",
        "idfc_0.5_rejected",
        "idfc_1.0_rejected",
        "idfc_1.1_rejected",
        "idfc_1.7_rejected",
        "idfc_4_rejected",
        "idfc_callback_rejected",
        "idfc_cancelled",
        "Age",
        "Salary",
        "Salary reciept mode"
      ];
  
      if (this.state.top_cta_title === "RESUME") {

        let application_complete = application_status === "application_complete";

        if (rejection_cases.indexOf(vendor_application_status || rejection_reason) !== -1 || is_dedupe) {
          this.navigate("loan-status");
        }
  
        if (rejection_cases.indexOf(rejection_reason) !== -1) {
          this.navigate("loan-status");
        }
  
        if (pan_status === '' || vendor_application_status === "pan") {
          this.navigate("basic-details");
        } else if (perfios_status === "failure") {
          this.navigate("perfios-status");
        } else if (rejection_cases.indexOf(vendor_application_status) === -1 && !is_dedupe && !application_complete) {
          this.navigate("journey");
        } else if (application_complete) {
          this.navigate('reports')
        }

      } else {
        this.getOrCreate(params);
      }
    }
  };

  openFaqs = () => {
    let { provider, faqsInfo } = this.state;
    let available_vendors = ['idfc', 'dmi'];

    if(!available_vendors.includes(provider)) {
      return;
    }

    this.sendEvents('faq')
    let renderData = {
      'header_title': faqsInfo.header_title,
      'header_subtitle': faqsInfo.header_subtitle,
      'steps': {
        'options': faqsInfo.faqs
      },
      'cta_title': faqsInfo.cta_title,
    }

    let path_name = provider === 'idfc' ? '/loan/idfc/faq' : '/gold/common/render-faqs';

    if(provider === 'idfc') {
      this.props.history.push({
        pathname: path_name,
        search: getConfig().searchParams,
      },{
        renderData: renderData
      });
    } else {
      this.props.history.push({
        pathname: path_name,
        search: getConfig().searchParams,
        params: {
          renderData: renderData
        }
      });
    }
  }

  goBack = () => {
    this.sendEvents('back')

    let neftBanks = this.props.location.state ? this.props.location.state.neftBanks : "";

    if (neftBanks === "select-loan") {
      this.navigate("/loan/select-loan")
    } else {
      this.navigate("/loan/home")
    }
  }

  render() {
    let { partnerData, stepContentMapper, journeyData, provider } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        buttonTitle={this.state.top_cta_title}
        hidePageTitle={true}
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
        headerData={{
          goBack: this.goBack,
        }}
      >
        <div className="loan-know-more">
          <div className="block1-info">
            <div className="partner">
              <div>
                <div style={{fontWeight:'600'}}>{partnerData.title}</div>
                <div>{partnerData.subtitle}</div>
              </div>
              {partnerData.logo && (
                <img
                  src={require(`assets/${partnerData.logo}.svg`)}
                  alt="logo"
                />
              )}
            </div>
            <div className="sub-text">Apply for loan up to</div>
            <div className="loan-amount">{partnerData.loan_amount}</div>
          </div>

          {journeyData && <JourneySteps static={true} baseData={journeyData} />}

          {stepContentMapper && (
            <HowToSteps
              style={{ marginTop: 20, marginBottom: 0 }}
              baseData={stepContentMapper}
            />
          )}

          {provider === "idfc" && (
            <>
              <div className="eligibility">
                <div className="generic-hr"></div>
                <div
                  className="Flex block2"
                  onClick={() => {
                    this.sendEvents("eligibility");
                    this.navigate("eligibility");
                  }}
                >
                  <img
                    className="accident-plan-read-icon"
                    src={require(`assets/${this.state.productName}/eligibility.svg`)}
                    alt=""
                  />
                  <div className="title">Eligibility</div>
                </div>
              </div>
              <div className="generic-hr"></div>
              <div
                className="Flex block2"
                onClick={() => {
                  this.sendEvents("documents");
                  this.navigate("documents");
                }}
              >
                <img
                  className="accident-plan-read-icon"
                  src={require(`assets/${this.state.productName}/document.svg`)}
                  alt=""
                />
                <div className="title">Documents</div>
              </div>
            </>
          )}
          
          <div className="generic-hr"></div>
          <div
            className="Flex block2"
            onClick={() => {
              this.openFaqs();
            }}
          >
            <img
              className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
              alt=""
            />
            <div className="title">Frequently asked questions</div>
          </div>
          <div className="generic-hr"></div>
        </div>
      </Container>
    );
  }
}

export default LoanKnowMore;
