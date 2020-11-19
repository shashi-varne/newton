import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { dobFormatTest, formatDate } from "utils/validators";

class BasicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      screen_name: 'basic_details'
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
      "OTHERS"
    ];

    this.setState({
      qualification: qualification,
    });
  }

  onload = async () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "basic_details",
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

    if (id === "salaried" || id === "self-employed") {
      form_data.employment_type = id;

      this.setState({
        form_data: form_data
      })
    }

    if (name === 'pan_no' && value) {
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
      form_data: form_data
    })
  };

  handleClick = async () => {
    let { form_data } = this.state;
    let keys_to_check = ['dob', 'pan_no', 'education_qualification', 'employment_type'];

    this.formCheckUpdate(keys_to_check, form_data);
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Let's start by getting to know you a bit..."
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
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.qualification}
                id="education_qualification"
                label="Education Qualification"
                error={this.state.form_data.education_qualification_error ? true : false}
                helperText={this.state.form_data.education_qualification_error}
                value={this.state.form_data.education_qualification || ""}
                name="education_qualification"
                onChange={this.handleChange("education_qualification")}
              />
            </div>
          </FormControl>
          <div className="sub-head">Employment type</div>
          <div className="employment-type">
            <div
              className="employment-card"
              style={{
                border:
                  this.state.form_data.employment_type === "salaried" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleChange()}
            >
              <img
                id="salaried"
                src={require(`assets/${this.state.productName}/icn_salaried.svg`)}
                alt=""
              />
            </div>
            <div
              className="employment-card"
              style={{
                border:
                  this.state.form_data.employment_type === "self-employed" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleChange()}
            >
              <img
                id="self-employed"
                src={require(`assets/${this.state.productName}/icn_self_employed.svg`)}
                alt=""
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default BasicDetails;
