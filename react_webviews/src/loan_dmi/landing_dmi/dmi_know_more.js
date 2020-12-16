import React, { Component } from "react";
import Container from "../common/container";
import { initialize } from "../common/functions";
import HowToSteps from "../../common/ui/HowToSteps";
import JourneySteps from "../../common/ui/JourneySteps";
import PartnerCard from "../components/partner_card";
import Button from "material-ui/Button";

class DmiKnowMore extends Component {
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

    let eligibility = {
      title: "Eligibility criteria",
      options: [
        {
          icon: "ic_why_loan1",
          subtitle: "Salaried and resident Indian citizens",
        },
        {
          icon: "ic_why_loan2",
          subtitle: "Age between 23 and 55 years",
        },
        {
          icon: "ic_why_loan3",
          subtitle:
            "Employed with a private, public limited company, or an MNC",
        },
      ],
    };

    let partnerData = {
      title: "DMI Finance",
      subtitle: "Quick money transfer",
      loan_amount: "₹1 lac",
      logo: "idfc_logo",
    };

    this.setState({
      partnerData: partnerData,
      eligibility: eligibility,
    });
  }

  handleClick = () => {};

  render() {
    let { partnerData, eligibility } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Know more"
        noFooter={true}
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

          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={eligibility}
          />

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

export default DmiKnowMore;
