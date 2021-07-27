import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { navigate as navigateFunc } from "../../utils/functions";
import { storageService } from "../../utils/validators";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: "kyc", //to use in common functions
    };
    this.historyGoBack = this.historyGoBack.bind(this);

    this.didMount = didMount.bind(this);
    this.commonRender = commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
    this.navigate = navigateFunc.bind(this.props);
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    const fromState = this.props.location?.state?.fromState || "";
    const toState = this.props.location?.state?.toState || "";
    const params = this.props.location?.params || {};
    const pathname = this.props.location?.pathname || "";

    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    
    if (toState) {
      let isRedirected = this.backButtonHandler(this.props, fromState, toState, params);
      if (isRedirected) {
        return;
      }
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    const goBackPath = this.props.location?.state?.goBack || "";

    if (goBackPath) {
      if (goBackPath === "exit" && storageService().get("native")) {
        switch (pathname) {
          case "/kyc/home":
          case "/kyc/add-bank":
          case "/kyc/approved/banks/doc":
          case "/kyc/journey":
            nativeCallback({ action: "exit_web" });
            break;
          default:
            console.log("Props history goBack...")
            this.props.history.goBack();
        }
        return;
      }
      this.navigate(goBackPath);
      return;
    }

    this.props.history.goBack();
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {
    return <Fragment>{this.commonRender()}</Fragment>;
  }
}

export default withRouter(Container);
