import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
  handleOnBackClick
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { navigate as navigateFunc } from "../../utils/functions";

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
      project: "landing", //to use in common functions
    };
    this.historyGoBack = this.historyGoBack.bind(this);
    this.handleTopIcon = this.handleTopIcon.bind(this);

    this.didMount = didMount.bind(this);
    this.commonRender = commonRender.bind(this);
    this.handleOnBackClick = handleOnBackClick.bind(this);
  }

  componentDidMount() {
    this.didMount();
    this.navigate = navigateFunc.bind(this.props);
  }

  componentWillUnmount() {
    this.unmount();
  }

  handleTopIcon = () => {
    this.props.handleTopIcon();
  };

  historyGoBack = (backData) => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    const backHandle = this.handleOnBackClick();
    if(backHandle) {
      return;
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    const goBackPath = this.props.location?.state?.goBack || "";

    if(goBackPath) {
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
