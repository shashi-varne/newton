import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
// import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import Attention from "../../../common/ui/Attention";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";

const yesOrNo_options = [
  {
    name: "Yes",
    value: "Yes",
  },
  {
    name: "No",
    value: "No",
  },
];

class AddressDetails extends Component {
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
        screen_name: "address",
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

          <div className="head-title">Current address</div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.address_line_1_error}
                helperText={this.state.address_line_1_error}
                type="text"
                width="40"
                label="Address line 1"
                class="address_line_1"
                id="address"
                name="address_line_1"
                value={this.state.address_line_1 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.address_line_2_error}
                helperText={this.state.address_line_2_error}
                type="text"
                width="40"
                label="Address line 2"
                class="address_line_2"
                id="address"
                name="address_line_2"
                value={this.state.address_line_2 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.address_line_3_error}
                helperText={this.state.address_line_3_error}
                type="text"
                width="40"
                label="Address line 3"
                class="address_line_3"
                id="address"
                name="address_line_3"
                value={this.state.address_line_3 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.landmark_error}
                helperText={this.state.landmark_error}
                type="text"
                width="40"
                label="Landmark"
                class="landmark"
                id="landmark"
                name="landmark"
                value={this.state.landmark || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.pincode_error}
                helperText={this.state.pincode_error}
                type="text"
                width="40"
                label="Pincode"
                class="pincode"
                id="pincode"
                name="pincode"
                value={this.state.pincode || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.city_error}
                helperText={this.state.city_error}
                type="text"
                width="40"
                label="City"
                class="city"
                id="city"
                name="city"
                value={this.state.city || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.state_error}
                helperText={this.state.state_error}
                type="text"
                width="40"
                label="State"
                class="state"
                id="state"
                name="state"
                value={this.state.state || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Is permanent address same as current address?"
                class="isPermanent_address:"
                options={yesOrNo_options}
                id="isPermanent_address"
                name="isPermanent_address"
                error={this.state.isPermanent_address_error ? true : false}
                helperText={this.state.isPermanent_address_error}
                value={this.state.isPermanent_address || ""}
                onChange={this.handleChangeRadio("gender")}
                canUnSelect={true}
              />
            </div>

            <div className="head-title">Permanent address</div>

            <div className="InputField">
              <Input
                error={!!this.state.address_line_1_error}
                helperText={this.state.address_line_1_error}
                type="text"
                width="40"
                label="Address line 1"
                class="address_line_1"
                id="address"
                name="address_line_1"
                value={this.state.address_line_1 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.address_line_2_error}
                helperText={this.state.address_line_2_error}
                type="text"
                width="40"
                label="Address line 2"
                class="address_line_2"
                id="address"
                name="address_line_2"
                value={this.state.address_line_2 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.address_line_3_error}
                helperText={this.state.address_line_3_error}
                type="text"
                width="40"
                label="Address line 3"
                class="address_line_3"
                id="address"
                name="address_line_3"
                value={this.state.address_line_3 || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.landmark_error}
                helperText={this.state.landmark_error}
                type="text"
                width="40"
                label="Landmark"
                class="landmark"
                id="landmark"
                name="landmark"
                value={this.state.landmark || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.pincode_error}
                helperText={this.state.pincode_error}
                type="text"
                width="40"
                label="Pincode"
                class="pincode"
                id="pincode"
                name="pincode"
                value={this.state.pincode || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.city_error}
                helperText={this.state.city_error}
                type="text"
                width="40"
                label="City"
                class="city"
                id="city"
                name="city"
                value={this.state.city || ""}
                onChange={this.handleChange}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.state_error}
                helperText={this.state.state_error}
                type="text"
                width="40"
                label="State"
                class="state"
                id="state"
                name="state"
                value={this.state.state || ""}
                onChange={this.handleChange}
              />
            </div>

          </FormControl>
        </div>
      </Container>
    );
  }
}

export default AddressDetails;
