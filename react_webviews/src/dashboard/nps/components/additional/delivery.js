import React, { Component } from "react";
import Container from "../../../common/Container";
import Input from "common/ui/Input";
import person from "assets/location.png";
import Api from "utils/api";
import { initialize } from "../../common/commonFunctions";
import { storageService } from "utils/validators";

class NpsDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      canSubmit: true,
      skelton: 'g',
      form_data: {},
      screen_name: "nps_delivery",
      uploaded: '',
      img: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidMount() {
    this.setState({
      keys_to_check: ["addressline", "pincode", "city", "state"]
    })
  }

  onload = () => {
    const kyc_app = storageService().getObject(
      "kyc"
    ) || {};
    const { address = {} } = kyc_app;
    const kycAddress = address.meta_data || {};

    const npsAdditionalDetails = storageService().getObject(
      "nps_additional_details"
    ) || {};
    const npsDetails = npsAdditionalDetails.nps_details || {};
    const npsAddress = npsDetails.address || {}

    let { form_data } = this.state;
    form_data.pincode = npsAddress?.pincode || kycAddress.pincode || "";
    form_data.addressline = npsAddress.addressline ||  kycAddress.addressline || "";
    form_data.city = npsAddress.city || npsAddress.district ||  kycAddress.city || kycAddress.district || "";
    form_data.state =  npsAddress.state || kycAddress.state || "";

    this.setState({
      address: address,
      form_data: form_data,
      skelton: false
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handlePincode = (name) => async (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + '_error'] = "";

    if (form_data.pincode.length > 6) return

    this.setState({
      form_data: form_data,
    });

    if (form_data.pincode.length === 6) {
      try {
        const res = await Api.get(`api/pincode/${form_data.pincode}`);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200 && result[0]) {
          let data = result[0];

          form_data.city = data?.district_name || data?.division_name || data?.taluk;
          form_data.city_error = "";
          form_data.state = data?.state_name;
          form_data.state_error = "";
        } else {
          form_data["pincode_error"] = "Please enter a valid Pincode."
          // throw result.error || result.message;
        }
      } catch (err) {
        throw err;
      }
    }else form_data["pincode_error"] = "Minlength is 6.";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = () => {
    let { form_data, keys_to_check } = this.state;

    let canSubmit = this.formCheckUpdate(keys_to_check, form_data);

    if (canSubmit) {
      let data = {
        address: {
          addressline: form_data.addressline,
          pin: form_data.pincode,
        },
      };
  
      this.updateMeta(data, "");
    }
  };

  bannerText = () => {
    return (
      <span>
        You will get the <b>PRAN</b> card delivered to this address
      </span>
    );
  }

  render() {
    let { form_data } = this.state;
    return (
      <Container
        buttonTitle="CONTINUE"
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        hidePageTitle
        new_header={true}
        title="Confirm Delivery Details"
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
        banner={true}
        bannerText={this.bannerText()}
      >
        <div className="nps-delivery-details">
          <div className="title" style={{marginBottom: '20px'}}>PRAN delivery address</div>

          <div className="InputField">
            <Input
              icon={person}
              type="number"
              width="30"
              id="pincode"
              label="Pincode"
              name="pincode"
              error={form_data.pincode_error ? true : false}
              helperText={form_data.pincode_error}
              value={form_data.pincode || ""}
              onChange={this.handlePincode("pincode")}
            />
          </div>

          <div className="InputField">
            <Input
              width="30"
              id="address"
              label="Permanent address (house, building, street)"
              name="addressline"
              error={form_data.addressline_error ? true : false}
              helperText={form_data.addressline_error}
              value={form_data.addressline || ""}
              onChange={this.handleChange("addressline")}
              multiline={true}
            />
          </div>

          <div className="InputField">
            <Input
              disabled
              width="30"
              id="name"
              label="City"
              name="city"
              error={form_data.city_error ? true : false}
              helperText={form_data.city_error}
              value={form_data.city || ""}
              onChange={this.handleChange("city")}
            />
          </div>

          <div className="InputField">
            <Input
              disabled
              width="30"
              id="name"
              label="State"
              name="state"
              error={form_data.state_error ? true : false}
              helperText={form_data.state_error}
              value={form_data.state || ""}
              onChange={this.handleChange("state")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsDelivery;
