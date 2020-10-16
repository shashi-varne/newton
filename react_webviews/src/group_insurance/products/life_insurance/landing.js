import React, { Component } from "react";
import Container from "../../common/Container";

import Api from "utils/api";
import toast from "../../../common/ui/Toast";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { ghGetMember } from "../../constants";
import HowToSteps from "../../../common/ui/HowToSteps";
import Checkbox from "material-ui/Checkbox";
import {
  inrFormatDecimal,
  numDifferentiationInr,
  storageService,
} from "utils/validators";
import Grid from "material-ui/Grid";
import SVG from "react-inlinesvg";
import down_arrow from "assets/down_arrow.svg";
import up_arrow from "assets/up_arrow.svg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { openInBrowser } from './common_data';
import {fyntuneConstants} from './constants';
import StepsToFollow from './stepsToFollow';

class FyntuneLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      stepsContentMapper: fyntuneConstants.stepsContentMapper,
      stepsToFollow: fyntuneConstants.stepsToFollow,
      faq_data: fyntuneConstants.faq_data
    };
  }

  handleClick = () => {
    console.log("To be done");
  };

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

  openFaqs = () => {
    // this.sendEvents("next", { things_to_know: "faq" });
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
        // events={this.sendEvents('just_set_events')}
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
        <div>
          <p className="heading">What are Insurance Savings Plan?</p>
          <p className="info">
            This is a plan for your investment cum insurance needs which
            provides you with a chance to create wealth and even gives financial
            security to your loved ones in case on any unforeseen event.
          </p>
        </div>

        <p className="heading">Major Benifits</p>
        <div className="his">
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
             return <StepsToFollow key={step.key} keyId={step.key} title={step.title} subtitle={step.subtitle} />
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
