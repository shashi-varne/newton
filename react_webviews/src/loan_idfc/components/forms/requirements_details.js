import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import {
  numDifferentiationInr,
  formatAmount,
  inrFormatTest,
} from "utils/validators";

class LoanRequirementDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
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
      title: "Please wait while IDFC evaluates your profile",
      subtitle: "This may take 10 - 15 seconds!",
    };

    this.setState({
      form_data: form_data,
      loaderData: loaderData,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "loan_requirement_details",
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
      if (!inrFormatTest(event.target.value)) {
        return;
      }

      console.log(formatAmount(event.target.value));

      form_data[name] = event.target.value;
      form_data[name + "_error"] = "";
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
    this.sendEvents("next");
    let { form_data } = this.state;
    let keys_to_check = [
      "amount_required",
      "tenor",
    ];

    this.formCheckUpdate(keys_to_check, form_data, "point_five", true);
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Loan requirement details"
        buttonTitle="SUBMIT"
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        handleClick={this.handleClick}
      >
        <div className="requirements-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.amount_required_error}
                helperText={
                  this.state.form_data.amount_required_error ||
                  numDifferentiationInr(this.state.form_data.amount_required)
                }
                type="text"
                width="40"
                label="Loan amount (in rupees)"
                class="amount_required"
                id="amount_required"
                name="amount_required"
                value={this.state.form_data.amount_required || ""}
                onChange={this.handleChange("amount_required")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
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
