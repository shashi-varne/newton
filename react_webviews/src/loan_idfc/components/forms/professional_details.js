import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { numDifferentiationInr, formatAmount } from "utils/validators";
import Autosuggest from "../../../common/ui/SearchBar";
import Api from "utils/api";

class ProfessionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "professional_details_screen",
      employment_type: "",
      industryOptions: [],
      companyOptions: [],
      companyOptions1: [],
      constitutionOptions: [],
      organisationTypeOptions: [],
      salaryRecieptOptions: [],
      company_name: "",
      isApiRunning: false,
      skelton: 'g',
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
      salary_mode: professional_info.salary_mode,
      organisation: professional_info.organisation,
      industry: professional_info.industry,
    };

    this.setState({
      form_data: form_data,
      employment_type: employment_type,
      company_name: professional_info.company_name,
      companyOptions: [{
        name: professional_info.company_name || "",
        value: professional_info.company_name || ""
      }]
    });
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
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

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_professional_details",
      properties: {
        user_action: user_action,
        event_name: "idfc_professional_details",
      },
    };

    let salary_mode = {
      'Bank Account Transfer': 'bank transfer',
      'Cash': 'cash',
      'Cheque': 'cheque'
    }    

    if (this.state.employment_type === 'salaried')  {
      eventObj.properties.salary_mode = salary_mode[this.state.form_data.salary_mode || ''] || '';
      eventObj.properties.net_monthly_salary = this.state.form_data.net_monthly_salary || "";
    }

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === 'net_monthly_salary') {
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
    this.sendEvents("next");
    let { form_data, employment_type } = this.state;
    let keys_to_check = [
       "organisation"
      ];

    let salaried = [
      "company_name",
      "office_email",
      "net_monthly_salary",
      "salary_mode",
      "industry",
    ];

    if (employment_type === "self_employed") {
      keys_to_check.push("company_name");
    } else {
      keys_to_check.push(...salaried);
    }

    this.formCheckUpdate(keys_to_check, form_data, "internal", true);
  };

  handleSearch = async (value) => {
    let { form_data, companyOptions } = this.state;

    form_data.company_name = value;
    form_data.company_name_error = "";

    if (value.length === 3) {
      this.setState({
        isApiRunning: true
      })
      const res = await Api.get(
        "relay/api/loan/idfc/employer/" + form_data.company_name
      );
      let resultData = res.pfwresponse.result || "";

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          isApiRunning: false
        })
        if (resultData.employer_name.length !== 0) {
          companyOptions = resultData.employer_name.map((element) => {
            return {
              name: element,
              value: element,
            };
          });
        }
      }

      this.setState({
        form_data: form_data,
        companyOptions: companyOptions,
      });
    }
  };

  render() {
    let { employment_type, industryOptions, companyOptions, isApiRunning } = this.state;
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Enter work details"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="professional-details">
          <FormControl fullWidth>
            {employment_type === "salaried" && (
              <div className="InputField">
                <Autosuggest
                  inputs={companyOptions}
                  width="40"
                  label="Company name"
                  class="company_name"
                  id="company_name"
                  name="company_name"
                  placeholder="Search for company"
                  onChange={(value) => this.handleSearch(value)}
                  value={this.state.form_data.company_name || ""}
                  error={this.state.form_data.company_name_error ? true : false}
                  helperText={this.state.form_data.company_name_error}
                  isApiRunning={isApiRunning}
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
                  label="Official email ID"
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
                    numDifferentiationInr((this.state.form_data.net_monthly_salary || '').toString().replaceAll(',', ''))
                  }
                  // type="number"
                  width="40"
                  inputMode="numeric"
                  label="Net monthly salary"
                  class="net_monthly_salary"
                  id="net_monthly_salary"
                  name="net_monthly_salary"
                  value={this.state.form_data.net_monthly_salary ? `₹ ${formatAmount(this.state.form_data.net_monthly_salary)}` : ""}
                  onChange={this.handleChange("net_monthly_salary")}
                />
              </div>
            )}

            {employment_type === "salaried" && (
              <div className="InputField">
                <DropdownWithoutIcon
                  width="40"
                  options={this.state.salaryRecieptOptions}
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
                options={this.state.organisationTypeOptions}
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
                  options={industryOptions}
                  label="Industry"
                  id="industry"
                  name="industry"
                  error={this.state.form_data.industry_error ? true : false}
                  helperText={this.state.form_data.industry_error}
                  value={this.state.form_data.industry || ""}
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
