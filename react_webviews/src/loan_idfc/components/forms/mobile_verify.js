import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { validateNumber } from "utils/validators";
import { FormControl } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import Grid from "material-ui/Grid";
import scrollIntoView from "scroll-into-view-if-needed";
import ReactHtmlParser from "react-html-parser";

class MobileVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      screen_name: "mobile_verification",
      mobile_no: "",
      terms_and_conditions_clicked: "no",
      checked: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let tnc = [
      "I/We authorise IDFC First Bank to submit application/other relevant documents submitted by me to CERSAI. I/We hereby provide my consent to IDFC First Bank to receive my KYC information from the Central KYC Registry.",
      "I hereby authorise the Bank, without any notice to me to conduct credit checks, references, make enquiries, in its sole discretion and also authorise the Bank and its agents to share and obtain information, records from any agencies, statutory bodies, credit bureau, bank, financial institutions, or any third party in respect of the application, as it may consider necessary. The Bank shall not be liable for use/ sharing of the information.",
      "I confirm that laws in relation to the unsolicited communication referred in “National Do Not Call Registry” as laid down by Telecom Regulatory of India will not be applicable for such communications/ calls/ SMSs received from IDFC FIRST Bank Limited, its representatives, agents. I hereby provide consent to send SMS confirmation to reference contacts provided by me as part of the loan application process. I hereby consent to receive information about my loans and offers on WhatsApp on my registered number. The Bank reserves the right to retain the photograph and documents submitted with the Application and shall not be returned back. IDFC FIRST Bank Limited shall be entitled at its sole and absolute discretion to approve/reject this Application Form submitted by Applicant/Co-Applicant /Guarantor.",
    ];

    this.setState({
      tnc: tnc,
    });
  }

  onload = () => {};

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
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

  handleScroll = () => {
    setTimeout(function () {
      let element = document.getElementById("agreeScroll");
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

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "mobile number verification",
        "t&c_clicked": this.state.terms_and_conditions_clicked,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = (event) => {
    let value = event.target.value;

    if ((value && !validateNumber(value)) || value.length > 10) {
      return;
    }

    this.setState({
      mobile_no: value || "",
      mobile_no_error: "",
    });
  };

  handleClick = async () => {
    this.sendEvents("next");

    let { mobile_no } = this.state;

    let canSubmitForm = true;

    if (mobile_no.length !== 10 || !validateNumber(mobile_no)) {
      canSubmitForm = false;
      this.setState({
        mobile_no_error: "Please enter valid mobile no.",
      });
    }

    if (canSubmitForm) {
      let params = {
        mobile_no: mobile_no,
      };
      this.updateApplication(params);
    }
  };

  renderAgreement = (props, index) => {
    return (
      <div
        key={index}
        id={"agreement_" + index}
        className="agree-tiles"
        onClick={() => this.handleAgreement(props)}
      >
        <div className="agree-tiles-left"></div>
        <div className="agree-tiles-right">{ReactHtmlParser(props)}</div>
      </div>
    );
  };

  handleCheckbox = () => {
    let { checked } = this.state;

    this.setState({
      checked: !checked,
    });
  };

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title="Verify mobile"
        buttonTitle="GET OTP"
        handleClick={this.handleClick}
        disable={!this.state.checked}
      >
        <div className="verify-mobile">
          <div className="subtitle">
            Enter your 10 digit mobile number to receive OTP
          </div>

          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.mobile_no_error}
                helperText={this.state.mobile_no_error}
                type="text"
                width="40"
                label="Mobile number"
                class="mobile"
                maxLength={10}
                id="number"
                name="mobile_no"
                value={this.state.mobile_no || ""}
                onChange={this.handleChange}
                inputMode="numeric"
              />
            </div>
          </FormControl>

          <div
            className="generic-page-title"
            style={{
              margin: "0 0 20px 0 ",
              fontSize: "13px",
            }}
          >
            Terms & Conditions
          </div>
          <div
            id="agreement"
            className="agreement-block"
            onScroll={this.onScroll}
          >
            {this.state.tnc.map(this.renderAgreement)}
          </div>

          <div className="subtitle">
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={1} className="TextCenter">
                <Checkbox
                  // defaultChecked
                  checked={this.state.checked}
                  color="primary"
                  value="confirm_details_check"
                  name="confirm_details_check"
                  className="Checkbox"
                  onChange={this.handleCheckbox}
                />
              </Grid>
              <Grid item xs={11}>
                <div>
                  <span>
                    I accept <b>Terms & Conditions</b>
                  </span>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    );
  }
}

export default MobileVerification;
