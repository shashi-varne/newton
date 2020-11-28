import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { validateNumber } from "utils/validators";

class AdditionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let mailingAddressPreferenceOptions = [
      'CURRENT ADDRESS',
      'PERMANENT ADDRESS'
    ];

    this.setState({
      mailingAddressPreferenceOptions: mailingAddressPreferenceOptions
    })
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "professional",
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

    if (name === 'pincode' && value && !validateNumber(value)) {
      return;
    } else {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    // if (name) {
      
    // }

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data } = this.state;

    let keys_to_check = ["", "", "", ""]

    this.formCheckUpdate(keys_to_check, form_data);
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Additional details"
        buttonTitle="NEXT"
        handleClick={this.handleClick}
      >
        <div className="additional-details">
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_address_error}
                helperText={this.state.form_data.office_address_error}
                type="text"
                width="40"
                label="Office address"
                id="office_address"
                name="office_address"
                value={this.state.form_data.office_address || ""}
                onChange={this.handleChange("office_address")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.pincode_error}
                helperText={this.state.form_data.pincode_error}
                type="text"
                width="40"
                label="Pincode"
                id="pincode"
                name="pincode"
                value={this.state.form_data.pincode || ""}
                onChange={this.handleChange("pincode")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.city_error}
                helperText={this.state.form_data.city_error}
                type="text"
                width="40"
                label="City"
                id="city"
                name="city"
                value={this.state.form_data.city || ""}
                onChange={this.handleChange("city")}
              />
            </div>

            {/* <div className="InputField">
              <Input
                error={!!this.state.form_data.mailing_address_preference_error}
                helperText={this.state.form_data.mailing_address_preference_error}
                type="text"
                width="40"
                label="Mailing address preference"
                id="mailing_address_preference"
                name="mailing_address_preference"
                value={this.state.form_data.mailing_address_preference || ""}
                onChange={this.handleChange("mailing_address_preference")}
              />
            </div> */}

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.mailingAddressPreferenceOptions}
                label="Mailing address preference"
                id="mailing_address_preference"
                name="mailing_address_preference"
                error={!!this.state.form_data.mailing_address_preference_error}
                helperText={this.state.form_data.mailing_address_preference_error}
                value={this.state.form_data.mailing_address_preference || ""}
                onChange={this.handleChange("mailing_address_preference")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default AdditionalDetails;
