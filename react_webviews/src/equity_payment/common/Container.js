import React, { Component , Fragment } from "react";
import { withRouter } from "react-router";

import { didMount ,commonRender } from '../../common/components/container_functions';

import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listener';
import { checkStringInString } from 'utils/validators';
import { goBackMap } from '../constants';

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
      project: 'payment' //to use in common functions
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

  historyGoBack = (backData) => {

    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }


    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;
    if (checkStringInString(pathname, "home")) {
      this.setState({
        callbackType: 'exit',
        openPopup: true,
        popupText: 'Are you sure you want to exit the payment process?'
      })
      return;
    }

    if (goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }


    switch (pathname) {
      case "/pg/neft":
        this.props.history.goBack();
        break;
      default:
        this.props.history.goBack();
        break;
    }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
  }

  handleClose = () => {
    this.setState({
      openPopup: false
    });
  }

  handlePopup = () => {

    let eventObj = {
      "event_name": "Payment failed",
      "properties": {
        "reason": "dropped"
      }
    };
    nativeCallback({ events: eventObj });
    this.setState({
      openPopup: false
    });
    nativeCallback({ action: this.state.callbackType });

  }


  render() {
    let props_base = {
      classOverRide : 'paymentMainContainer'
    }

    return(
      <Fragment>
      {this.commonRender(props_base)}
      </Fragment>
    )
  }
}

export default withRouter(Container);
