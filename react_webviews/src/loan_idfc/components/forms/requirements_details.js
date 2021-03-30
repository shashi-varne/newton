import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropDownNew from "../../../common/ui/DropDownNew";
import {
  numDifferentiationInr,
  formatAmount,
} from "utils/validators";

class LoanRequirementDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      skelton: 'g',
      screen_name: "requirement_details_screen",
      loaderData: {},
      purposeOfLoanOptions: [],
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};

    let form_data = {
      amount_required: application_info.amount_required,
      tenor: !application_info.tenor ? "" : String(application_info.tenor),
    };

    let loaderData = {
      title: "Hang on while IDFC FIRST Bank evaluates your profile",
      subtitle: "It usually takes 1 minute!",
    };

    this.setState({
      form_data: form_data,
      loaderData: loaderData,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_loan_requirement_details",
      properties: {
        user_action: user_action,
        amount: this.state.form_data.amount_required,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === "amount_required") {
      let amt = (value.match(/\d+/g) || "").toString();
      if (amt) {
        value = amt.replaceAll(",", "");
      } else {
        value = amt;
      }
    }

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    // this.sendEvents("next");
    let { form_data } = this.state;
    let keys_to_check = [
      "amount_required",
      "tenor",
    ];

    this.formCheckUpdate(keys_to_check, form_data, "point_five", true);
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.title1,
          handleClick2: () => {
            this.setState({
              showError: false,
            });
          },
          button_text2: "Edit",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Loan requirement details"
        buttonTitle="SUBMIT"
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="requirements-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.amount_required_error}
                helperText={
                  this.state.form_data.amount_required_error ||
                  numDifferentiationInr((this.state.form_data.amount_required || "").toString().replaceAll(',', ''))
                }
                width="40"
                inputMode="numeric"
                label="Loan amount"
                class="amount_required"
                id="amount_required"
                name="amount_required"
                value={this.state.form_data.amount_required ? `₹ ${formatAmount(this.state.form_data.amount_required)}` : ""}
                onChange={this.handleChange("amount_required")}
              />
            </div>

            <div className="InputField">
              <DropDownNew
                width="40"
                options={this.state.screenData.tenorOptions}
                id="tenor"
                label="Loan tenure (in months)"
                error={this.state.form_data.tenor_error ? true : false}
                helperText={this.state.form_data.tenor_error}
                value={this.state.form_data.tenor || ""}
                name="tenor"
                onChange={this.handleChange("tenor")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default LoanRequirementDetails;
