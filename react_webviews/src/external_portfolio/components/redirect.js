import React, { Component } from "react";
import Container from "../common/Container";
import { getSummary } from "../common/ApiCalls";
import { navigate, setLoader, setPlatformAndUser } from "../common/commonFunctions";
import toast from "../../common/ui/Toast";
import { nativeCallback } from "utils/native_callback";

export default class Redirect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
    setPlatformAndUser();
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let body = {
        "external_portfolio": [
          "portfolio_status"
        ]
      }

      let result = await getSummary(body);

      if (result.data) {
        const { portfolio_status } = result.data.external_portfolio;

        if (portfolio_status?.data?.link) {
          window.location.replace(portfolio_status.data.link);
        } else {
          this.navigate("email_entry", {}, true);
        }
      } else {
        nativeCallback({ action: "exit"});
      }
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  render() {
    return (
      <Container
        goBack={() => nativeCallback({ action: 'exit' })}
        showLoader={this.state.show_loader}
      ></Container>
    );
  }
}
