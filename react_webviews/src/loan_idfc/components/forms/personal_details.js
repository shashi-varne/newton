import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import Attention from "../../../common/ui/Attention";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";
import { capitalizeFirstLetter, timeStampToDate } from "utils/validators";

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

const genderMapper = {
  M: "Male",
  F: "Female",
  O: "Others",
  Male: "Male",
  Female: "Female",
  Others: "Others"
};

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "personal_details_screen",
      form_data: {},
      confirm_details: false,
      details_changed: "no",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: "Application form",
      steps: [
        {
          title: "Personal details",
          status: "init",
        },
        {
          title: "Address details",
          status: "pending",
        },
      ],
    };

    this.setState({
      progressHeaderData: progressHeaderData,
    });
  }

  onload = () => {
    if (this.props.edit) {
      this.setState({
        next_state: `/loan/idfc/ckyc-summary`,
      });
    }

    let lead = this.state.lead || {};
    let personal_info = lead.personal_info || {};
    let vendor_info = lead.vendor_info || {};
    let { confirm_details } = this.state;

    if (vendor_info.ckyc_state === "success") {
      confirm_details = true;
    }

    let form_data = {
      first_name: personal_info.first_name,
      middle_name: confirm_details && personal_info.middle_name,
      last_name: personal_info.last_name,
      dob: confirm_details && timeStampToDate(personal_info.dob || ""),
      gender: genderMapper[capitalizeFirstLetter(personal_info.gender)],
      marital_status: (personal_info.marital_status || "").toUpperCase(),
      father_name: personal_info.father_name,
      mother_name: confirm_details && personal_info.mother_name,
      religion: (personal_info.religion || "").toUpperCase(),
      email_id: (personal_info.email_id || "").toLowerCase(),
    };

    this.setState({
      form_data: form_data,
      confirm_details: confirm_details,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "kyc_personal_details",
        details_changed: this.state.details_changed,
        ckyc_success: this.state.confirm_details ? "yes" : "no",
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
    let { form_data, details_changed } = this.state;

    if(name === 'first_name' && value.indexOf(' ') >= 0) {
      return
    } else if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    if (this.state.confirm_details) {
      details_changed = 'yes'
    }

    this.setState({
      form_data: form_data,
      details_changed: details_changed,
    });
  };

  handleClick = () => {
    this.sendEvents('next');
    let { form_data } = this.state;
    let keys_to_check = [
      "first_name",
      "last_name",
      "gender",
      "marital_status",
      "father_name",
      "religion",
      "email_id",
    ];
    
    if (this.state.confirm_details) {
      keys_to_check.push(...["dob", "mother_name", "middle_name"]);
    }

    this.formCheckUpdate(keys_to_check, form_data);
  };

  handleChangeRadio = (event) => {
    let { form_data } = this.state;

    form_data.gender = gender_options[event].value;
    form_data.gender_error = "";

    this.setState({
      form_data: form_data,
    });
  };

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={`${
          this.state.confirm_details ? "Confirm your" : "Provide"
        }  personal details`}
        buttonTitle={this.state.confirm_details ? "CONFIRM & SUBMIT" : "SUBMIT"}
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
      >
        <div className="personal-details">
          {this.state.confirm_details && (
            <Attention content="Once submitted, details cannot be changed or modified." />
          )}

          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.first_name_error}
                helperText={this.state.form_data.first_name_error}
                type="text"
                width="40"
                label="First name"
                class="first_name"
                id="name"
                name="first_name"
                value={this.state.form_data.first_name || ""}
                onChange={this.handleChange("first_name")}
              />
            </div>

            {this.state.confirm_details && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.middle_name_error}
                  helperText={this.state.form_data.middle_name_error}
                  type="text"
                  width="40"
                  label="Middle name"
                  class="middle_name"
                  id="name"
                  name="middle_name"
                  value={this.state.form_data.middle_name || ""}
                  onChange={this.handleChange("middle_name")}
                />
              </div>
            )}

            <div className="InputField">
              <Input
                error={!!this.state.form_data.last_name_error}
                helperText={this.state.form_data.last_name_error}
                type="text"
                width="40"
                label="Last name"
                class="last_name"
                id="name"
                name="last_name"
                value={this.state.form_data.last_name || ""}
                onChange={this.handleChange("last_name")}
              />
            </div>

            {this.state.confirm_details && (
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
                  onChange={this.handleChange("dob")}
                />
              </div>
            )}

            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Gender"
                class="Gender:"
                options={gender_options}
                id="gender"
                name="gender"
                error={this.state.form_data.gender_error ? true : false}
                helperText={this.state.form_data.gender_error}
                value={this.state.form_data.gender || ""}
                onChange={this.handleChangeRadio}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.maritalOptions}
                id="marital_status"
                label="Marital status"
                error={this.state.form_data.marital_status_error ? true : false}
                helperText={this.state.form_data.marital_status_error}
                value={this.state.form_data.marital_status || ""}
                name="marital_status"
                onChange={this.handleChange("marital_status")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.father_name_error}
                helperText={this.state.form_data.father_name_error}
                type="text"
                width="40"
                label="Father's name"
                class="father_name"
                id="name"
                name="father_name"
                value={this.state.form_data.father_name || ""}
                onChange={this.handleChange("father_name")}
              />
            </div>

            {this.state.confirm_details && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.mother_name_error}
                  helperText={this.state.form_data.mother_name_error}
                  type="text"
                  width="40"
                  label="Mother's name"
                  class="mother_name"
                  id="name"
                  name="mother_name"
                  value={this.state.form_data.mother_name || ""}
                  onChange={this.handleChange("mother_name")}
                />
              </div>
            )}

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.screenData.religionOptions}
                id="religion"
                label="Religion"
                error={this.state.form_data.religion_error ? true : false}
                helperText={this.state.form_data.religion_error}
                value={this.state.form_data.religion || ""}
                name="religion"
                onChange={this.handleChange("religion")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.email_id_error}
                helperText={this.state.form_data.email_id_error}
                type="text"
                width="40"
                label="Personal email id"
                class="email_id"
                id="email"
                name="email_id"
                value={this.state.form_data.email_id || ""}
                onChange={this.handleChange("email_id")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default PersonalDetails;
