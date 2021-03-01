import React, { Component } from "react";
import Container from "../../../common/Container";
import InputWithIcon from "common/ui/InputWithIcon";
import calendar from "assets/calendar2.png";
import phone from "assets/phone_black.png";
import card from "assets/card.png";
import email from "assets/email2.svg";
import { FormControl } from "material-ui/Form";
import RadioWithoutIcon from "common/ui/RadioWithoutIcon";
import { initialize } from "../../common/commonFunctions";
import { dobFormatTest, formatDate, validateEmail, validatePan } from "utils/validators";
import Grid from "material-ui/Grid";

const yesOrNo_options = [
  {
    name: "Yes",
    value: true,
  },
  {
    name: "No",
    value: false,
  },
];

class PanDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {},
      pan: "",
      dob: "",
      mobile_number: "",
      is_nps_contributed: false,
      show_loader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === "mobile_number" && value.length > 10) {
      return;
    }

    if (name === "pran" && value.length > 12) {
      return;
    }

    if (name === "dob") {
      var input = document.getElementById("dob");
      input.onkeyup = formatDate;
    }

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleChangeRadio = (event) => {
    let is_nps_contributed = yesOrNo_options[event].value;

    this.setState({
      is_nps_contributed: is_nps_contributed,
      is_nps_contributed_error: "",
    });
  };

  handleClick = () => {
    let { form_data } = this.state;
    let canSubmit = true;

    if (!validatePan(form_data.pan)) {
      form_data.pan_error = "invalid pan";
      canSubmit = false;
    }

    if (form_data.email && !validatePan(form_data.email)) {
      form_data.email_error = "invalid email";
      canSubmit = false;
    }

    this.setState({
      form_data: form_data,
    });

    if (canSubmit) {
      let data = {
        kyc: {
          address: {
            email: form_data.email,
            mobile_number: form_data.mobile_number,
          },
          pan: {
            dob: form_data.dob,
            pan_number: form_data.pan,
          },
        },
      };

      this.kyc_submit(data, "amount");
    }
  };

  render() {
    let { form_data, is_nps_contributed } = this.state;
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
      >
        <div className="main-top-title">PAN details</div>
        <div className="pan-details">
          <FormControl fullWidth>
            <div className="InputField">
              <InputWithIcon
                icon={card}
                width="30"
                id="pan"
                label="PAN number"
                name="pan"
                error={!!form_data.pan_error}
                helperText={form_data.pan_error}
                value={form_data.pan || ""}
                maxLength={10}
                onChange={this.handleChange("pan")}
              />
            </div>
            
            <div className="InputField">
              <Grid container spacing={16} className="marital_status">
                <Grid item xs={2}>
                  {""}
                </Grid>
                <Grid item xs={10}>
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
                </Grid>
              </Grid>
            </div>

            {is_nps_contributed && (
              <div className="InputField">
                <InputWithIcon
                  icon={card}
                  width="30"
                  id="pran"
                  label="Pran number"
                  type="number"
                  name="pran"
                  error={!!form_data.pran_error}
                  helperText={form_data.pran_error}
                  value={form_data.pran || ""}
                  onChange={this.handleChange("pran")}
                />
              </div>
            )}

            <div className="InputField">
              <InputWithIcon
                icon={calendar}
                width="30"
                id="dob"
                name="dob"
                label="your date of birth"
                error={!!form_data.dob_error}
                helperText={form_data.dob_error}
                value={form_data.dob || ""}
                maxLength={10}
                onChange={this.handleChange("dob")}
              />
            </div>

            <div className="InputField">
              <InputWithIcon
                icon={phone}
                type="number"
                width="30"
                id="number"
                name="mobile_number"
                maxLength={10}
                label="Enter Mobile Number"
                class="Mobile"
                error={!!form_data.mobile_number_error}
                helperText={form_data.mobile_number_error}
                value={form_data.mobile_number || ""}
                onChange={this.handleChange("mobile_number")}
              />
            </div>

            <div className="InputField">
              <InputWithIcon
                icon={email}
                width="30"
                type="email"
                id="email"
                name="email"
                label="Your Email"
                error={!!form_data.email_error}
                helperText={form_data.email_error}
                value={form_data.email || ""}
                onChange={this.handleChange("email")}
              />
            </div>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default PanDetails;
