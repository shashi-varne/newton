import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { isFunction } from "../../utils/validators";
import './Style.scss';

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
      project: "withdraw", //to use in common functions
    };

    this.historyGoBack = this.historyGoBack.bind(this);
    this.handleTopIcon = this.handleTopIcon.bind(this);
    this.didMount = didMount.bind(this);
    this.commonRender = commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  handleTopIcon = () => {
    this.props.handleTopIcon();
  };

  historyGoBack = (backData) => {
    let { params } = this.props.location

    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' })
      return
    }

    if (isFunction(this.props.goBack)) {
      return this.props.goBack(params)
    }
    nativeCallback({ events: this.getEvents('back') })
    this.props.history.goBack()
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {
    let props_base = {
      classOverRide: this?.props?.noInvestments ? "loanMainContainer withdraw-no-investments-override" : "loanMainContainer",
    };

    return <Fragment>{this.commonRender(props_base)}</Fragment>;
  }
}

export default withRouter(Container);
