import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

class ProfessionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "professional_details_screen"
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let screenData = this.state.screenData;


    this.setState({
      screenData: screenData
    })
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "professional",
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
        title="Enter your work details"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="professional-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.company_name_error}
                helperText={this.state.company_name_error}
                type="text"
                width="40"
                label="Company name"
                class="company-name"
                id="company-name"
                name="company_name"
                value={this.state.company_name || ""}
                onChange={this.handleChange("company_name")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.email_id_error}
                helperText={this.state.email_id_error}
                type="text"
                width="40"
                label="Official email id"
                class="email-id"
                id="email-id"
                name="email_id"
                value={this.state.email_id || ""}
                onChange={this.handleChange("email_id")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.salary_error}
                helperText={this.state.salary_error}
                type="text"
                width="40"
                label="Net monthly salary (in rupees)"
                class="salary"
                id="salary"
                name="salary"
                value={this.state.salary || ""}
                onChange={this.handleChange("salary")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.salaryRecieptOptions}
                id="receipt-mode"
                label="Salary receipt mode"
                error={this.state.salary_receipt_mode_error ? true : false}
                helperText={this.state.salary_receipt_mode_error}
                value={this.state.salary_receipt_mode || ""}
                name="salary_receipt_mode"
                onChange={this.handleChange("salary_receipt_mode")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.constitutionOptions}
                id="company_constitution"
                label="Constitution of company"
                error={this.state.company_constitution_error ? true : false}
                helperText={this.state.company_constitution_error}
                value={this.state.company_constitution || ""}
                name="company_constitution"
                onChange={this.handleChange("company_constitution")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.organisationTypeOptions}
                id="organisation_type"
                label="Organisation type"
                error={this.state.organisation_type_error ? true : false}
                helperText={this.state.organisation_type_error}
                value={this.state.organisation_type || ""}
                name="organisation_type"
                onChange={this.handleChange("organisation_type")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.departmentOptions}
                id="department"
                label="Department"
                error={this.state.department_error ? true : false}
                helperText={this.state.department_error}
                value={this.state.department || ""}
                name="department"
                onChange={this.handleChange("department")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.industryOptions}
                id="industry"
                label="Industry type"
                error={this.state.industry_error ? true : false}
                helperText={this.state.industry_error}
                value={this.state.industry || ""}
                name="industry"
                onChange={this.handleChange("industry")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default ProfessionalDetails;
