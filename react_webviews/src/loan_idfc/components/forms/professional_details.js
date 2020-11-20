import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { numDifferentiationInr } from "utils/validators";

class ProfessionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "professional_details_screen",
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
        screen_name: "professional",
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
    let id = (event.target && event.target.id) || "";
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
      "company_name",
      "email_id",
      "salary",
      "salary_receipt_mode",
      "company_constitution",
      "organisation_type",
      "department",
      "industry",
    ];

    this.formCheckUpdate(keys_to_check, form_data);
  };

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
                error={!!this.state.form_data.company_name_error}
                helperText={this.state.form_data.company_name_error}
                type="text"
                width="40"
                label="Company name"
                class="company-name"
                id="company-name"
                name="company_name"
                value={this.state.form_data.company_name || ""}
                onChange={this.handleChange("company_name")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.email_id_error}
                helperText={this.state.form_data.email_id_error}
                type="text"
                width="40"
                label="Official email id"
                class="email-id"
                id="email-id"
                name="email_id"
                value={this.state.form_data.email_id || ""}
                onChange={this.handleChange("email_id")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.salary_error}
                helperText={
                  this.state.form_data.salary_error ||
                  numDifferentiationInr(this.state.form_data.salary)
                }
                type="number"
                width="40"
                label="Net monthly salary (in rupees)"
                class="salary"
                id="salary"
                name="salary"
                value={this.state.form_data.salary || ""}
                onChange={this.handleChange("salary")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.salaryRecieptOptions}
                id="receipt-mode"
                label="Salary receipt mode"
                error={
                  this.state.form_data.salary_receipt_mode_error ? true : false
                }
                helperText={this.state.form_data.salary_receipt_mode_error}
                value={this.state.form_data.salary_receipt_mode || ""}
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
                error={
                  this.state.form_data.company_constitution_error ? true : false
                }
                helperText={this.state.form_data.company_constitution_error}
                value={this.state.form_data.company_constitution || ""}
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
                error={
                  this.state.form_data.organisation_type_error ? true : false
                }
                helperText={this.state.form_data.organisation_type_error}
                value={this.state.form_data.organisation_type || ""}
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
                error={this.state.form_data.department_error ? true : false}
                helperText={this.state.form_data.department_error}
                value={this.state.form_data.department || ""}
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
                error={this.state.form_data.industry_error ? true : false}
                helperText={this.state.form_data.industry_error}
                value={this.state.form_data.industry || ""}
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
