import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize, getRecommendedVendor } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import { numDifferentiationInr, formatAmount } from "utils/validators";
import { nativeCallback } from "utils/native_callback";

class Recommended extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "recommended",
    };

    this.initialize = initialize.bind(this);
    this.getRecommendedVendor = getRecommendedVendor.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data } = this.state;

    let amount_input = ['loan_amount_required', 'monthly_salary']
    if (amount_input.includes(name)) {
      let amt = (value.match(/\d+/g) || "").toString();
      if (amt) {
        value = amt.replaceAll(",", "");
      } else {
        value = amt;
      }
    }

    if (id === "Salaried" || id === "Self_employed") {
      form_data.employment_type = id;
      form_data.employment_type_error = "";

      this.setState({
        form_data: form_data,
      });
    }

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    this.setState({
      form_data: form_data,
    });
  };

  validateFields(keys_to_check, form_data) {
    let canSubmitForm = true;
    let keysMapper = {
      loan_amount_required: "loan requirement",
      employment_type: "employment type",
      monthly_salary: "monthly salary",
    };

    for (var i = 0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      if (!form_data[key_check]) {
        form_data[key_check + "_error"] =
          "Please enter " + keysMapper[key_check];
        canSubmitForm = false;
      }
    }

    if (!canSubmitForm) this.setState({ form_data: form_data });
    return canSubmitForm;
  }

  handleClick = () => {
    let { form_data } = this.state;
    let keys_to_check = ["loan_amount_required", "employment_type"];

    let body = {};

    if (form_data.employment_type === "Salaried") {
      keys_to_check.push("monthly_salary");
    }

    if (this.validateFields(keys_to_check, form_data)) {
      this.setState({
        show_loader: true,
      });
      for (var j in keys_to_check) {
        let key = keys_to_check[j];
        body[key] = form_data[key] || "";
      }
      this.sendEvents("next");
      this.getRecommendedVendor(body);
    }
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "loan_requirement",
      properties: {
        user_action: user_action,
        employment_type: (this.state.form_data.employment_type || '').toLowerCase() || "",
        amount_required: this.state.form_data.loan_amount_required || "",
        event_name: "loan_requirement",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.onload,
          button_text1: "Retry",
        },
        submit: {
          handleClick1: this.handleClick,
          button_text1: "Retry",
          title1: this.state.errorTitle,
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
        title="Let’s get the best offer for you"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="recommended">
          <div className="recommended-subtitle">Enter the details below:</div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.loan_amount_required_error}
                helperText={
                  this.state.form_data.loan_amount_required_error || 
                  numDifferentiationInr((this.state.form_data.loan_amount_required || '').toString().replaceAll(',', ''))
                }
                inputMode="numeric"
                width="40"
                label="Loan requirement"
                class="loan_amount_required"
                id="loan_amount_required"
                name="loan_amount_required"
                value={this.state.form_data.loan_amount_required ? `₹ ${formatAmount(this.state.form_data.loan_amount_required)}` : ""}
                onChange={this.handleChange("loan_amount_required")}
              />
            </div>
          </FormControl>
          <div className="sub-head">Employment type</div>
          <div className="employment-type">
            <div
              className="employment-card"
              style={{
                border:
                  this.state.form_data.employment_type === "Salaried" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleChange()}
            >
              <img
                id="Salaried"
                src={require(`assets/${this.state.productName}/icn_salaried.svg`)}
                alt=""
                style={{ width: "100%" }}
              />
            </div>
            <div
              className="employment-card"
              style={{
                border:
                  this.state.form_data.employment_type === "Self_employed" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleChange()}
            >
              <img
                id="Self_employed"
                src={require(`assets/${this.state.productName}/icn_self_employed.svg`)}
                alt=""
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="error-radiogrp">
            {this.state.form_data.employment_type_error}
          </div>
          {this.state.form_data.employment_type &&
            this.state.form_data.employment_type === "Salaried" && (
              <FormControl fullWidth>
                <div className="InputField">
                  <Input
                    error={!!this.state.form_data.monthly_salary_error}
                    helperText={
                      this.state.form_data.monthly_salary_error ||
                      numDifferentiationInr((this.state.form_data.monthly_salary || '').toString().replaceAll(',', ''))
                    }
                    inputMode="numeric"
                    width="40"
                    label="Net monthly salary (in rupees)"
                    class="monthly_salary"
                    id="monthly_salary"
                    name="monthly_salary"
                    value={this.state.form_data.monthly_salary ? `₹ ${formatAmount(this.state.form_data.monthly_salary)}` : ""}
                    onChange={this.handleChange("monthly_salary")}
                  />
                </div>
              </FormControl>
            )}
        </div>
      </Container>
    );
  }
}

export default Recommended;
