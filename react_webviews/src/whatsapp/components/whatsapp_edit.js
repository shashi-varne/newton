import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";
import Input from "../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import { numberShouldStartWith, validateNumber } from 'utils/validators';
import Api from 'utils/api';
import { toast } from "react-toastify";

class WnatsappEditNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "edit mobile number",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ event: eventObj });
    }
  }

  handleChange = name => event => {
    let value = event.target.value;
    
    this.setState({
      mobile_no: value,
      mobile_no_error: ''
    })
  }

  handleClick = async () => {
    this.sendEvents('next');
    let canProceed = true;
    let mobile = this.state.mobile_no;

    if (mobile.length !== 10 || !validateNumber(mobile) ||
      !numberShouldStartWith(mobile)) {
      canProceed = false;
      this.setState({
        mobile_no_error: 'Please enter valid mobile no.'
      })
    }

    if (canProceed) {
      let body = {
        mobile: mobile
      }
      try {
        // let res = await Api.post('/api/communication/send/otp', body);

        // var resultData = res.pfwresponse.result;

        // if (res.pfwresponse.status_code === 200 && !resultData.error) {
        //   console.log(resultData)
        // }
        let otp_id = 36;
        this.navigate('otp-verify', {
          params: {
            otp_id: otp_id,
            mobile: mobile
          }
        })

      } catch (err) {
        console.log(err)
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="WhatsApp mobile number"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
      >
        <div
          style={{ fontSize: "13px", color: "#8D879B", marginBottom: "20px" }}
        >
          Confirm your WhatsApp mobile number to get the latest updates about
          your account
        </div>

        <FormControl fullWidth>
          <div className="InputField">
            <Input
              error={!!this.state.mobile_no_error}
              helperText={this.state.mobile_no_error}
              type="number"
              width="40"
              label="Enter mobile number"
              class="Mobile"
              maxLength={10}
              id="number"
              name="mobile_no"
              value={this.state.mobile_no || ""}
              onChange={this.handleChange("mobile_no")}
            />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default WnatsappEditNumber;
