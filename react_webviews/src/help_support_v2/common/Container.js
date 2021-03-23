import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import { didMount, commonRender } from "common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listner";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      callbackType: "",
      // inPageTitle: true,
      new_header: true,
      force_hide_inpage_title: false,
      project: "help",
    };

    this.didMount = didMount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({fromHeader: true});
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let action = 'back';
    nativeCallback({ events: this.getEvents(action) });

    switch (pathname) {
      case "/help":
        nativeCallback({ action: "exit", events: this.getEvents() });
        break;
      default:
        this.props.history.goBack();
    }
  };

  render() {
    let props_base = {
      classOverRide : 'loanMainContainer'
    }
    return(
      <Fragment>
      {this.commonRender(props_base)}
      </Fragment>
    )
  }
}

export default withRouter(Container);
