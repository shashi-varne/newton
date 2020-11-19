import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import Attention from "../../../common/ui/Attention";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";
// import { dobFormatTest, isValidDate, formatDate } from "utils/validators";

const gender_options = [
  {
    name: "Male",
    value: "Male",
  },
  {
    name: "Female",
    value: "Female",
  },
  {
    name: "Others",
    value: "Others",
  },
];

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "personal_details_screen",
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

  handleChangeRadio = (name) => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Confirm your personal details"
        buttonTitle="CONFIRM & SUBMIT"
        handleClick={this.handleClick}
      >
        <div className="personal-details">
          <Attention content="Once submitted, details cannot be changed or modified." />

          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.first_name_error}
                helperText={this.state.first_name_error}
                type="text"
                width="40"
                label="First name"
                class="first_name"
                id="name"
                name="first_name"
                value={this.state.first_name || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.middle_name_error}
                helperText={this.state.middle_name_error}
                type="text"
                width="40"
                label="Middle name"
                class="middle_name"
                id="name"
                name="middle_name"
                value={this.state.middle_name || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.last_name_error}
                helperText={this.state.last_name_error}
                type="text"
                width="40"
                label="Last name"
                class="last_name"
                id="name"
                name="last_name"
                value={this.state.last_name || ""}
                onChange={this.handleChange}
              />
            </div>

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
              <RadioWithoutIcon
                width="40"
                label="Gender"
                class="Gender:"
                options={gender_options}
                id="gender"
                name="gender"
                error={this.state.gender_error ? true : false}
                helperText={this.state.gender_error}
                value={this.state.gender || ""}
                onChange={this.handleChangeRadio("gender")}
                canUnSelect={true}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.maritalOptions}
                id="marital_status"
                label="Marital status"
                error={this.state.marital_status_error ? true : false}
                helperText={this.state.marital_status_error}
                value={this.state.marital_status || ""}
                name="marital_status"
                onChange={this.handleChange("marital_status")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.father_name_error}
                helperText={this.state.father_name_error}
                type="text"
                width="40"
                label="Father's name"
                class="father_name"
                id="name"
                name="father_name"
                value={this.state.father_name || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.mother_name_error}
                helperText={this.state.mother_name_error}
                type="text"
                width="40"
                label="Mother's name"
                class="mother_name"
                id="name"
                name="mother_name"
                value={this.state.mother_name || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.religionOptions}
                id="religion"
                label="Religion"
                error={this.state.religion_error ? true : false}
                helperText={this.state.religion_error}
                value={this.state.religion || ""}
                name="religion"
                onChange={this.handleChange("religion")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.email_id_error}
                helperText={this.state.email_id_error}
                type="text"
                width="40"
                label="Personal email id"
                class="email_id"
                id="email"
                name="email_id"
                value={this.state.email_id || ""}
                onChange={this.handleChange}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default PersonalDetails;
