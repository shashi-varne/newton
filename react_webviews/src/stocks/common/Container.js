import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { getConfig } from "../../utils/functions";

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
      project: "stocks", //to use in common functions
    };
    this.historyGoBack = this.historyGoBack.bind(this);

    this.didMount = didMount.bind(this);
    this.commonRender = commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    const goBackPath = this.props.location?.state?.goBack || "";

    if(goBackPath) {
      this.props.history.push({
        pathname: goBackPath,
        search: getConfig().searchParams,
      });
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
