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

class FyntuneLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
    };
  }

  componentWillMount() {
    let stepsContentMapper = {
      // title: `We make this process easy with`,
      options: [
        {
          icon: "icn_hs_no_document",
          title: "No document required",
          subtitle: "Easy and paperless process",
        },
        {
          icon: "icn_hs_assistance",
          title: "Complete assistance",
          subtitle: "Our experts will help in purchase and claim of policy",
        },
        {
          icon: "icn_hs_payment",
          title: "Secure payment",
          subtitle: "Smooth and secure online payment process",
        },
      ],
    };

    let stepsToFollow = [
      {
        key: "1",
        title: "Get free quotes",
        subtitle: "To start, enter a few details & get free quotes",
      },
      {
        key: "2",
        title: "Complete application form",
        subtitle: "Now select a plan you like and fill up an application form",
      },
      {
        key: "3",
        title: "Make payment",
        subtitle: "Make your first payment securely",
      },
      {
        key: "4",
        title: "Answer medical and lifestyle questions",
        subtitle: "Help us with a few answers to evaluate your application",
      },
      {
        key: "5",
        title: "Upload and request documents",
        subtitle:
          "Lastly, upload all the required documents and you're good to go",
      },
    ];

    this.setState({
      stepsContentMapper: stepsContentMapper,
    });
  }

  handleClick = () => {
    console.log("CTA CLICKED");
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
              src={require(`assets/${this.state.productName}/ic_why_hs.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_hs2.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_hs3.png`)}
              alt=""
            />
          </div>
        </div>

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
      </Container>
    );
  }
}

export default FyntuneLanding;
