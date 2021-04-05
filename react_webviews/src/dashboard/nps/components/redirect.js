import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { getUrlParams } from "utils/validators";
import { initialize } from "../common/commonFunctions";
import { getConfig } from "../../../utils/functions";

export default class NpsPaymentRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let params = getUrlParams();
    let payment_status = "";

    for (var i in params) {
      let key = i.split(";")[1] || i.split(";")[0];

      if (key.length > 2) {
        payment_status = params[i].split("/")[1];
      }
    }

    let data = {
      searchParams: getConfig().searchParams + '&generic_callback=true'
    }

    this.navigate(`payment/callback/one-time/${payment_status}`)
  };

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        showLoader={this.state.show_loader}
        noFooter
        classOverRideContainer="pr-container"
      >
        <div></div>
      </Container>
    );
  }
}
