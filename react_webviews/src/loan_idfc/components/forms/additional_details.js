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
      businessOptions: []
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let mailingAddressPreferenceOptions = [
      "Current Address",
      "Permanent Address",
    ];

    this.setState({
      mailingAddressPreferenceOptions: mailingAddressPreferenceOptions,
    });
  }

  onload = () => {
    let loaderData = {
      title: `Please wait while we check if any additional documents need to be uploaded.`,
      subtitle: "It won't take more than 10 to 15 seconds!",
    };

    let lead = this.state.lead || {};
    let application_info = lead.application_info || {};
    let vendor_info = lead.vendor_info || {};
    let office_address_data = lead.office_address_data || {};
    let employment_type = application_info.employment_type;

    let form_data = this.state.form_data;

    form_data.nature_of_business = vendor_info.nature_of_business;
    form_data.office_address1 = office_address_data.address1;
    form_data.office_address2 = office_address_data.address2;
    form_data.office_landmark = office_address_data.landmark;
    form_data.office_pincode = office_address_data.pincode;
    form_data.office_city = office_address_data.city;
    form_data.office_state = office_address_data.state;
    form_data.office_country= 'India';
    form_data.mailing_address_preference = vendor_info.mailing_address_preference;

    let bottomButtonData = {
      leftTitle: "Personal loan",
      leftSubtitle: numDifferentiationInr(vendor_info.updated_offer_amount),
    };

    this.setState({
      employment_type: employment_type,
      bottomButtonData: bottomButtonData,
      form_data: form_data,
      loaderData: loaderData,
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

      let { city, state, country } = form_data;
      let office_pincode_error = "";
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
        country = resultData.country;
      } else {
        city = "";
        state = "";
        country = "";
        office_pincode_error = "Invalid pincode";
      }

      if (name === "office_pincode") {
        form_data.office_city = city;
        form_data.office_city_error = "";
        form_data.office_state = state;
        form_data.office_state_error = "";
        form_data.office_pincode_error = office_pincode_error;
        form_data.office_country = country || 'India';
      }
    }

    this.setState({
      form_data: form_data,
    });
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "additional_details",
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
    this.sendEvents('next');
    let { form_data, employment_type } = this.state;

    let keys_to_check = [
      "office_address1",
      "office_address2",
      "office_landmark",
      "office_pincode",
      "office_city",
      "office_state",
      "office_country",
      "mailing_address_preference",
    ];

    if (employment_type === "self_employed") {
      keys_to_check.push("nature_of_business")
    }

    if(form_data.office_pincode.length !== 6) {
      form_data['office_pincode_error'] = 'Please enter valid pincode';
      this.setState({form_data : form_data});
      return
    }

    this.formCheckUpdate(keys_to_check, form_data, "one_point_seven", true);
  };

  render() {
    let { employment_type } = this.state;
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Additional details"
        buttonTitle="CONTINUE"
        handleClick={this.handleClick}
        withProvider={true}
        buttonData={this.state.bottomButtonData}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
      >
        <div className="additional-details">
          {employment_type === "self_employed" && (
            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.businessOptions}
                error={!!this.state.form_data.nature_of_business_error}
                helperText={this.state.form_data.nature_of_business_error}
                type="text"
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
                error={!!this.state.form_data.office_address1_error}
                helperText={this.state.form_data.office_address1_error}
                type="text"
                width="40"
                label="Address line 1"
                id="address"
                name="office_address1"
                value={this.state.form_data.office_address1 || ""}
                onChange={this.handleChange("office_address1")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_address2_error}
                helperText={this.state.form_data.office_address2_error}
                type="text"
                width="40"
                label="Address line 2"
                id="address"
                name="office_address2"
                value={this.state.form_data.office_address2 || ""}
                onChange={this.handleChange("office_address2")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_landmark_error}
                helperText={this.state.form_data.office_landmark_error}
                type="text"
                width="40"
                label="Landmark"
                id="office_landmark"
                name="office_landmark"
                value={this.state.form_data.office_landmark || ""}
                onChange={this.handleChange("office_landmark")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_pincode_error}
                helperText={this.state.form_data.office_pincode_error}
                type="text"
                width="40"
                maxLength={6}
                label="Pincode"
                id="office_pincode"
                name="office_pincode"
                value={this.state.form_data.office_pincode || ""}
                onChange={this.handlePincode("office_pincode")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_city_error}
                helperText={this.state.form_data.office_city_error}
                type="text"
                width="40"
                label="City"
                id="office_city"
                name="office_city"
                disabled={true}
                value={this.state.form_data.office_city || ""}
                onChange={this.handleChange("office_city")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.office_state_error}
                helperText={this.state.form_data.office_state_error}
                type="text"
                width="40"
                label="State"
                id="office_state"
                name="office_state"
                value={this.state.form_data.office_state || ""}
                onChange={this.handleChange("office_state")}
                disabled={true}
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
