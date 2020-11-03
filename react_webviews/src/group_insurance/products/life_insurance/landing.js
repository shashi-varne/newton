import React, { Component } from "react";
import Container from "../../common/Container";

import Api from "utils/api";
import toast from "../../../common/ui/Toast";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import HowToSteps from "../../../common/ui/HowToSteps";
import {fyntuneConstants} from './constants';
import StepsToFollow from '../../../common/ui/stepsToFollow';

class FyntuneLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      stepsContentMapper: fyntuneConstants.stepsContentMapper,
      stepsToFollow: fyntuneConstants.stepsToFollow,
      faq_data: fyntuneConstants.faq_data,
      logo_cta: fyntuneConstants.logo_cta
    };
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  async componentDidMount(){

    // we get resume_data from API call
    var resume_data = res_resume.pfwresponse.result;
    this.setState({resume_data: resume_data})
}

  handleClick = () => {
    this.sendEvents("next");
  
  //we get the below data from API call  
  var res = res_lead.pfwresponse.result;
  var new_quote_redirection_url = this.state.res.redirection_url;

  if(res.resume_present){
    toast(`Already payment done for the previous journey`);
    return;

  }else if(getConfig().Web){
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: new_quote_redirection_url,
      },
    });

  }else{
    let back_url = encodeURIComponent(
      window.location.origin + `/group-insurance/life-insurance/resume-intermediate` + getConfig().searchParams
    );
    nativeCallback({
      action: 'open_inapp_tab',
      message: {
          url: new_quote_redirection_url || '',
          back_url: back_url || ''
      }
    });
  }
};


  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "life_insurance_savings",
      properties: {
        user_action: user_action,
        product: fyntuneConstants.provider_api,
        screen_name: "introduction",
        faq: data.faq ? "yes": "no", 
        resume_click: data.resume_clicked ? "yes" : "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  renderOfferImages = (props, index) => {
    return (
      <div key={index} className="gold-offer-slider">
        <img
          className="offer-slide-img"
          src={require(`assets/${props.src}`)}
          alt="Gold Offer"
        />
      </div>
    );
  };

  handleResume = () => {
    if (!this.state.resume_data.resume_present) {
      return;
    }
    this.sendEvents("next", {resume_clicked: "yes"});
    var resume_redirection_url = this.state.resume_data.redirection_url;

    if(getConfig().Web){
      nativeCallback({
        action: 'open_in_browser',
        message: {
          url: resume_redirection_url,
        },
      });
    }else{
    let back_url = encodeURIComponent(
      window.location.origin + `/group-insurance/life-insurance/resume-intermediate` + getConfig().searchParams
    );

    nativeCallback({
      action: 'open_inapp_tab',
      message: {
          url: resume_redirection_url || '',
          back_url: back_url || ''
      }
    });
    }

  };


  openFaqs = () => {

    // this.setState({ faq_clicked: true}, ()=>{
    //   this.sendEvents("next");
    // })
    this.sendEvents("next", { faq: "yes" });
    let renderData = this.state.faq_data;

    this.props.history.push({
      pathname: "/gold/common/render-faqs",
      search: getConfig().searchParams,
      params: {
        renderData: renderData,
      },
    });
    
  };

  render() {

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        // showLoader={this.state.show_loader}
        title="Insurance Savings Plan"
        fullWidthButton={true}
        buttonTitle="GET INSURED"
        // hide_header={true}
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
      <div className="fyntune-landing">
        <div className="landing-hero-container">
            <img
                className="landing-hero-img"
                src={require(`assets/${this.state.productName}/fyntune_landing_page_hero.png`)}
                alt=""
              />
        </div>

        {/* { this.state.resume_data.resume_present && ( */}
          { true && (
            <div className="resume-card" onClick={() => this.handleResume()}>
              <div className="rc-title">Recent activity</div>

              <div className="rc-tile" style={{ marginBottom: 0 }}>
                <div className="rc-tile-left">
                  <div className="">
                    <img
                      src={require(`assets/${this.state.logo_cta}`)}
                      alt=""
                    />
                  </div>
                  <div className="rc-tile-premium-data">
                    <div className="rct-title">
                      {/* {this.state.quoteResume.plan_title} */}
                      Click 2 Invest
                    </div>
                    <div className="rct-subtitle">
                      {/* {inrFormatDecimal(this.state.quoteResume.total_amount)} */}
                      Plan Amount / per year
                    </div>
                  </div>
                </div>

                <div className="generic-page-button-small">RESUME</div>
              </div>

              <div className="rc-bottom flex-between">
                <div className="rcb-content">
                  Sum insured:{" "}
                  {/* {numDifferentiationInr(this.state.quoteResume.sum_assured)} */}
                  Sum rupees
                </div>
                <div className="rcb-content">
                  {/* Cover period: {this.state.quoteResume.tenure} year */}
                  Cover period x year
                  {/* {this.state.quoteResume.tenure > "1" && <span>s</span>} */}
                </div>
              </div>
            </div>
          )}
        <div>
          <p className="heading">What are Insurance Savings Plan?</p>
          <p className="info">
            This is a plan for your investment cum insurance needs which
            provides you with a chance to create wealth and even gives financial
            security to your loved ones in case on any unforeseen event.
          </p>
        </div>

          {/* TODO: add event to this carousel */}
        <p className="heading">Major Benifits</p>
        <div className="his" >
          <div className="horizontal-images-scroll">
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn1.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn2.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn3.png`)}
              alt=""
            />
          </div>
        </div>

         <p className="heading">Get your plan in 5 easy steps</p>
         {
           this.state.stepsToFollow.map( (step) =>{
             return <StepsToFollow key={index + 1} keyId={index + 1} title={step.title} subtitle={step.subtitle} />
           })
         }
         

        <div style={{ transform: "translateY(-50px)", marginBottom: "0px" }}>
          <p className="heading" style={{ transform: "translateY(65px)" }}>
            We make this process easy with
          </p>
          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.stepsContentMapper}
          />
        </div>

        <div className="faq-section" style={{ transform: "translateY(-50px)" }}>
          <div className="generic-hr" style={{ marginBottom: "12px" }}></div>
          <div className="flex-center faq" onClick={() => this.openFaqs()}>
            <div>
              <img
                className="accident-plan-read-icon"
                src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                alt=""
              />
            </div>
            <div>Frequently asked questions</div>
          </div>
          <div className="generic-hr" style={{ marginTop: "12px" }}></div>
        </div>
      </div>
      </Container>
    );
  }
}

export default FyntuneLanding;
