import React, { Component } from "react";
import Container from "../../common/Container";
import ContactUs from "../../../common/components/contact_us";
import { initialize } from "../../common/functions";

class SystemError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      vendor_application_status: "",
      screen_name: "system_error",
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleClick = () => {
    this.navigate("home");
  };

  goBack = () => {
    this.navigate("home");
  };

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="System error"
        buttonTitle="OK"
        handleClick={this.handleClick}
        headerData={{
          icon: "close",
          goBack: this.goBack,
        }}
      >
        <div className="idfc-loan-status">
          <img
            src={require(`assets/${this.state.productName}/error_illustration.svg`)}
            className="center"
            alt=""
          />
          <div className="subtitle">
            Oops! Something's not right. Please check back in some time.
          </div>
          <ContactUs />
        </div>
      </Container>
    );
  }
}

export default SystemError;
