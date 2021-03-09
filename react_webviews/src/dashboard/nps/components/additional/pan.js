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
import {
  dobFormatTest,
  formatDate,
  isValidDate,
  IsFutureDate,
  validateEmail,
  validatePan,
} from "utils/validators";
import Grid from "material-ui/Grid";
import { storageService } from "utils/validators";
import Dialog, { DialogContent } from "material-ui/Dialog";

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
      currentUser: "",
      is_nps_contributed: false,
      show_loader: false,
      openDialog: false,
      title: "",
      subtitle: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let currentUser = storageService().getObject("user");
    let userKyc = storageService().getObject("kyc");
    let { form_data } = this.state;

    form_data.dob = userKyc.pan.meta_data.dob || "";
    form_data.pan = userKyc.pan.meta_data.pan_number || "";

    form_data.email = userKyc.address.meta_data.email || "";
    form_data.mobile_number = userKyc.address.meta_data.mobile_number || "";

    this.setState({
      currentUser: currentUser,
      userKyc: userKyc,
      form_data: form_data,
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;

    if (name === "mobile_number" || name === "pran") {
      value = !isNaN(parseInt(value, 10)) && parseInt(value, 10);
    }

    if (name === "dob") {
      if (!dobFormatTest(value)) {
        return;
      }

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
    let { form_data, userKyc, is_nps_contributed, currentUser } = this.state;
    let canSubmit = true;

    if (!validatePan(form_data.pan)) {
      form_data.pan_error = "invalid pan";
      canSubmit = false;
    }

    if (
      is_nps_contributed &&
      (!form_data.pran || form_data.pran.toString().length !== 12)
    ) {
      form_data.pran_error = "invalid pran";
      canSubmit = false;
    }

    if (currentUser.mobile === null && !form_data.mobile_number.length !== 10) {
      form_data.mobile_number_error = "invalid mobile_number";
      canSubmit = false;
    }

    if (currentUser.email === null && !validateEmail(form_data.email)) {
      form_data.email_error = "invalid email";
      canSubmit = false;
    }

    if (IsFutureDate(form_data.dob)) {
      form_data.dob_error = "future date not allowed";
      canSubmit = false;
    }
    if (!isValidDate(form_data.dob) || !form_data.dob) {
      form_data.dob_error = "invalid date";
      canSubmit = false;
    }

    this.setState({
      form_data: form_data,
    });

    if (canSubmit) {
      let { pan, address } = userKyc;

      if (is_nps_contributed) {
        storageService().set("nps-pran_number", form_data.pran);
      } else {
        storageService().set("nps-pran_number", '');
      }

      pan.meta_data.dob = form_data.dob;
      pan.meta_data.pan_number = form_data.pan;

      address.meta_data.email = form_data.email;
      address.meta_data.mobile_number = form_data.mobile_number;

      storageService().setObject("kyc", userKyc);

      let data = {
        kyc: {
          address: address.meta_data,
          pan: pan.meta_data,
        },
      };

      this.kyc_submit(data, "amount");
    }
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openDialog || false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="nps-dialog" id="alert-dialog-description">
            <div className="nps-dialog-content">
              <div className="content">
                <div className="title">{this.state.title}</div>
                <div className="sub-title">{this.state.subtitle}</div>
              </div>
              <img
                src={require(`assets/${this.state.productName}/popup_kyc_pending.svg`)}
              />
            </div>
            <div className="btn">
              <button
                style={{ cursor: "pointer" }}
                onClick={() => this.handleClose()}
                className="call-back-popup-button not-now"
              >
                NOT NOW
              </button>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => this.cta_action()}
                className="call-back-popup-button"
              >
                {this.state.btn_text}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  cta_action = () => {
    let { btn_text } = this.state;
    if (btn_text === 'SIGN OUT') {
      this.navigate('logout')
    } else {
      this.navigate('accountmerge')
    }
  }

  goBack = () => {
    this.navigate('invest')
  }

  render() {
    let { form_data, is_nps_contributed, currentUser } = this.state;
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="PROCEED"
        hideInPageTitle
        title="PAN Details"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        goBack={this.goBack}
      >
        <div className="pan-details">
          <div className="top-title">Your Details</div>
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="pran"
                  maxLength={12}
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

            {currentUser.mobile === null && (
              <div className="InputField">
                <InputWithIcon
                  icon={phone}
                  width="30"
                  id="number"
                  name="mobile_number"
                  inputMode="numeric"
                  maxLength={10}
                  label="Enter Mobile Number"
                  pattern="[0-9]*"
                  class="Mobile"
                  error={!!form_data.mobile_number_error}
                  helperText={form_data.mobile_number_error}
                  value={form_data.mobile_number || ""}
                  onChange={this.handleChange("mobile_number")}
                />
              </div>
            )}

            {currentUser.email === null && (
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
            )}
          </FormControl>
          {this.renderDialog()}
        </div>
      </Container>
    );
  }
}

export default PanDetails;
