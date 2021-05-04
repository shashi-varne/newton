import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { storageService } from "utils/validators";

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

  historyGoBack = async (backData) => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    const toStatePath = this.props.location?.state?.toState || "";

    if(toStatePath) {
      if (getConfig().isSdk && storageService().get('native')) {
        nativeCallback({ action: "exit_web" });
      } else {
        this.props.history.push({
          pathname: toStatePath,
          search: getConfig().searchParams,
        });
      }
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
