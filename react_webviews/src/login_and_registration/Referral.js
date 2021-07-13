import "./commonStyles.scss";
import React, { Component } from 'react';
import Container from "../dashboard/common/Container";
import WVInPageSubtitle from "../common/ui/InPageHeader/WVInPageSubtitle"
import Input from "common/ui/Input";
import { initialize } from "./function";
import { getConfig } from "utils/functions";


class Referral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      insurance_details: {},
      productName: getConfig().productName,
      form_data: {},
      isPromoApiRunning: false,
    }
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }


  componentDidUpdate(){
    if(this.state.promo_status === "Valid")  this.navigate("/secondary-verification")
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let { form_data } = this.state;
    form_data[name] = value;
    form_data[`${name}_error`] = "";
    this.setState({ form_data: form_data });
  };

  render() {

    const { form_data, isPromoApiRunning } = this.state;

    return (
      <Container
        fullWidthButton={true}
        twoButtonVertical={true}
        dualbuttonwithouticon={true}
        button1Props={{
          type: 'primary',
          title: "CONTINUE",
          showLoader: isPromoApiRunning,
          onClick : () => this.verifyCode(form_data)
        }}
        button2Props={{
          type: 'secondary',
          title: "SKIP",
          onClick: () => this.navigate("/secondary-verification"),
          showLoader: false,
        }}
        showLoader={this.state.showLoader}
        title="Do you have a referral code?">


        <WVInPageSubtitle children={"This will map your account with our partner"} />

        <div className="form-field">
          <Input
            error={form_data?.referral_code ? true : false}
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