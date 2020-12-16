import React, { Component } from "react";
import Container from "../../common/container";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import { numDifferentiationInr } from "utils/validators";

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "personal_details",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data } = this.state;

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

  handleClick = () => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Help us to provide you with best offers"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="personal-details">
          <div className="personal-details-subtitle">
            Enter the details below:
          </div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.loan_requirement_error}
                helperText={
                  this.state.form_data.loan_requirement_error ||
                  numDifferentiationInr(this.state.form_data.loan_requirement)
                }
                type="number"
                width="40"
                label="Loan requirement"
                class="loan_requirement"
                maxLength={10}
                id="loan_requirement"
                name="loan_requirement"
                value={this.state.form_data.loan_requirement || ""}
                onChange={this.handleChange("loan_requirement")}
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
              </FormControl>
            )}
        </div>
      </Container>
    );
  }
}

export default PersonalDetails;
