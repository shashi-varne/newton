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

  handleChange = () => {};

  handleClick = () => {};

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
                error={!!this.state.loan_amount_error}
                helperText={this.state.loan_amount_error}
                type="text"
                width="40"
                label="Loan amount (in rupees)"
                class="loan_amount"
                id="loan_amount"
                name="loan_amount"
                value={this.state.loan_amount || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.purposeOfLoanOptions}
                id="purpose"
                label="Purpose of loan"
                error={this.state.purpose_error ? true : false}
                helperText={this.state.purpose_error}
                value={this.state.purpose || ""}
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
                error={this.state.tenor_error ? true : false}
                helperText={this.state.tenor_error}
                value={this.state.tenor || ""}
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
