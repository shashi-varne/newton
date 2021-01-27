import React, { Component } from "react";
import Container from "fund_details/common/Container";
import InputWithIcon from "../../../common/ui/InputWithIcon";
import calendar from "../../../assets/calendar2.png";
import phone from "../../../assets/phone_black.png";
import card from "../../../assets/card.png";
import { FormControl } from "material-ui/Form";
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

class PanDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {},
      pan: "",
      dob: "",
      mobile_no: "",
      is_nps_contributed: ''
    };
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;

    this.setState({
      [name]: value,
      [name + 'error']: ''
    });
  };

  handleChangeRadio = (event) => {
    let is_nps_contributed = yesOrNo_options[event].value;

    this.setState({
      is_nps_contributed: is_nps_contributed,
      is_nps_contributed_error: ''
    })
  };

  handleClick = () => {
    // endpoint = api/kyc/v2/mine
  }

  render() {
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="PROCEED"
        title="PAN details"
        classOverRideContainer="pr-container"
        handleClick={() => this.handleClick()}
      >
        <div className="pan-details">
          <FormControl fullWidth>
            <div className="InputField">
              <InputWithIcon
                icon={card}
                width="30"
                id="pan"
                label="PAN number"
                onChange={this.handleChange("pan")}
              />
            </div>

            <div className="InputField">
              <RadioWithoutIcon
                width="40"
                label="Have you ever contributed in NPS before?"
                options={yesOrNo_options}
                id="is_nps_contributed"
                name="is_nps_contributed"
                error={this.state.is_nps_contributed_error ? true : false}
                helperText={this.state.is_nps_contributed_error}
                value={this.state.is_nps_contributed || ""}
                onChange={this.handleChangeRadio}
              />
            </div>

            <div className="InputField">
              <InputWithIcon
                icon={calendar}
                width="30"
                id="dob"
                label="your date of birth"
                onChange={this.handleChange("dob")}
              />
            </div>

            <div className="InputField">
              <InputWithIcon
                icon={phone}
                width="30"
                type="number"
                id="mobile_no"
                label="Enter Mobile Number"
                onChange={this.handleChange("mobile_no")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default PanDetails;
