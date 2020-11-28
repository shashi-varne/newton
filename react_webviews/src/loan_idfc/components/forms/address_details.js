import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
// import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import Attention from "../../../common/ui/Attention";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";
import Api from 'utils/api';

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
      screen_name: "address_details",
      form_data: {},
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
          status: "completed",
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
    // this.setState({
    //   isPermanent_address: "No",
    // });
  };

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

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name) {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }
    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data } = this.state;
    let keys_to_check = [
      "current_address1",
      "current_address2",
      "current_address3",
      "current_landmark",
      "current_pincode",
      "current_city",
      "current_state",
      "permanent_address1",
      "permanent_address2",
      "permanent_address3",
      "permanent_landmark",
      "permanent_pincode",
      "permanent_city",
      "permanent_state",
    ];

    this.formCheckUpdate(keys_to_check, form_data, "null", true);
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    if (pincode.length > 6) {
        return;
    }

    let form_data = this.state.form_data;
    form_data[name] = pincode;
    form_data[name + '_error'] = '';

    this.setState({
        form_data: form_data
    })

    if (pincode.length === 6) {
        const res = await Api.get('/relay/api/loan/pincode/get/' + pincode);
        let resultData = res.pfwresponse.result[0] || '';

        console.log(resultData)

        // let { city, state, country } = form_data;
        // let pincode_error = '';
        // if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
        //     if (resultData.dmi_city_name === 'NA') {
        //         city = resultData.district_name || resultData.division_name || resultData.taluk;
        //     } else {
        //         city = resultData.dmi_city_name;
        //     }
        //     state = resultData.state_name;
        //     country = resultData.country_name;
        // } else {
        //     city = '';
        //     state = '';
        //     pincode_error = 'Invalid pincode';
        // }
        
        // if (name === 'pincode') {
        //     form_data.city = city;
        //     form_data.state = state;
        //     form_data.pincode_error = pincode_error;
        //     form_data.country = country || 'India';
        // } else {
        //     form_data.p_city = city;
        //     form_data.p_state = state;
        //     form_data.p_pincode_error = pincode_error;
        //     form_data.p_country = country || 'India';
        // }

    }

    // this.setState({
    //     form_data: form_data
    // })
}

  handleChangeRadio = (event) => {
    let isPermanent_address = yesOrNo_options[event].value;
    let { form_data } = this.state;

      form_data.permanent_address1 = isPermanent_address === 'Yes' ? form_data.current_address1 : '';
      form_data.permanent_address2 = isPermanent_address === 'Yes' ? form_data.current_address2 : '';
      form_data.permanent_address3 = isPermanent_address === 'Yes' ? form_data.current_address3 : '';
      form_data.permanent_landmark = isPermanent_address === 'Yes' ? form_data.current_landmark : '';
      form_data.permanent_pincode = isPermanent_address === 'Yes' ? form_data.current_pincode : '';
      form_data.permanent_city = isPermanent_address === 'Yes' ? form_data.current_city : '';
      form_data.permanent_state = isPermanent_address === 'Yes' ? form_data.current_state : '';

    this.setState({
      isPermanent_address: isPermanent_address
    });
  };

  render() {
    let { isPermanent_address } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Confirm your personal details"
        buttonTitle="CONFIRM & SUBMIT"
        handleClick={this.handleClick}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
      >
        <div className="personal-details">
          <Attention content="Once submitted, details cannot be changed or modified." />

          <div className="head-title">Current address</div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_address1_error}
                helperText={this.state.form_data.current_address1_error}
                type="text"
                width="40"
                label="Address line 1"
                id="address"
                name="current_address1"
                value={this.state.form_data.current_address1 || ""}
                onChange={this.handleChange("current_address1")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_address2_error}
                helperText={this.state.form_data.current_address2_error}
                type="text"
                width="40"
                label="Address line 2"
                id="address"
                name="current_address2"
                value={this.state.form_data.current_address2 || ""}
                onChange={this.handleChange("current_address2")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_address3_error}
                helperText={this.state.form_data.current_address3_error}
                type="text"
                width="40"
                label="Address line 3"
                id="address"
                name="fcurrent_address3"
                value={this.state.form_data.current_address3 || ""}
                onChange={this.handleChange("current_address3")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_landmark_error}
                helperText={this.state.form_data.current_landmark_error}
                type="text"
                width="40"
                label="Landmark"
                id="current_landmark"
                name="current_landmark"
                value={this.state.form_data.current_landmark || ""}
                onChange={this.handleChange("current_landmark")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_pincode_error}
                helperText={this.state.form_data.current_pincode_error}
                type="number"
                width="40"
                label="Pincode"
                id="current_pincode"
                name="current_pincode"
                value={this.state.form_data.current_pincode || ""}
                onChange={this.handlePincode("current_pincode")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_city_error}
                helperText={this.state.form_data.current_city_error}
                type="text"
                width="40"
                label="City"
                id="current_city"
                name="current_city"
                value={this.state.form_data.current_city || ""}
                onChange={this.handleChange("current_city")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_state_error}
                helperText={this.state.form_data.current_state_error}
                type="text"
                width="40"
                label="State"
                id="current_state"
                name="current_state"
                value={this.state.form_data.current_state || ""}
                onChange={this.handleChange("current_state")}
              />
            </div>

            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Is permanent address same as current address?"
                options={yesOrNo_options}
                id="isPermanent_address"
                name="isPermanent_address"
                error={this.state.isPermanent_address_error ? true : false}
                helperText={this.state.isPermanent_address_error}
                value={this.state.isPermanent_address || ""}
                onChange={this.handleChangeRadio}
              />
            </div>

            <div>
              <div className="head-title">Permanent address</div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_address1_error}
                  helperText={this.state.form_data.permanent_address1_error}
                  type="text"
                  width="40"
                  label="Address line 1"
                  id="address"
                  name="permanent_address1"
                  value={this.state.form_data.permanent_address1 || ""}
                  onChange={this.handleChange("permanent_address1")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_address2_error}
                  helperText={this.state.form_data.permanent_address2_error}
                  type="text"
                  width="40"
                  label="Address line 2"
                  id="address"
                  name="permanent_address2"
                  value={this.state.form_data.permanent_address2 || ""}
                  onChange={this.handleChange("permanent_address2")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_address3_error}
                  helperText={this.state.form_data.permanent_address3_error}
                  type="text"
                  width="40"
                  label="Address line 3"
                  id="address"
                  name="permanent_address3"
                  value={this.state.form_data.permanent_address3 || ""}
                  onChange={this.handleChange("permanent_address3")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_landmark_error}
                  helperText={this.state.form_data.permanent_landmark_error}
                  type="text"
                  width="40"
                  label="Landmark"
                  id="permanent_landmark"
                  name="permanent_landmark"
                  value={this.state.form_data.permanent_landmark || ""}
                  onChange={this.handleChange("permanent_landmark")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_pincode_error}
                  helperText={this.state.form_data.permanent_pincode_error}
                  type="number"
                  width="40"
                  label="Pincode"
                  id="permanent_pincode"
                  name="permanent_pincode"
                  value={this.state.form_data.permanent_pincode || ""}
                  onChange={this.handlePincode("permanent_pincode")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_city_error}
                  helperText={this.state.form_data.permanent_city_error}
                  type="text"
                  width="40"
                  label="City"
                  id="permanent_city"
                  name="permanent_city"
                  value={this.state.form_data.permanent_city || ""}
                  onChange={this.handleChange("permanent_city")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_state_error}
                  helperText={this.state.form_data.permanent_state_error}
                  type="text"
                  width="40"
                  label="State"
                  id="permanent_state"
                  name="permanent_state"
                  value={this.state.form_data.permanent_state || ""}
                  onChange={this.handleChange("permanent_state")}
                />
              </div>
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default AddressDetails;
