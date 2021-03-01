import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Attention from "../../../common/ui/Attention";
import RadioWithoutIcon from "../../../common/ui/RadioWithoutIcon";
import scrollIntoView from "scroll-into-view-if-needed";
import Api from "utils/api";

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
      confirm_details: false,
      skelton: 'g',
    };

    this.initialize = initialize.bind(this);
    this.addressRef = React.createRef();
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
          status: "init",
        },
      ],
    };

    this.setState({
      progressHeaderData: progressHeaderData,
    });
  }

  onload = async () => {
    if (this.props.edit) {
      this.setState({
        next_state: `/loan/idfc/ckyc-summary`,
      });
    }

    let lead = this.state.lead || {};
    // let personal_info = lead.personal_info || {};
    let vendor_info = lead.vendor_info || {};
    let current_address_data = lead.current_address_data || {};
    let permanent_address_data = lead.permanent_address_data || {};
    let { confirm_details } = this.state;
    let { form_data } = this.state;

    if (vendor_info.ckyc_state === "success") {
      confirm_details = true;
    }

    let loaderData = {
      title: `Hang on while we create loan application`,
      subtitle: "It usually takes around 15 seconds!",
    };

    form_data.current_address1 = current_address_data.address1;
    form_data.current_address2 = current_address_data.address2;
    form_data.current_address3 = current_address_data.address3;
    form_data.current_landmark = current_address_data.landmark;
    form_data.current_pincode = current_address_data.pincode;
    form_data.current_city = current_address_data.city;
    form_data.current_state = current_address_data.state;
    form_data.current_country = "India";

    form_data.permanent_address1 = permanent_address_data.address1;
    form_data.permanent_address2 = permanent_address_data.address2;
    form_data.permanent_address3 = permanent_address_data.address3;
    form_data.permanent_landmark = permanent_address_data.landmark;
    form_data.permanent_pincode = permanent_address_data.pincode;
    form_data.permanent_city = permanent_address_data.city;
    form_data.permanent_state = permanent_address_data.state;
    form_data.permanent_country = "India";

    this.setState({
      form_data: form_data,
      confirm_details: confirm_details,
      loaderData: loaderData,
    }, () => {
      this.prefillPincode('current_pincode', current_address_data.pincode)
      this.prefillPincode('permanent_pincode', permanent_address_data.pincode)
    });
  };

  prefillPincode = async (name, pin = '') => {
    let { form_data } = this.state; 

    if (pin.length !== 6) {
      return;
    }

    const res = await Api.get("/relay/api/loan/pincode/get/" + pin);
      let resultData = res.pfwresponse.result[0] || "";

      let city, state, country = '';
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
        state = resultData.idfc_state_name || resultData.state_name;
        country = resultData.country;
      } else {
        city = "";
        state = "";
        country = "";
      }

      if (name === "current_pincode") {
        form_data.current_city = city;
        form_data.current_state = state;
        form_data.current_country = country || "India";
      } else if (name === "permanent_pincode") {
        form_data.permanent_city = city;
        form_data.permanent_state = state;
        form_data.permanent_country = country || "India";
      }

      this.setState({
        form_data: form_data
      })
  }

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_kyc_address_details",
      properties: {
        user_action: user_action,
        current_address_edited:
          this.state.form_data.current_address_edited || "no",
        ckyc_success: this.state.confirm_details ? "yes" : "no",
        event_name: "idfc_kyc_address_details",
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
    let { form_data, isPermanent_address } = this.state;

    let validate = [
      "permanent_address1",
      "permanent_address2",
      "permanent_address3",
      "current_landmark",
      "current_address1",
      "current_address2",
      "current_address3",
      "permanent_landmark",
    ];

    var format = /[^a-zA-Z0-9 ,]/g;

    if (validate.includes(name)) {
      let error = format.test(value);

      form_data[name] = value;
      form_data[name + "_error"] = error
        ? "special characters are not allowed except ( , ) commas."
        : "";
    } else {
      form_data[name] = value;
      form_data[name + "_error"] = "";
    }

    let confirm_fields = [
      "current_address1",
      "current_address2",
      "current_pincode",
    ];

    if (this.state.confirm_details) {
      this.handleCkycMessage(name);
      if (confirm_fields.includes(name))
        form_data["current_address_edited"] = "yes";
    }

    if (isPermanent_address === "Yes") {
      form_data.permanent_address1 = form_data.current_address1;
      form_data.permanent_address2 = form_data.current_address2;
      form_data.permanent_address3 = form_data.current_address3;
      form_data.permanent_landmark = form_data.current_landmark;
      form_data.permanent_pincode = form_data.current_pincode;
      form_data.permanent_city = form_data.current_city;
      form_data.permanent_state = form_data.current_state;
      form_data.permanent_country = form_data.current_country;
    }

    this.setState({
      form_data: form_data,
    });
  };

  handleScroll = (value) => {
    setTimeout(function () {
      let element = document.getElementById("addressScroll");
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

  handleClick = () => {
    // this.sendEvents("next");
    let { form_data } = this.state;
    let keys_to_check = [
      "current_address1",
      "current_address2",
      "current_landmark",
      "current_pincode",
      "current_city",
      "current_state",
      "permanent_address1",
      "permanent_address2",
      "permanent_landmark",
      "permanent_pincode",
      "permanent_city",
      "permanent_state",
    ];

    let keys_to_include;
    if (this.state.confirm_details) {
      keys_to_include = [
        "current_address3",
        "permanent_address3",
        "current_country",
        "permanent_country",
      ];
    } else {
      keys_to_include = ["current_country", "permanent_country"];
    }

    this.formCheckUpdate(
      keys_to_check,
      form_data,
      "null",
      true,
      keys_to_include
    );
  };

  handlePincode = (name) => async (event) => {
    const pincode = event.target.value;

    if (pincode.length > 6) {
      return;
    }

    let form_data = this.state.form_data;
    form_data[name] = pincode;
    form_data[name + "_error"] = "";

    if (this.state.confirm_details) {
      if (name === "current_pincode")
        form_data["current_address_edited"] = "yes";
      this.handleCkycMessage(name);
    }

    if (this.state.isPermanent_address === "Yes") {
      form_data.permanent_pincode = form_data.current_pincode;
    }

    this.setState({
      form_data: form_data,
    });

    if (pincode.length === 6) {
      const res = await Api.get("/relay/api/loan/pincode/get/" + pincode);
      let resultData = res.pfwresponse.result[0] || "";

      let { city, state, country } = form_data;
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
        state = resultData.idfc_state_name || resultData.state_name;
        country = resultData.country;
      } else {
        city = "";
        state = "";
        country = "";
        pincode_error = "Invalid pincode";
      }

      if (name === "current_pincode") {
        form_data.current_city = city;
        form_data.current_city_error = "";
        form_data.current_state = state;
        form_data.current_state_error = "";
        form_data.current_pincode_error = pincode_error;
        form_data.current_country = country || "India";
      } else if (name === "permanent_pincode") {
        form_data.permanent_city = city;
        form_data.permanent_city_error = "";
        form_data.permanent_state = state;
        form_data.permanent_state_error = "";
        form_data.permanent_pincode_error = pincode_error;
        form_data.permanent_country = country || "India";
      }
    }

    if (this.state.isPermanent_address === "Yes") {
      form_data.permanent_city = form_data.current_city;
      form_data.permanent_state = form_data.current_state;
      form_data.permanent_country = form_data.current_country;
    }

    this.setState({
      form_data: form_data,
    });
  };

  handleChangeRadio = (event) => {
    let isPermanent_address = yesOrNo_options[event].value;
    let { form_data } = this.state;

    if (isPermanent_address === "Yes") {
      form_data.permanent_address1 = form_data.current_address1;
      form_data.permanent_address2 = form_data.current_address2;
      form_data.permanent_address3 = form_data.current_address3;
      form_data.permanent_landmark = form_data.current_landmark;
      form_data.permanent_pincode = form_data.current_pincode;
      form_data.permanent_city = form_data.current_city;
      form_data.permanent_state = form_data.current_state;
      form_data.permanent_country = form_data.current_country;
    }

    for (var i in form_data) {
      form_data[i + "_error"] = "";
    }

    this.setState(
      {
        isPermanent_address: isPermanent_address,
        form_data: form_data,
      },
      () => {
        if (isPermanent_address === "Yes") {
          this.handleScroll();
        }
      }
    );
  };

  handleCkycMessage(name) {
    if (this.state.confirm_details) {
      let confirm_fields = [
        "current_address1",
        "current_address2",
        "current_pincode",
      ];
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

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
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

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title={`${
          this.state.confirm_details ? "Confirm your" : "Provide"
        } address details`}
        buttonTitle={this.state.confirm_details ? "CONFIRM & SUBMIT" : "SUBMIT"}
        handleClick={this.handleClick}
        loaderWithData={this.state.loaderWithData}
        headerData={{
          progressHeaderData: !this.state.loaderWithData ? this.state.progressHeaderData : '',
        }}
        loaderData={this.state.loaderData}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="address-details">
          <div className="head-title">Current address</div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_address1_error}
                helperText={
                  this.state.form_data.current_address1_error ||
                  this.state.form_data.current_address1_helper
                }
                type="text"
                width="40"
                label="Address line 1"
                id="current_address1"
                name="current_address1"
                value={this.state.form_data.current_address1 || ""}
                onChange={this.handleChange("current_address1")}
                onClick={() => this.handleCkycMessage("current_address1")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_address2_error}
                helperText={
                  this.state.form_data.current_address2_error ||
                  this.state.form_data.current_address2_helper
                }
                type="text"
                width="40"
                label="Address line 2"
                id="current_address2"
                name="current_address2"
                value={this.state.form_data.current_address2 || ""}
                onChange={this.handleChange("current_address2")}
                onClick={() => this.handleCkycMessage("current_address2")}
              />
            </div>

            {this.state.confirm_details && (
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.current_address3_error}
                  helperText={
                    this.state.form_data.current_address3_error ||
                    this.state.form_data.current_address3_helper
                  }
                  type="text"
                  width="40"
                  label="Address line 3"
                  id="current_address3"
                  name="current_address3"
                  value={this.state.form_data.current_address3 || ""}
                  onChange={this.handleChange("current_address3")}
                  onClick={() => this.handleCkycMessage("current_address3")}
                />
              </div>
            )}

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
                onClick={() => this.handleCkycMessage("current_landmark")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_pincode_error}
                helperText={
                  this.state.form_data.current_pincode_error ||
                  this.state.form_data.current_pincode_helper
                }
                type="number"
                width="40"
                label="Pin code"
                id="current_pincode"
                name="current_pincode"
                value={this.state.form_data.current_pincode || ""}
                onChange={this.handlePincode("current_pincode")}
                onClick={() => this.handleCkycMessage("current_pincode")}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_city_error}
                helperText={
                  this.state.form_data.current_city_error ||
                  this.state.form_data.current_city_helper
                }
                type="text"
                width="40"
                label="City"
                id="current_city"
                name="current_city"
                value={this.state.form_data.current_city || ""}
                onChange={this.handleChange("current_city")}
                disabled={true}
              />
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.current_state_error}
                helperText={
                  this.state.form_data.current_state_error ||
                  this.state.form_data.current_state_helper
                }
                type="text"
                width="40"
                label="State"
                id="current_state"
                name="current_state"
                value={this.state.form_data.current_state || ""}
                onChange={this.handleChange("current_state")}
                disabled={true}
              />
            </div>

            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Is current address same as permanent address?"
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
                  helperText={
                    this.state.form_data.permanent_address1_error ||
                    this.state.form_data.permanent_address1_helper
                  }
                  type="text"
                  width="40"
                  label="Address line 1"
                  id="permanent_address1"
                  name="permanent_address1"
                  value={this.state.form_data.permanent_address1 || ""}
                  onChange={this.handleChange("permanent_address1")}
                  disabled={this.state.isPermanent_address === "Yes"}
                  onClick={() => this.handleCkycMessage("permanent_address1")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_address2_error}
                  helperText={
                    this.state.form_data.permanent_address2_error ||
                    this.state.form_data.permanent_address2_helper
                  }
                  type="text"
                  width="40"
                  label="Address line 2"
                  id="permanent_address2"
                  name="permanent_address2"
                  value={this.state.form_data.permanent_address2 || ""}
                  onChange={this.handleChange("permanent_address2")}
                  disabled={this.state.isPermanent_address === "Yes"}
                  onClick={() => this.handleCkycMessage("permanent_address2")}
                />
              </div>

              {this.state.confirm_details && (
                <div className="InputField">
                  <Input
                    error={!!this.state.form_data.permanent_address3_error}
                    helperText={
                      this.state.form_data.permanent_address3_error ||
                      this.state.form_data.permanent_address3_helper
                    }
                    type="text"
                    width="40"
                    label="Address line 3"
                    id="permanent_address3"
                    name="permanent_address3"
                    value={this.state.form_data.permanent_address3 || ""}
                    onChange={this.handleChange("permanent_address3")}
                    disabled={this.state.isPermanent_address === "Yes"}
                    onClick={() => this.handleCkycMessage("permanent_address3")}
                  />
                </div>
              )}

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
                  disabled={this.state.isPermanent_address === "Yes"}
                  onClick={() => this.handleCkycMessage("permanent_landmark")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_pincode_error}
                  helperText={
                    this.state.form_data.permanent_pincode_error ||
                    this.state.form_data.permanent_pincode_helper
                  }
                  type="number"
                  width="40"
                  label="Pin code"
                  id="permanent_pincode"
                  name="permanent_pincode"
                  value={this.state.form_data.permanent_pincode || ""}
                  onChange={this.handlePincode("permanent_pincode")}
                  disabled={this.state.isPermanent_address === "Yes"}
                  onClick={() => this.handleCkycMessage("permanent_pincode")}
                />
              </div>

              <div className="InputField">
                <Input
                  error={!!this.state.form_data.permanent_city_error}
                  helperText={
                    this.state.form_data.permanent_city_error ||
                    this.state.form_data.permanent_city_helper
                  }
                  type="text"
                  width="40"
                  label="City"
                  id="permanent_city"
                  name="permanent_city"
                  value={this.state.form_data.permanent_city || ""}
                  onChange={this.handleChange("permanent_city")}
                  disabled={true}
                />
              </div>

              <div
                id="addressScroll"
                ref={this.addressRef}
                className="InputField"
              >
                <Input
                  error={!!this.state.form_data.permanent_state_error}
                  helperText={
                    this.state.form_data.permanent_state_error ||
                    this.state.form_data.permanent_state_helper
                  }
                  type="text"
                  width="40"
                  label="State"
                  id="permanent_state"
                  name="permanent_state"
                  value={this.state.form_data.permanent_state || ""}
                  onChange={this.handleChange("permanent_state")}
                  disabled={true}
                />
              </div>
            </div>
          </FormControl>
          <Attention content="Before proceeding, ensure entered details are correct. You can't make changes later. " />
        </div>
      </Container>
    );
  }
}

export default AddressDetails;
