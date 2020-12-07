import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import {
  numDifferentiationInr,
  capitalizeFirstLetter,
  capitalize,
} from "utils/validators";

class ProfessionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "professional_details_screen",
      employment_type: "",
      industryOptions: [],
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    if (this.props.edit) {
      this.setState({
        next_state: `/loan/idfc/application-summary`,
      });
    }

    let lead = this.state.lead || {};
    let professional_info = lead.professional_info || {};
    let application_info = lead.application_info || {};

    let { employment_type } = application_info;

    let form_data = {
      company_name: professional_info.company_name,
      office_email: professional_info.office_email,
      net_monthly_salary: application_info.net_monthly_salary,
      salary_mode: (professional_info.salary_mode || "").toUpperCase(),
      constitution: professional_info.constitution,
      organisation: (professional_info.organisation || "").toUpperCase(),
      department: professional_info.department,
      industry: professional_info.industry,
    };

    this.setState({
      form_data: form_data,
      employment_type: employment_type,
    });
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

  handleChange = (name) => (event) => {
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
    let { form_data, employment_type } = this.state;
    let keys_to_check = ["constitution", "organisation"];

    let salaried = [
      "company_name",
      "office_email",
      "net_monthly_salary",
      "salary_mode",
      "department",
      "industry",
    ];

    if (employment_type === "self_employed") {
      keys_to_check.push("company_name");
    } else {
      keys_to_check.push(...salaried);
    }

    this.formCheckUpdate(keys_to_check, form_data, "internal", true);
  };

  render() {
    let { employment_type } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Enter your work details"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="professional-details">
          <FormControl fullWidth>
            {employment_type === "salaried" && (
              <div className="InputField">
                <DropdownWithoutIcon
                  width="40"
                  options={this.state.screenData.companyOptions}
                  id="company_name"
                  label="Company name"
                  error={this.state.form_data.company_name_error ? true : false}
                  helperText={this.state.form_data.company_name_error}
                  value={this.state.form_data.company_name || ""}
                  name="company_name"
                  onChange={this.handleChange("company_name")}
                />
              </div>
            )}

            {employment_type === "self_employed" && (
              <div className="InputField">
                <Input
                  type="text"
                  width="40"
                  label="Business name"
                  class="business_name"
                  id="business_name"
                  name="business_name"
                  error={this.state.form_data.company_name_error ? true : false}
                  helperText={this.state.form_data.company_name_error}
                  value={this.state.form_data.company_name || ""}
                  onChange={this.handleChange("company_name")}
                />
              </div>
            )}

            {employment_type === "salaried" && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.office_email_error}
                  helperText={this.state.form_data.office_email_error}
                  type="text"
                  width="40"
                  label="Official email id"
                  class="Email"
                  id="office_email"
                  name="office_email"
                  value={this.state.form_data.office_email || ""}
                  onChange={this.handleChange("office_email")}
                />
              </div>
            )}

            {employment_type === "salaried" && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.net_monthly_salary_error}
                  helperText={
                    this.state.form_data.net_monthly_salary_error ||
                    numDifferentiationInr(
                      this.state.form_data.net_monthly_salary
                    )
                  }
                  type="number"
                  width="40"
                  label="Net monthly salary (in rupees)"
                  class="net_monthly_salary"
                  id="net_monthly_salary"
                  name="net_monthly_salary"
                  value={this.state.form_data.net_monthly_salary || ""}
                  onChange={this.handleChange("net_monthly_salary")}
                />
              </div>
            )}

            {employment_type === "salaried" && (
              <div className="InputField">
                <DropdownWithoutIcon
                  width="40"
                  options={this.state.screenData.salaryRecieptOptions}
                  id="salary-receipt-mode"
                  label="Salary receipt mode"
                  error={this.state.form_data.salary_mode_error ? true : false}
                  helperText={this.state.form_data.salary_mode_error}
                  value={this.state.form_data.salary_mode || ""}
                  name="salary_mode"
                  onChange={this.handleChange("salary_mode")}
                />
              </div>
            )}

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.constitutionOptions}
                id="constitution"
                label="Constitution of company"
                error={this.state.form_data.constitution_error ? true : false}
                helperText={this.state.form_data.constitution_error}
                value={(this.state.form_data.constitution || "").toUpperCase()}
                name="constitution"
                onChange={this.handleChange("constitution")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.organisationTypeOptions}
                id="organisation"
                label="Organisation type"
                error={this.state.form_data.organisation_error ? true : false}
                helperText={this.state.form_data.organisation_error}
                value={this.state.form_data.organisation || ""}
                name="organisation"
                onChange={this.handleChange("organisation")}
              />
            </div>

            {employment_type === "salaried" && (
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
            )}

            {employment_type === "salaried" && (
              <div className="InputField">
                <DropdownWithoutIcon
                  width="40"
                  options={this.state.industryOptions}
                  id="industry"
                  label="Industry type"
                  error={this.state.form_data.industry_error ? true : false}
                  helperText={this.state.form_data.industry_error}
                  value={this.state.form_data.industry || ""}
                  name="industry"
                  onChange={this.handleChange("industry")}
                />
              </div>
            )}
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default ProfessionalDetails;
