import React, { Component } from "react";
import Container from "../../common/Container";
import Api from "utils/api";
import toast from "../../../common/ui/Toast";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { ghGetMember } from "../../constants";
import HowToSteps from "../../../common/ui/HowToSteps";
import Checkbox from "../../../common/ui/Checkbox";
import {
  inrFormatDecimal,
  numDifferentiationInr,
  storageService,
} from "utils/validators";
import Grid from "material-ui/Grid";
import scrollIntoView from 'scroll-into-view-if-needed';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { openInBrowser, openPdf } from "./common_data";
import ReactResponsiveCarousel from "../../../common/ui/carousel";
import { getGhProviderConfig } from "./constants";
import {  setLocalProviderData } from "./common_data";
import MoreInfoAccordian from "../../../common/ui/MoreInfoAccordian";
import GenericImageSlider from "../../../common/ui/GenericImageSlider";
import {insuranceTypeMapper} from './constants';

const screen_name = "landing_screen";


class GroupHealthLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      productName: getConfig().productName,
      provider: this.props.match.params.provider,
      checked: true,
      offerImageData: [],
      whats_not_covered: [],
      whats_covered: [],
      quoteResume: {},
      common: {},
      screen_name: screen_name,
      selectedIndex: 0,
      providerConfig: getGhProviderConfig(this.props.match.params.provider),
      card_swipe_count: 0,
      tncChecked: false,
      isiOS: false,
    };
    this.openInBrowser = openInBrowser.bind(this);
    this.openPdf = openPdf.bind(this);
    this.setLocalProviderData = setLocalProviderData.bind(this);
  }
  componentWillMount() {
    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {};
    let screenData = this.state.providerConfig[screen_name];
    nativeCallback({ action: "take_control_reset" });
    let stepsContentMapper = {
      title: `Get insured with ease`,
      options: [
        {
          icon: "icn_hs_no_document",
          title: "No document required",
          subtitle: "Quick and paperless process",
        },
        {
          icon: "icn_hs_assistance",
          title: "Complete assistance",
          subtitle: "Our experts will help in purchase and claim",
        },
        {
          icon: "icn_hs_payment",
          title: "Secure payment",
          subtitle: "Smooth and secure online payment process",
        },
      ],
    };

    this.setState({
      stepsContentMapper: stepsContentMapper,
      offerImageData: screenData.offerImageData,
      whats_covered: screenData.whats_covered,
      whats_not_covered: screenData.whats_not_covered,
      screenData: screenData,
      openModuleData: openModuleData,
    });
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Dismiss'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  async componentDidMount() {
   this.onload()
  }

  onload = async() =>{
    this.setErrorData("onload");
    this.setState({ skelton: true });
    let error = "";
    let errorType = "";
    let openModuleData = this.state.openModuleData || {};
    const provider =  this.state.providerConfig.provider_api
    const body = {"provider": provider};
    try {
      const res = await Api.post(
        `api/insurancev2/api/insurance/health/quotation/account_summary`,
        body
      );
        
      let resultData =  res.pfwresponse.result;
      resultData['details_doc'] = res.pfwresponse.result.policy_brochure
      resultData['tnc'] = res.pfwresponse.result.terms_and_condition
      let lead = {};
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          skelton: false,
        });
        lead = resultData.quotation || {};
    
        lead.member_base = [];
        if (resultData.quotation.id) { 
          lead.member_base = ghGetMember(lead, this.state.providerConfig);
        }
        var resume_account_type = insuranceTypeMapper(lead.insurance_type);
        if(this.state.provider === 'GMC'){
          var premium_payment_frequency  = lead.payment_frequency === 'YEARLY' ? 'year': 'month';
        }
        
      } else {
        error = resultData.error || resultData.message || true;
      }
      this.setState(
        {
          common: resultData,
          quoteResume: lead,
          applicationData : resultData.application || {},
          resume_account_type: resume_account_type,
          premium_payment_frequency: premium_payment_frequency || ''
        },
        () => {
          if (openModuleData.sub_module === "click-resume") {
            if (!this.state.quoteResume || !this.state.quoteResume.id) {
              this.setState({ skelton: false });
            } else {
              this.handleResume();
            }
          }
        }
      );
    } catch (err) {
      error = true;
      errorType = "crash";
    }
    if (error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error,
            type: errorType
          },
          showError: "page",
        });
      }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };
  handleClick = () => {
    if(!this.state.tncChecked){
      toast('Please Agree to the Terms and Conditions');
      this.handleScroll();
      return;
    }

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData_' + this.state.providerConfig.key) || {};
    let post_body = groupHealthPlanData.post_body;
    if(post_body){
      delete post_body['quotation_id'];
      groupHealthPlanData.post_body  = post_body;
      this.setLocalProviderData(groupHealthPlanData);
    }
    
  
    this.sendEvents("next");
    storageService().setObject("resumeToPremiumHealthInsurance", false);
    this.navigate(this.state.providerConfig.get_next[screen_name]);
  };
  
  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "health_insurance",
      properties: {
        user_action: user_action,
        product: this.state.providerConfig.provider_api,
        screen_name: "introduction",
        coverage_overview_click: `${
          this.state.whats_covered_clicked ? "what is covered," : ""
        } ${this.state.whats_not_covered_clicked ? "what is not covered" : ""}`,
        things_to_know: data.things_to_know || data.more_info || "",
        benifits_carousel: this.state.selectedIndex + 1,
        resume_clicked: this.state.resume_clicked ? "yes" : "no",
      },
    };
    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  handleResume = () => {
    if (!this.state.quoteResume || !this.state.quoteResume.id) {
      return;
    }
    this.setState(
      {
        resume_clicked: true,
      },
      () => {
        this.sendEvents("next");
        let quoteResume = this.state.quoteResume;
        storageService().set("ghs_ergo_quote_id", quoteResume.id);
        if(this.state.applicationData.status === 'move_to_payment' || this.state.applicationData.status === 'ready_for_payment'){
          storageService().set("health_insurance_application_id", this.state.applicationData.id);
          this.navigate("final-summary");
        } else {
          storageService().setObject("resumeToPremiumHealthInsurance", true);
          this.navigate(`plan-premium-summary`);
        }
      }
    );
  };
  openFaqs = () => {
    this.sendEvents("next", { things_to_know: "faq" });
    let renderData = this.state.screenData.faq_data;
    this.props.history.push({
      pathname: "/gold/common/render-faqs",
      search: getConfig().searchParams,
      params: {
        renderData: renderData,
      },
    });
  };
  carouselSwipe_count = (index) => {
    this.setState({
      selectedIndex: index,
      card_swipe: "yes",
      card_swipe_count: this.state.card_swipe_count + 1,
    });
  };

  handleTermsAndConditions = () =>{
    this.setState({
      tncChecked : !this.state.tncChecked
    });
  }

  handleScroll = () => {
    setTimeout(function () {
        let element = document.getElementById('agreeScroll');
        if (!element || element === null) {
            return;
        }

        scrollIntoView(element, {
            block: 'start',
            inline: 'nearest',
            behavior: 'smooth'
        })

    }, 50);
  }

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}        
        title={this.state.providerConfig.title}
        fullWidthButton={true}
        buttonTitle={
          this.state.quoteResume && this.state.quoteResume.id
            ? "GET A NEW QUOTE"
            : "GET INSURED"
        }
        onlyButton={true}
        handleClick={() => this.handleClick()}
        provider={this.state.provider}
        force_hide_inpage_title={true}
      >
        <div className="health-insurance-title-container">
          <div>
            <div className="common-top-page-title-dark">{this.state.providerConfig.title}</div>
            <div className="common-top-page-subtitle-dark" style={{marginBottom : '17px', marginTop: '-10px'}} >
              {this.state.providerConfig.subtitle}
            </div>
        </div>
            <div className="title-image">
                <img src={require(`assets/${this.state.providerConfig.logo_card}`)} alt=""/>
            </div>
        </div>

        <div className="group-health-landing">
          <div style={{ margin: "0 0 0 0", cursor: "pointer" }}>
            <ReactResponsiveCarousel
              CarouselImg={this.state.offerImageData}
              callbackFromParent={this.carouselSwipe_count}
              selectedIndexvalue={this.state.selectedIndex}
            />
          </div>

          {this.state.quoteResume && this.state.quoteResume.id && (
            <div className="resume-card" onClick={() => this.handleResume()}>
              <div className="rc-title" style={{fontSize: '16px', fontWeight: '500'}}>Recent activity</div>

              <div className="rc-tile" style={{ marginBottom: 0 }}>
                <div className="rc-tile-left">
                  <div className="">
                    <img
                      src={require(`assets/${this.state.providerConfig.logo_cta}`)}
                      alt=""
                    />
                  </div>
                  <div className="rc-tile-premium-data">
                    <div className="rct-title" style={{color: '#767E86'}}>
                      {this.state.providerConfig.key === "HDFCERGO" ? this.state.providerConfig.hdfc_plan_title_mapper[this.state.quoteResume.plan_id]: this.state.providerConfig.subtitle}
                    </div>
                    <div className="rct-subtitle">
                      {inrFormatDecimal(this.state.quoteResume.total_premium)}{this.state.provider === 'GMC' ?<span>/{this.state.premium_payment_frequency}</span>: null}
                    </div>
                    <div className="insurance-type">
                        For: {this.state.resume_account_type}
                    </div>
                  </div>
                </div>

                <div className="generic-page-button-small" style={{height: '40px'}}>RESUME</div>
              </div>

              <div className="rc-bottom flex-between">
                <div className="rcb-content">
                  Sum insured:{" "}
                  {numDifferentiationInr(this.state.quoteResume.individual_sum_insured)}
                </div>
                <div className="rcb-content">
                  Cover period: {this.state.quoteResume.tenure} year
                  {this.state.quoteResume.tenure > "1" && <span>s</span>}
                </div>
              </div>
            </div>
          )}

          <div className="generic-page-title health-landing-covers-title" style={{ margin: "26px 0 0 0", fontSize: '15px', fontWeight: '700' }}>
            {this.state.providerConfig.covers_text.title}
          </div>
          <div
            className="generic-page-subtitle health-landing-covers-subtitle"
            style={{ margin: "10px 0 0 0" }}
          >
            {this.state.providerConfig.covers_text.subtitle}
          </div>

          <div className="family-images" style={{ margin: "15px 0 15px 0", display: 'start', justifyContent: `${this.state.providerConfig.key === 'GMC' ? 'start' : 'space-between'}`}}>
            
            {this.state.providerConfig.member_assets.map((item, index) =>{
              return <img
              className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/${item}`)}
              alt=""
              style={{marginRight: `${this.state.providerConfig.key === 'GMC' ? '15px' : '0'}`}}
            />
            })}
          </div>

          <div
            className="generic-page-title"
            style={{ margin: "40px 0 20px 0" }}
          >
            Plan overview
          </div>

          <MoreInfoAccordian 
            parent={this} 
            key="whats_covered" 
            title="What is covered?" 
            data={this.state.whats_covered}
          />
          <MoreInfoAccordian 
            parent={this} 
            key="whats_not_covered" 
            title="What is not covered?" 
            data={this.state.whats_not_covered}
          />
          
          <GenericImageSlider title="Key benefits" image_list={this.state.screenData.image_list}/>

          <HowToSteps
            style={{ margin: "20px 0px 0px 0px" }}
            baseData={this.state.stepsContentMapper}
          />

          <div
            className="generic-page-title"
            style={{ margin: "4px 0 20px 0" }}
          >
            Things to know
          </div>
          <div className="generic-hr"></div>
          <div className="flex faq" onClick={() => this.openFaqs()}>
            <div>
              <img
                className="accident-plan-read-icon"
                src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                alt=""
              />
            </div>
            <div>Frequently asked questions</div>
          </div>
          <div className="generic-hr" style={{ margin: "0px 0 40px 0" }}></div>

            <div
            className="accident-plan-read"
            style={{ padding: 0, margin: "20px 0 16px 0" }}
            onClick={() =>this.openPdf(this.state.common.details_doc, "read_document")}
            >
            <img
              className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_read.svg`)}
              alt=""
            />
            <div
              className="accident-plan-read-text"
              style={{ color: getConfig().primary }}
            >
              Read full-policy description
            </div>
          </div>
          <div
            className="CheckBlock2 accident-plan-terms"
            style={{ padding: 0, margin : '10px 0px 34px 0px' }}
          >
          <div id="agreeScroll">
                <Checkbox
                  defaultChecked
                  checked={this.state.tncChecked}
                  color="default"
                  value="checked"
                  name="checked"
                  handleChange={this.handleTermsAndConditions}
                  className="Checkbox"
                />
                <div className="accident-plan-terms-text" style={{}}>
                  I accept{" "}
                   <span
                    onClick={() =>
                      this.openPdf(this.state.common.tnc, "tnc")
                    }
                    className="accident-plan-terms-bold"
                    style={{ color: getConfig().primary, textDecoration: 'underline' }}
                  >
                    Terms and conditions
                  </span> 
                </div>
          </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default GroupHealthLanding;