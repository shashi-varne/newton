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
import scrollIntoView from "scroll-into-view-if-needed";

const gender_options = [
  {
    name: "Male",
    value: "Male",
  },
  {
    name: "Female",
    value: "Female",
  },
];

const genderMapper = {
  M: "Male",
  F: "Female",
  Male: "Male",
  Female: "Female",
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
      skelton: 'g',
    };

    this.initialize = initialize.bind(this);
    this.emailRef = React.createRef();
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

    let gender = genderMapper[capitalizeFirstLetter(personal_info.gender)];

    if (gender === "Other") {
      gender = "";
    }

    let form_data = {
      first_name: personal_info.first_name,
      middle_name: personal_info.middle_name,
      last_name: personal_info.last_name,
      dob:
        confirm_details && timeStampToDate(personal_info.idfc_ckyc_dob || ""),
      gender: genderMapper[capitalizeFirstLetter(personal_info.gender)],
      marital_status: capitalizeFirstLetter(personal_info.marital_status || ""),
      father_first_name: personal_info.father_first_name,
      father_last_name: personal_info.father_last_name,
      mother_first_name: confirm_details && personal_info.mother_first_name,
      mother_last_name: confirm_details && personal_info.mother_last_name,
      religion: capitalizeFirstLetter(personal_info.religion || ""),
      email_id: (personal_info.email_id || "").toLowerCase(),
    };

    this.setState({
      form_data: form_data,
      confirm_details: confirm_details,
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

  handleScroll = (value) => {
    setTimeout(function () {
      let element = document.getElementById("emailScroll");
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_kyc_personal_details",
      properties: {
        user_action: user_action,
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

    let names = [
      "first_name",
      "last_name",
      "father_first_name",
      "father_last_name",
      "mother_first_name",
      "mother_last_name",
    ];

    if (names.includes(name) && value.includes(" ")) {
      return;
    }

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    let confirm_fields = ["first_name", "last_name", "dob"];
    if (this.state.confirm_details) {
      this.handleCkycMessage(name);
      if (confirm_fields.includes(name)) details_changed = "yes";
    }

    this.setState({
      form_data: form_data,
      details_changed: details_changed,
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    let { form_data } = this.state;

    let keys_to_check = [
      "first_name",
      "last_name",
      "gender",
      "marital_status",
      "father_first_name",
      "father_last_name",
      "religion",
      "email_id",
    ];

    let keys_to_include = ["middle_name"];

    if (this.state.confirm_details) {
      keys_to_check.push(...["dob", "mother_first_name", "mother_last_name"]);
    }

    this.formCheckUpdate(keys_to_check, form_data, "", "", keys_to_include);

    if (form_data.email_id_error) {
      this.handleScroll();
    }
  };

  handleChangeRadio = (event) => {
    let { form_data, details_changed } = this.state;

    form_data.gender = gender_options[event].value;
    form_data.gender_error = "";

    if (this.state.confirm_details) {
      details_changed = "yes";
      this.handleCkycMessage("gender");
    }

    this.setState({
      form_data: form_data,
      details_changed: details_changed,
    });
  };

  handleCkycMessage(name) {
    if (this.state.confirm_details) {
      let confirm_fields = ["first_name", "last_name", "dob", "gender"];
      let { form_data } = this.state;
      confirm_fields.forEach((element) => {
        if (element === name)
          form_data[name + "_helper"] =
            "You need to provide proof for the changed info";
        else form_data[element + "_helper"] = "";
      });
      this.setState({
        form_data: form_data,
      });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title={`${
          this.state.confirm_details ? "Confirm your" : "Provide"
        }  personal details`}
        buttonTitle={this.state.confirm_details ? "CONFIRM & SUBMIT" : "SUBMIT"}
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="personal-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.first_name_error}
                helperText={
                  this.state.form_data.first_name_error ||
                  this.state.form_data.first_name_helper
                }
                type="text"
                width="40"
                label="First name"
                class="first_name"
                id="first_name"
                name="first_name"
                value={this.state.form_data.first_name || ""}
                onChange={this.handleChange("first_name")}
                onClick={() => this.handleCkycMessage("first_name")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.middle_name_error}
                helperText={
                  this.state.form_data.middle_name_error ||
                  this.state.form_data.middle_name_helper
                }
                type="text"
                width="40"
                label="Middle name"
                class="middle_name"
                id="middle_name"
                name="middle_name"
                value={this.state.form_data.middle_name || ""}
                onChange={this.handleChange("middle_name")}
                onClick={() => this.handleCkycMessage("middle_name")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.last_name_error}
                helperText={
                  this.state.form_data.last_name_error ||
                  this.state.form_data.last_name_helper
                }
                type="text"
                width="40"
                label="Last name"
                class="last_name"
                id="last_name"
                name="last_name"
                value={this.state.form_data.last_name || ""}
                onChange={this.handleChange("last_name")}
                onClick={() => this.handleCkycMessage("last_name")}
              />
            </div>

            {this.state.confirm_details && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.dob_error}
                  helperText={
                    this.state.form_data.dob_error ||
                    this.state.form_data.dob_helper
                  }
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
                  onClick={() => this.handleCkycMessage("dob")}
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
              {this.state.form_data.gender_helper && (
                <div className="helper-text">
                  {this.state.form_data.gender_helper}
                </div>
              )}
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
                error={!!this.state.form_data.father_first_name_error}
                helperText={this.state.form_data.father_first_name_error}
                type="text"
                width="40"
                label="Father's first name"
                class="father_first_name"
                id="father_first_name"
                name="father_first_name"
                value={this.state.form_data.father_first_name || ""}
                onChange={this.handleChange("father_first_name")}
                onClick={() => this.handleCkycMessage("father_first_name")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.father_last_name_error}
                helperText={this.state.form_data.father_last_name_error}
                type="text"
                width="40"
                label="Father's last name"
                class="father_last_name"
                id="father_last_name"
                name="father_last_name"
                value={this.state.form_data.father_last_name || ""}
                onChange={this.handleChange("father_last_name")}
                onClick={() => this.handleCkycMessage("father_last_name")}
              />
            </div>

            {this.state.confirm_details && (
              <>
                <div className="InputField">
                  <Input
                    error={!!this.state.form_data.mother_first_name_error}
                    helperText={this.state.form_data.mother_first_name_error}
                    type="text"
                    width="40"
                    label="Mother's first name"
                    class="mother_first_name"
                    id="mother_first_name"
                    name="mother_first_name"
                    value={this.state.form_data.mother_first_name || ""}
                    onChange={this.handleChange("mother_first_name")}
                    onClick={() => this.handleCkycMessage("mother_first_name")}
                  />
                </div>

                <div className="InputField">
                  <Input
                    error={!!this.state.form_data.mother_last_name_error}
                    helperText={this.state.form_data.mother_last_name_error}
                    type="text"
                    width="40"
                    label="Mother's last name"
                    class="mother_last_name"
                    id="mother_last_name"
                    name="mother_last_name"
                    value={this.state.form_data.mother_last_name || ""}
                    onChange={this.handleChange("mother_last_name")}
                    onClick={() => this.handleCkycMessage("mother_last_name")}
                  />
                </div>
              </>
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

            <div
              id="emailScroll"
              ref={this.emailRef}
              className="InputField"
            >
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
                onClick={() => this.handleCkycMessage("email_id")}
              />
            </div>
          </FormControl>

          {this.state.confirm_details && (
            <Attention content="Before proceeding, ensure entered details are correct. You can't make changes later. " />
          )}
        </div>
      </Container>
    );
  }
}

export default PersonalDetails;
