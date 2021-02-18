import React, { Component , Fragment } from "react";
import { withRouter } from "react-router";

import {didmount , commonRender } from '../../common/components/container_functions';

import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listner';

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
      new_header:true,
      project: 'kyc_esign' //to use in common functions
    };

    this.didmount = didmount.bind(this);
    this.historyGoBack = this.historyGoBack.bind(this);
    this.commonRender =  commonRender.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }


  historyGoBack = (backData) => {
    
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if(this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }
    
    nativeCallback({ action: 'exit_web' });

    // switch (pathname) {
    //   case "/loan/home":
    //   case "/loan/report":
    //   case "/loan/app-update":
    //     nativeCallback({ action: "native_back"});
    //     break;
    //   default:
    //     this.props.history.goBack();
    // }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }


  handleClose = () => {
    this.setState({
      openPopup: false
    });
  }

  handlePopup = () => {
  
    this.setState({
      openPopup: false
    });

    // if(this.state.callbackType === 'loan_home') {
    //   this.navigate('/loan/home');
    // } else if(this.state.callbackType === 'loan_journey') {
    //   this.navigate('/loan/journey');
    // } else {
    //   nativeCallback({ action: this.state.callbackType });
    // }

  }


  render() {

    return(
      <Fragment>
      {this.commonRender()}
      </Fragment>
    )
  }

 
}

export default withRouter(Container);
