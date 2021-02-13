import React, { Component } from "react";
import Container from "../../common/Container";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import person from "../../../assets/location.png";
import Api from "utils/api";
import{ initialize } from "../common/commonFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';

class NpsDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {}
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  onload = () => {}

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data
    })
  };

  handlePincode = name => async (event)=> {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    form_data.pincode = value;
    form_data.pincode_error = "";

    this.setState({
      form_data: form_data
    })

    if (form_data.pincode.length === 6) {
      try {
        const res = await Api.get(`api/pincode/${form_data.pincode}`);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
          let data = result[0];

          form_data.city = data.district_name || data.division_name;
          form_data.city_error = '';
          form_data.state = data.state_name;
          form_data.state_error = ''
        } else {
          throw result.error || result.message;
        }
      } catch (err) {
        throw err;
      }
    }
    
    this.setState({
      form_data: form_data
    })
  }

  handleClick = () => {
    let { form_data } = this.state;

    let data = {
      address: {
        addressline: form_data.addressline,
        pin: form_data.pin,
      }
    }

    this.updateMeta(data, '');
  }

  render() {
    let { form_data } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle={this.state.show_loader ? <CircularProgress size={22} thickness={4} /> : 'CONTINUE'}
        disable={this.state.show_loader}
        hideInPageTitle
        hidePageTitle
        title="Confirm Delivery Details"
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            You will get the <span className="bold">PRAN</span> card delivered to
            this address
          </div>
        </div>

        <div className="nps-delivery-details">
          <div className="title">PRAN delivery address</div>

          <div className="InputField">
            <InputWithIcon
              icon={person}
              type="number"
              width="30"
              id="pincode"
              label="Pincode"
              name="pincode"
              error={(form_data.pincode_error) ? true : false}
              helperText={form_data.pincode_error}
              value={form_data.pincode || ''}
              onChange={this.handlePincode('pincode')}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="address"
              label="Permanent address (house, building, street)"
              name="addressline"
              error={(form_data.addressline_error) ? true : false}
              helperText={form_data.addressline_error}
              value={form_data.addressline || ''}
              onChange={this.handleChange("addressline")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="name"
              label="City"
              name="city"
              error={(form_data.city_error) ? true : false}
              helperText={form_data.city_error}
              value={form_data.city || ''}
              onChange={this.handleChange("city")}
            />
          </div>

          <div className="InputField">
            <InputWithIcon
              width="30"
              id="name"
              label="State"
              name="state"
              error={(form_data.state_error) ? true : false}
              helperText={form_data.state_error}
              value={form_data.state || ''}
              onChange={this.handleChange("state")}
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default NpsDelivery;
