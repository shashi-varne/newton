import React, { Component } from "react";
import Container from "../common/container";
import { initialize } from "../common/functions";
import HowToSteps from "../../common/ui/HowToSteps";
import JourneySteps from "../../common/ui/JourneySteps";

class IdfcKnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "idfc_know_more_screen",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let salariedEligibility = {
      title: "Eligibility criteria",
      options: [
        {
          icon: "icn_b1_m",
          subtitle:
            "Must be earning a minimum net monthly salary of Rs. 20,000",
        },
        {
          icon: "icn_b2_m",
          subtitle: "Should at least be 23 years of age",
        },
        {
          icon: "icn_b3_m",
          subtitle:
            "Maximum age at the time of loan maturity should not be >60 years ",
        },
      ],
    };

    let selfEmployeeEligibility = {
      title: "Eligibility criteria",
      options: [
        {
          icon: "icn_b2_m",
          subtitle: "Should at least be 23 years of age",
        },
        {
          icon: "icn_b3_m",
          subtitle:
            "Maximum age at the time of loan maturity should not be >65 years",
        },
        {
          icon: "icn_b4_m",
          subtitle: "Business must be in operations for at least 3 years",
        },
        {
          icon: "Group 9964",
          subtitle:
            "You must be managing your business from the same office premises for at least a year",
        },
      ],
    };

    let partnerData = {
      title: "IDFC FIRST BANK",
      subtitle: "Competetive intrest rate",
      loan_amount: " ₹40 lac",
      logo: "idfc_logo",
    };

    let journeyData = {
      title: "Personal loan in just 5 steps",
      options: [
        {
          step: "1",
          title: "Enter basic details",
          subtitle:
            "Fill in basic and work details to get started with your loan application.",
        },
        {
          step: "2",
          title: "Create loan application",
          subtitle:
            "Provide/confirm your personal and address details to proceed with your loan application.",
        },
        {
          step: "3",
          title: "Provide income details",
          subtitle:
            "Enter your loan requirements and income details to get the best loan offer.",
        },
        {
          step: "4",
          title: "Upload documents",
          subtitle:
            "Provide your office address and upload documents to get your loan sanctioned.",
        },
        {
          step: "5",
          title: "Sanction and disbursal",
          subtitle:
            "IDFC FIRST Bank will verify your application and will get in touch with you to complete the disbursal process.",
        },
      ],
    };

    let employement_type = "salaried";
    let eligibility = {};
    {
      employement_type !== "salaried"
        ? (eligibility = salariedEligibility)
        : (eligibility = selfEmployeeEligibility);
    }

    this.setState({
      partnerData: partnerData,
      journeyData: journeyData,
      eligibility: eligibility,
    });
  }

  handleClick = () => {};

  render() {
    let { partnerData, eligibility, journeyData } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Know more"
        buttonTitle="APPLY NOW"
        handleClick={this.handleClick}
      >
        <div className="loan-know-more">
          <div className="block1-info">
            <div className="partner">
              <div>
                <div>{partnerData.title}</div>
                <div>{partnerData.subtitle}</div>
              </div>
              <img
                src={require(`assets/${partnerData.logo}.svg`)}
                alt="idfc logo"
              />
            </div>
            <div className="sub-text">Apply for loan up to</div>
            <div className="loan-amount">{partnerData.loan_amount}</div>
          </div>

          <JourneySteps static={true} baseData={journeyData} />

          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={eligibility}
          />

          <div className="generic-hr"></div>
          <div className="Flex block2">
            <img
              className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/document.svg`)}
              alt=""
            />
            <div className="title">Documents</div>
          </div>
          <div className="generic-hr"></div>
          <div className="Flex block2">
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

export default IdfcKnowMore;
