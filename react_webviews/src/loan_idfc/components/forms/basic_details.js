import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { dobFormatTest, isValidDate, formatDate } from "utils/validators";

class BasicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
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
      "OTHERS",
      "POST GRADUATE",
      "PROFESSIONAL",
      "UNDER GRADUATE",
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

    if (name) {
      this.setState({
        [name]: value,
        [name + "_error"]: ""
      });
    }

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById("dob");
      input.onkeyup = formatDate;

      this.setState({
        dob: value,
        dob_error: ""
      });
    }
  };

  handleClick = (event) => {
    let id = event.target.id;

    if (id === "salaried" || id === "self-employed") {
      this.setState({
        emp_type: id,
      });
    }
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
                error={!!this.state.dob_error}
                helperText={this.state.dob_error}
                type="text"
                width="40"
                label="Date of birth"
                placeholder="DD/MM/YYYY"
                class="dob"
                maxLength={10}
                id="dob"
                name="dob"
                value={this.state.dob || ""}
                onChange={this.handleChange()}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.pan_no_error}
                helperText={this.state.pan_no_error}
                type="text"
                width="40"
                label="PAN number"
                class="pan"
                maxLength={10}
                id="pan"
                name="pan"
                value={this.state.pan_no || ""}
                onChange={this.handleChange("pan_no")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.qualification}
                id="education_qualification"
                label="Education Qualification"
                error={this.state.education_qualification_error ? true : false}
                helperText={this.state.education_qualification_error}
                value={this.state.education_qualification || ""}
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
                  this.state.emp_type === "salaried" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleClick}
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
                  this.state.emp_type === "self-employed" &&
                  "1px solid var(--primary)",
              }}
              onClick={this.handleClick}
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
