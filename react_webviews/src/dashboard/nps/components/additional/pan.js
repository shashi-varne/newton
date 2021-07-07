import React, { Component } from "react";
import Container from "../../../common/Container";
import Input from "common/ui/Input";
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
import { storageService } from "utils/validators";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";

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
      isKycApproved: false,
      isMobileVerified: false,
      isEmailVerified: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let currentUser = storageService().getObject("user");
    let userKyc = storageService().getObject("kyc");
    let { form_data, isKycApproved, is_nps_contributed, isMobileVerified, isEmailVerified } = this.state;

    isKycApproved = userKyc.pan.meta_data_status === 'approved';
    isMobileVerified = !!userKyc.identification?.meta_data?.mobile_number && userKyc.identification?.meta_data?.mobile_number_verified;
    isEmailVerified = !!userKyc.identification?.meta_data?.email && userKyc.identification?.meta_data?.email_verified;
    form_data.dob = userKyc.pan.meta_data.dob || "";
    form_data.pan = userKyc.pan.meta_data.pan_number || "";

    form_data.email = userKyc.identification.meta_data.email || "";
    let mobile_number = userKyc.identification?.meta_data?.mobile_number || "";
    let country_code = "";
    if (mobile_number && !isNaN(mobile_number.toString().split("|")[1])) {
      country_code = mobile_number.split("|")[0];
      mobile_number = mobile_number.split("|")[1];
    }
    form_data.mobile_number = mobile_number || "";
    form_data.country_code = country_code;

    form_data.pran = storageService().get("nps_pran_number") || ""
    if(!isEmpty(form_data.pran)) {
      is_nps_contributed = true;
    }
    this.sendEvents();
    this.setState({
      currentUser: currentUser,
      isKycApproved: isKycApproved,
      userKyc: userKyc,
      form_data: form_data,
      is_nps_contributed,
      isMobileVerified,
      isEmailVerified,
    });
  };

  sendEvents = (userAction) => {
    let eventObj = {
      event_name: "pan screen",
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;
    const phoneRegEx = /[0-9]+$/
    if (name === "mobile_number" && value) {
      if (!phoneRegEx.test(value)) {
        return;
      }
    }

    if (name === "pran") {
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

    if (!form_data.pan) {
      form_data.pan_error = "This is required."
      canSubmit = false
    } else
    if (form_data.pan && !validatePan(form_data.pan)) {
      form_data.pan_error = "invalid pan";
      canSubmit = false;
    }
    if (is_nps_contributed && !form_data.pran) {
      form_data.pran_error = "This is required."
      canSubmit = false;
    } else
    if (is_nps_contributed && form_data.pran.toString().length !== 12) {
      form_data.pran_error = "invalid pran";
      canSubmit = false;
    }
    if (!currentUser.mobile && !form_data.mobile_number) {
      form_data.mobile_number_error = "This is required."
      canSubmit = false;
    } else
    if (!currentUser.mobile && form_data.mobile_number.toString().length !== 10) {
      form_data.mobile_number_error = "invalid mobile number";
      canSubmit = false;
    }

    if (!currentUser.email && !validateEmail(form_data.email)) {
      form_data.email_error = "invalid email";
      canSubmit = false;
    }

    if (IsFutureDate(form_data.dob)) {
      form_data.dob_error = "future date not allowed";
      canSubmit = false;
    }
    if (!form_data.dob) {
      form_data.dob_error = "This is required."
      canSubmit = false
    } else
    if (form_data.dob && !isValidDate(form_data.dob)) {
      form_data.dob_error = "invalid date";
      canSubmit = false;
    }

    this.setState({
      form_data: form_data,
    });

    if (canSubmit) {
      let { pan, identification } = userKyc;

      if (is_nps_contributed) {
        storageService().set("nps_pran_number", form_data.pran);
      } else {
        storageService().set("nps_pran_number", '');
      }
      pan.meta_data.dob = form_data.dob;
      pan.meta_data.pan_number = form_data.pan;

      identification.meta_data.email = form_data.email;

      let mobile_number = form_data.mobile_number?.toString();
      if (form_data.country_code) {
        mobile_number = form_data.country_code + "|" + mobile_number;
      }
      identification.meta_data.mobile_number = mobile_number;

      let data = {
        kyc: {
          pan: pan.meta_data,
          identification: identification.meta_data,
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
        data-aid='dialog-bottom-popup'
      >
        <DialogContent>
          <div className="nps-dialog" id="alert-dialog-description" data-aid='alert-dialog-description'>
            <div className="nps-dialog-content" data-aid='nps-dialog-content'>
              <div className="content">
                <div className="title">{this.state.title}</div>
                <div className="sub-title">{this.state.subtitle}</div>
              </div>
              <img
                src={require(`assets/${this.state.productName}/popup_kyc_pending.svg`)}
                alt=""
              />
            </div>
            <div className="btn" data-aid='nps-btn'>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => this.handleClose()}
                className="call-back-popup-button not-now"
                data-aid='not-now-btn'
              >
                NOT NOW
              </button>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => this.cta_action()}
                className="call-back-popup-button"
                data-aid='call-back-btn'
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
    let { btn_text, form_data, auth_ids } = this.state;
    if (btn_text === "SIGN OUT") {
      if (getConfig().Web) {
        this.navigate("/logout");
      } else {
        nativeCallback({ action: "session_expired" });
      }
    } else if(btn_text === "LINK ACCOUNT") {
      storageService().setObject("auth_ids", auth_ids)
      this.navigate(`/account/merge/${form_data.pan.toUpperCase()}`)
    }
  }

  goBack = () => {
    this.navigate('/nps/info')
  }

  render() {
    const { form_data, is_nps_contributed, currentUser, isKycApproved, isMobileVerified, isEmailVerified } = this.state;
    return (
      <Container
        data-aid='nps-pan-details-screen'
        classOverRIde="pr-error-container"
        buttonTitle="PROCEED"
        hideInPageTitle
        title="PAN Details"
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClick={this.handleClick}
        goBack={this.goBack}
        handleClick1={this.handleClick}
        headerData={{
          goBack: this.goBack
        }}
      >
        <div className="pan-details" data-aid='pan-details-page'>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                width="30"
                id="pan"
                label="PAN number"
                name="pan"
                error={!!form_data.pan_error}
                helperText={form_data.pan_error}
                value={form_data.pan || ""}
                maxLength={10}
                onChange={this.handleChange("pan")}
                disabled={isKycApproved}
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
                value={this.state.is_nps_contributed}
                onChange={this.handleChangeRadio}
              />
            </div>

            {is_nps_contributed && (
              <div className="InputField">
                <Input
                  width="30"
                  id="pran"
                  label="PRAN number"
                  inputMode="numeric"
                  pattern="[0-9]{12}"
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
              <Input
                width="30"
                id="dob"
                name="dob"
                label="Your date of birth"
                error={!!form_data.dob_error}
                helperText={form_data.dob_error}
                value={form_data.dob || ""}
                maxLength={10}
                onChange={this.handleChange("dob")}
                disabled={isKycApproved}
              />
            </div>

            {currentUser.mobile === null && (
              <div className="InputField">
                <Input
                  width="30"
                  id="number"
                  name="mobile_number"
                  inputMode="numeric"
                  maxLength={10}
                  label="Enter Mobile Number"
                  pattern="[0-9]{10}"
                  class="Mobile"
                  error={!!form_data.mobile_number_error}
                  helperText={form_data.mobile_number_error}
                  value={form_data.mobile_number || ""}
                  onChange={this.handleChange("mobile_number")}
                  disabled={isMobileVerified}
                />
              </div>
            )}

            {currentUser.email === null && (
              <div className="InputField">
                <Input
                  width="30"
                  type="email"
                  id="email"
                  name="email"
                  label="Your Email"
                  error={!!form_data.email_error}
                  helperText={form_data.email_error}
                  value={form_data.email || ""}
                  onChange={this.handleChange("email")}
                  disabled={isEmailVerified}
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
