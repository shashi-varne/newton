import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

<<<<<<< HEAD
import Header from "../../common/components/Header";
import { didMount } from "../../common/components/container_functions";
=======
import {didMount, commonRender} from "../../common/components/container_functions";
>>>>>>> WVFIS-814-new-loader-changes-idfc
import { renderPageLoader, renderGenericError } from '../../common/components/container_functions';

import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listner";
import { goBackMap } from "../constants";

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
      project: "lending", //to use in common functions
    };

<<<<<<< HEAD
    this.didmount = didMount.bind(this);
=======
    this.didMount = didMount.bind(this);
>>>>>>> WVFIS-814-new-loader-changes-idfc
    this.renderPageLoader = renderPageLoader.bind(this);
    this.renderGenericError = renderGenericError.bind(this);
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

    if (goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }

    switch (pathname) {
      case "/loan/home":
        nativeCallback({ action: "native_back" });
        break;
      default:
        this.props.history.goBack();
    }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
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
