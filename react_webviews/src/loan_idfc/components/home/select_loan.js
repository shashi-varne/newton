import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import PartnerCard from "./partner_card";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";

class SelectLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "select_loan_screen",
      skelton: "g",
      showError: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {

    let { selectedVendors, ongoing_loan_details } = this.state;
    let stepContentMapper = [];
    let status = [];

    if (selectedVendors.length === 0) {
      // this.navigate('home')
    }

    ongoing_loan_details.length !== 0 &&
      ongoing_loan_details.forEach((item) => status.push(item.vendor));

    let vendors_data = {
      idfc: {
        index: 0,
        title: "IDFC FIRST Bank",
        subtitle: "Competitive interest rate",
        loan_amount: " ₹40 lakhs",
        logo: "idfc_logo",
        cta_title: status.includes("idfc") ? "RESUME" : "APPLY NOW",
        displayTag: true,
        provider_name: "idfc",
        benefits: {
          options: [
            {
              data: "Loan up to ₹40 lakhs:",
              sub_data: [
                "For salaried, the range is from ₹1 lakh to ₹40 lakhs",
                "For self-employed, the range is from ₹1 lakh to ₹9 lakhs",
              ],
            },
            "Low interest rate starting at 10.75% p.a.",
            "Flexible loan tenure -- min 12 months to max 60 months",
            "Option of ‘balance transfer’ at attractive rates",
            "Loan sanction in less than 4 hrs",
            "100% digital with easy documentation",
            "Top-up facility to avail extra funds on the existing loan",
          ],
        },
      },
    };

    this.setState({
      vendors_data: vendors_data,
    });

    if (selectedVendors.length !== 2) {
      vendors_data.idfc.displayTag = false;
    }

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
      vendors_data: vendors_data,
    });
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getSummary,
          button_text1: "Retry",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  goBack = () => {
    this.sendEvents("back");
    let { loans_applied, dmi, idfc } = this.state;

    if (loans_applied === 0 && !dmi && !idfc) {
      this.navigate("edit-details");
    } else {
      this.navigate("home");
    }
  };

  handleBenefits = (index) => {
    this.setState({
      benefit_clicked: 'yes'
    })
    let { selectedIndexs } = this.state;
    selectedIndexs[index] = !this.state.selectedIndexs[index];
    this.setState({ selectedIndexs: selectedIndexs });
  };

  handleClick = (provider_name) => {
    let { vendors_data, ongoing_loan_details } = this.state;
    let resume =
      vendors_data[provider_name].cta_title === "RESUME" ? "yes" : "no";
    let vendor =
      ongoing_loan_details.find(
        (element) => element.vendor === provider_name
      ) || {};
    this.sendEvents("next", {
      provider_name: provider_name,
      status: vendor.status || "default",
      resume: resume,
    });

    this.props.history.push(
      {
        pathname: `/loan/${provider_name}/loan-know-more`,
        search: getConfig().searchParams,
      },
      { neftBanks: "select-loan" }
    );
  };

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "select_loan_provider",
      properties: {
        user_action: user_action,
        provider_name: data.provider_name || "",
        status: data.status || "default",
        resume: data.resume || "no",
        benefit_clicked: this.state.benefit_clicked || 'no',
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        // showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Select loan provider"
        noFooter={true}
        headerData={{
          goBack: this.goBack,
        }}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="select_loan">
          {this.state.stepContentMapper &&
            this.state.stepContentMapper.map((item, index) => {
              return (
                <PartnerCard
                  key={index}
                  baseData={item}
                  handleBenefits={() => this.handleBenefits(index)}
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
