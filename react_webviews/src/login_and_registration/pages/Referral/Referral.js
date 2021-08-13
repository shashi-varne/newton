import React, { Component } from 'react';
import Container from "../../../dashboard/common/Container";
import WVInPageSubtitle from "../../../common/ui/InPageHeader/WVInPageSubtitle"
import Input from "common/ui/Input";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import toast from "common/ui/Toast";
import Api from "utils/api";
const errorMessage = "Something went wrong!";

class Referral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      insurance_details: {},
      productName: getConfig().productName,
      form_data: {},
      isPromoApiRunning: false,
      referralError: false,
    }
    this.navigate = navigateFunc.bind(this.props);
  }

  componentWillMount() {
    const { state } = this.props.location;
    let communicationType = state?.communicationType || "mobile";
    this.setState({ communicationType })
  }


  componentDidUpdate() {
    if (this.state.promo_status === "Valid") {
      this.navigate("/secondary-verification", {
        state: {
          communicationType: this.state.communicationType === "mobile" ? "email" : "mobile"
        }
      })
    };
  };

  verifyCode = async (form_data) => {
    if (!form_data.referral_code) {
      form_data[`referral_code_error`] = "This is required";
      this.setState({ form_data: form_data });
      return;
    }
    this.setState({ isPromoApiRunning: true });
    let body = {
      code: form_data.referral_code,
    };
    try {
      const res = await Api.get(`/api/checkpromocode`, body);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        toast("Success");
        this.sendEvents("next")
        this.setState({
          isPromoSuccess: true,
          promo_status: "Valid",
          isPromoApiRunning: false,
          form_data
        });
      } else {
        this.setState({
          isPromoSuccess: false,
          promo_status: "Invalid",
          isPromoApiRunning: false,
          referralError: true,
        });
        toast(result.message || result.error || errorMessage);
      }
    } catch (error) {
      console.log(error);
      toast(errorMessage);
      this.setState({ isPromoApiRunning: false });
    }
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data , referralError: false});
  };

  sendEvents = (userAction) => {
    let properties = {
      "user_action": userAction,
      "screen_name": "referral_code",
    }
    let eventObj = {
      "event_name": 'onboarding',
      "properties": properties,
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  render() {

    const { form_data, isPromoApiRunning } = this.state;

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        twoButtonVertical={true}
        dualbuttonwithouticon={true}
        button1Props={{
          variant: "contained",
          title: "CONTINUE",
          showLoader: isPromoApiRunning,
          onClick: () => this.verifyCode(form_data)
        }}
        button2Props={{
          variant: "outlined",
          title: "SKIP",
          onClick: () => {
            this.sendEvents("skip");
            this.navigate("/secondary-verification", {
              state: {
                communicationType: this.state.communicationType === "mobile" ? "email" : "mobile",
              }
            })
          },
          showLoader: false,
        }}
        showLoader={this.state.showLoader}
        title="Do you have a referral code?">


        <WVInPageSubtitle children={"This will map your account with our partner"} />

        <div className="form-field">
          <Input
            error={this.state.referralError}
            type="text"
            value={form_data.referral_code}
            helperText={form_data.referral_code_error || ""}
            class="input"
            id="referral_code"
            label="Referral code"
            name="referral_code"
            onChange={this.handleChange("referral_code")}
          />
        </div>

      </Container>
    )
  }
}

export default Referral;