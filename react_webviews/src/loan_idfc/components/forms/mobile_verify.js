import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { validateNumber } from "utils/validators";
import { FormControl } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import Grid from "material-ui/Grid";

class MobileVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "mobile_verification",
      mobile_no: "",
      terms_and_conditions_clicked: "no",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

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

  render() {
    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Mobile verification"
        buttonTitle="GET OTP"
        handleClick={this.handleClick}
        disable={this.state.mobile_no.length !== 10}
      >
        <div className="verify-mobile">
          <div className="subtitle">
            We'll send you a <b>One Time Password</b> on this mobile number.
          </div>

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

          <div className="subtitle">
            By ticking the checkbox below you acknowledge that you have read,
            and do hereby accept the Terms and Conditions set by IDFC FIRST Bank
            to apply for a loan.
          </div>

          <div className="subtitle">
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={1} className="TextCenter">
                <Checkbox
                  defaultChecked
                  checked={true}
                  color="primary"
                  value="confirm_details_check"
                  name="confirm_details_check"
                  className="Checkbox"
                />
              </Grid>
              <Grid item xs={11}>
                <div
                  onClick={() =>
                    this.setState({ terms_and_conditions_clicked: "yes" })
                  }
                >
                  <span>
                    I accept{" "}
                    <u
                      onClick={() =>
                        this.openInTabApp(this.state.tnc, "tnc")
                      }
                      style={{ color: "var(--primary)" }}
                    >
                      Terms & condition
                    </u>
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
