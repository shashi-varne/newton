import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import PartnerCard from "./partner_card";

class SelectLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "select_loan_screen",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.props.location || {};
    if (!params || !params.selectedVendors) {
      this.props.history.goBack();
      return;
    }

    let selectedVendors = params ? params.selectedVendors : [];

    let vendors_data = {
      idfc: {
        index: 0,
        title: "IDFC FIRST BANK",
        subtitle: "Competetive intrest rate",
        loan_amount: " ₹40 lac",
        logo: "idfc_logo",
        cta_title: "APPLY NOW",
        card_tag: "Recommended",
        displayTag: true,
        benefits: {
          benefits_title: "Basic benefits",
          options: [
            {
              data: "Loan up to 40 lakhs:",
              sub_data: [
                "For salaried, the range is from Rs. 1 lakh to 40 lacs",
                "For self-employed the max loan amount is Rs. 9 lacs",
              ],
            },
            "Low interest rate starting at 10.75% p.a.",
            "Flexible loan tenure min 12 months to max 60 months",
            "Option of ‘balance transfer’ at attractive rates",
            "Loan sanction in less than 4 hrs",
            "100% digital with easy documentation",
            "Top-up facility to avail extra funds on the existing loan% digital with easy documentation",
          ],
        },
      },
      dmi: {
        index: 1,
        title: "DMI Finance",
        subtitle: "Quick disbursal",
        loan_amount: " ₹1 lac",
        logo: "dmi-finance",
        cta_title: "APPLY NOW",
        benefits: {
          options: [
            "Complete Digital and Presenceless process",
            "You don't have to provide any security money for your loan",
          ],
        },
      },
    };

    let stepContentMapper = [];

    selectedVendors.forEach((item) => {
      stepContentMapper.push(vendors_data[item]);
    });

    let selectedIndexs = [];

    stepContentMapper.forEach(() => {
      selectedIndexs.push(false);
    });

    this.setState({
      stepContentMapper: stepContentMapper,
      selectedIndexs: selectedIndexs,
    });
  }

  handleBenefits = (index) => {
    let { selectedIndexs } = this.state;
    selectedIndexs[index] = !this.state.selectedIndexs[index];
    this.setState({ selectedIndexs: selectedIndexs });
  };

  handleClick = () => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select loan provider"
        noFooter={true}
      >
        <div className="select_loan">
          {this.state.stepContentMapper.map((item, index) => {
            return (
              <PartnerCard
                key={index}
                baseData={item}
                handleBenefits={this.handleBenefits}
                handleClick={this.handleClick}
                isSelected={this.state.selectedIndexs[index]}
              />
            );
          })}
        </div>
      </Container>
    );
  }
}

export default SelectLoan;
