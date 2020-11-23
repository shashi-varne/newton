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
      form_data: {}
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: 'Application form',
      steps: [
        {
          'title': 'Personal details',
          'status': 'init'
        },
        {
          'title': 'Address details',
          'status': 'pending'
        }
      ]
    }

    this.setState({
      progressHeaderData: progressHeaderData
    })
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "personal_details",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = name => event => {
    let value = event.target ? event.target.value : event;
    let id = event.target ? event.target.id : "";
    let { form_data } = this.state;

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    this.setState({
      form_data: form_data
    })
  };

  handleClick = () => {
    let { form_data } = this.state;
    let keys_to_check = ['first_name', 'middle_name', 'last_name', 'dob', 'gender', 'marital_status', 'father_name', 'mother_name','religion', 'email_id'];

    this.formCheckUpdate(keys_to_check, form_data);
  };

  handleChangeRadio = (event) => {
    this.setState({
      gender: gender_options[event].value
    })
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Confirm your personal details"
        buttonTitle="CONFIRM & SUBMIT"
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData
        }}
      >
        <div className="personal-details">
          <Attention content="Once submitted, details cannot be changed or modified." />

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
