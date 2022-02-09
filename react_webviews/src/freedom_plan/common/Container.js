import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "../../utils/native_callback";
import "../../utils/native_listener";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inPageTitle: true,
      openDialog: false,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: "freedom-plan", //to use in common functions
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

  historyGoBack = () => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }
    
    this.props.history.goBack();
  };

  componentDidUpdate() {
    this.didupdate();
  }

  render() {
    return <Fragment>{this.commonRender()}</Fragment>;
  }
}

export default withRouter(Container);
