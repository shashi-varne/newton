import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { validateNumber } from "utils/validators";
import { numDifferentiationInr } from "utils/validators";
import Api from "utils/api";

class AdditionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      employment_type: "",
      screen_name: "additional_details",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let mailingAddressPreferenceOptions = [
      "CURRENT ADDRESS",
      "PERMANENT ADDRESS",
    ];

    this.setState({
      mailingAddressPreferenceOptions: mailingAddressPreferenceOptions,
    });
  }

  onload = () => {
    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};
    let office_address_data = lead.office_address_data || {};
    let employment_type = application_info.employment_type;

    let form_data = this.state.form_data;

    form_data.office_address = office_address_data.address;
    form_data.mailing_address_preference = vendor_info.mailing_address_preference;

    let bottomButtonData = {
      leftTitle: "Personal loan",
      leftSubtitle: numDifferentiationInr(vendor_info.loanAmount),
    };

    this.setState({
      employment_type: employment_type,
      bottomButtonData: bottomButtonData,
      form_data: form_data
    });
  };

  handlePincode = (name) => async (event) => {
    const pincode = event.target.value;

    if (pincode.length > 6 || (pincode && !validateNumber(pincode))) {
      return;
    }

    let form_data = this.state.form_data;
    form_data[name] = pincode;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });

    if (pincode.length === 6) {
      const res = await Api.get("/relay/api/loan/pincode/get/" + pincode);
      let resultData = res.pfwresponse.result[0] || "";

      let { city, state } = form_data;
      let pincode_error = "";
      if (
        res.pfwresponse.status_code === 200 &&
        res.pfwresponse.result.length > 0
      ) {
        if (!resultData.idfc_city_name) {
          city =
            resultData.district_name ||
            resultData.division_name ||
            resultData.taluk;
        } else {
          city = resultData.idfc_city_name;
        }
        state = resultData.state_name;
      } else {
        city = "";
        state = "";
        pincode_error = "Invalid pincode";
      }

      if (name === "pincode") {
        form_data.city = city;
        form_data.pincode_error = pincode_error;
      }
    }

    this.setState({
      form_data: form_data,
    });
  };

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

    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data } = this.state;

    let keys_to_check = [
      "office_address",
      "pincode",
      "city",
      "mailing_address_preference",
    ];

    this.formCheckUpdate(keys_to_check, form_data, "one_point_seven", true);
  };

  render() {
    let { employment_type } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Additional details"
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        withProvider={true}
        buttonData={this.state.bottomButtonData}
      >
        <div className="additional-details">
          {employment_type === "self employed" && (
            <div className="InputField">
              <Input
                error={!!this.state.form_data.nature_of_business_error}
                helperText={this.state.form_data.nature_of_business_error}
                type="text"
                width="40"
                label="Nature of business"
                id="nature_of_business"
                name="nature_of_business"
                value={this.state.form_data.nature_of_business || ""}
                onChange={this.handleChange("nature_of_business")}
              />
            </div>
          )}

          <div className="head-title">Office address</div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_address_error}
                helperText={this.state.form_data.office_address_error}
                type="text"
                width="40"
                label="Address"
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
                maxLength={6}
                label="Pincode"
                id="pincode"
                name="pincode"
                value={this.state.form_data.pincode || ""}
                onChange={this.handlePincode("pincode")}
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
                disabled={true}
                value={this.state.form_data.city || ""}
                onChange={this.handleChange("city")}
              />
            </div>

            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.mailingAddressPreferenceOptions}
                label="Mailing address preference"
                id="mailing_address_preference"
                name="mailing_address_preference"
                error={!!this.state.form_data.mailing_address_preference_error}
                helperText={
                  this.state.form_data.mailing_address_preference_error
                }
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
