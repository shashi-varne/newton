import React, { Component } from "react";
import Container from "../common/Container";
import { getSummary } from "../common/ApiCalls";
import { navigate, setLoader } from "../common/commonFunctions";
import toast from "../../common/ui/Toast";
import { nativeCallback } from "utils/native_callback";

export default class Redirect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      let result = await getSummary();

      if (result.data) {
        let { portfolio_status } = result.data.external_portfolio;

        switch (portfolio_status.data.status) {
          case "INIT":
            this.navigate("email_entry");
            break;
          case "PENDING":
            this.navigate("statement_request");
            break;
          case "SUCCESS":
            this.navigate("external_portfolio");
            break;
          default:
            this.navigate("email_entry");
            break;
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
    return <Container showLoader={this.state.show_loader}></Container>;
  }
}
