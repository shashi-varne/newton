import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import {
  dobFormatTest,
  formatDate,
  timeStampToDate,
  capitalizeFirstLetter,
} from "utils/validators";

class BasicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: "basic_details",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let qualification = [
      "DOCTORATE",
      "ENGINEER",
      "GRADUATE",
      "MATRIC",
      "POST GRADUATE",
      "PROFESSIONAL",
      "UNDER GRADUATE",
      "OTHERS",
    ];

    this.setState({
      qualification: qualification,
    });
  }

  onload = () => {
    if (this.props.edit) {
      this.setState({
        next_state: `/loan/idfc/application-summary`,
      });
    }

    let lead = this.state.lead || {};
    let personal_info = lead.personal_info || {};
    let professional_info = lead.professional_info || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};

    let form_data = {
      dob: timeStampToDate(personal_info.dob || ""),
      pan_no: personal_info.pan_no || "",
      educational_qualification:
        professional_info.educational_qualification || "",
      employment_type:
        capitalizeFirstLetter(application_info.employment_type) || "",
    };

    this.setState({
      form_data: form_data,
      pan_state: application_info.is_pan_disabled,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "personal_details",
        employment_type: this.state.form_data.employment_type,
        dob: this.state.form_data.dob,
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

    if (id === "Salaried" || id === "Self_employed") {
      form_data.employment_type = id;
      form_data.employment_type_error = "";

      this.setState({
        form_data: form_data,
      });
    }

    if (name === "pan_no" && value) {
      value = value.toUpperCase();
    }

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById("dob");
      input.onkeyup = formatDate;

      form_data.dob = value;
      form_data.dob_error = "";
    }

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    this.sendEvents('next');
    let { form_data, pan_state } = this.state;
    let keys_to_check = ["dob", "educational_qualification", "employment_type"];
    if (pan_state !== "success") {
      keys_to_check.push("pan_no");
    }

    this.formCheckUpdate(keys_to_check, form_data);
  };

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.setEditTitle("Let's start by getting to know you a bit...")}
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="basic-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.dob_error}
                helperText={this.state.form_data.dob_error}
                type="text"
                width="40"
                label="Date of birth"
                placeholder="DD/MM/YYYY"
                class="dob"
                maxLength={10}
                id="dob"
                name="dob"
                value={this.state.form_data.dob || ""}
                onChange={this.handleChange()}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.pan_no_error}
                helperText={this.state.form_data.pan_no_error}
                type="text"
                width="40"
                label="PAN number"
                class="pan"
                maxLength={10}
                id="pan"
                name="pan"
                value={this.state.form_data.pan_no || ""}
                onChange={this.handleChange("pan_no")}
                disabled={this.state.pan_state}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.qualification}
                id="education_qualification"
                label="Education Qualification"
                error={
                  this.state.form_data.educational_qualification_error
                    ? true
                    : false
                }
                helperText={
                  this.state.form_data.educational_qualification_error
                }
                value={this.state.form_data.educational_qualification || ""}
                name="educational_qualification"
                onChange={this.handleChange("educational_qualification")}
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
        </div>
      </Container>
    );
  }
}

export default BasicDetails;
