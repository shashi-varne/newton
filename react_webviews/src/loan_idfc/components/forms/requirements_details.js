import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import Attention from "../../../common/ui/Attention";

class LoanRequirementDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "requirement_details_screen",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "personal",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = name => event => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }
    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data } = this.state;
    let keys_to_check = [
      "amount_required",
      "purpose",
      "tenor"
    ];

    this.formCheckUpdate(keys_to_check, form_data, 'point_five', true);
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Loan requirement details"
        buttonTitle="SUBMIT"
        handleClick={this.handleClick}
      >
        <div className="requirements-details">
          <Attention content="Enter correct loan requirements and double-check before you hit the 'submit' button!  Once submitted, you can't make any changes." />

          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.amount_required_error}
                helperText={this.state.form_data.amount_required_error}
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
                options={this.state.screenData.purposeOfLoanOptions}
                id="purpose"
                label="Purpose of loan"
                error={this.state.form_data.purpose_error ? true : false}
                helperText={this.state.form_data.purpose_error}
                value={this.state.form_data.purpose || ""}
                name="purpose"
                onChange={this.handleChange("purpose")}
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
