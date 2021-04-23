import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import {didMount, commonRender} from '../../common/components/container_functions';


import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listner';
import {checkStringInString} from 'utils/validators';
import { goBackMap} from '../constants';

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
      project: 'lending' ,//to use in common functions
      
    };
    this.historyGoBack = this.historyGoBack.bind(this);

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


    if(this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }
    
    let pathname = this.props.history.location.pathname;

    if (checkStringInString(pathname, "form-summary")) {
      this.setState({
        callbackType: 'loan_home',
        openPopup: true,
        popupText: 'You are just 2 steps  away from getting money in your account. Do you really want to exit?'
      })
      return;
    }

    if (checkStringInString(pathname, "instant-kyc") && !checkStringInString(pathname, "instant-kyc-status")) {
      this.setState({
        callbackType: 'loan_journey',
        openPopup: true,
        popupText: 'You are just 2 steps  away from getting money in your account. Do you really want to exit?'
      })
      return;
    }

    if (checkStringInString(pathname, "loan-summary")) {
      this.setState({
        callbackType: 'loan_home',
        openPopup: true,
        popupText: 'You are just one steps  away from getting money in your account. Do you really want to exit?'
      })
      return;
    }

    if(goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }


    switch (pathname) {
      case "/loan/dmi/loan-know-more":
      case "/loan/dmi/report":
      case "/loan/dmi/app-update":
        nativeCallback({ action: "native_back"});
        break;
      default:
        this.props.history.goBack();
    }
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

    if(this.state.callbackType === 'loan_home') {
      this.navigate('/loan/dmi/loan-know-more');
    } else if(this.state.callbackType === 'loan_journey') {
      this.navigate('/loan/dmi/journey');
    } else {
      nativeCallback({ action: this.state.callbackType });
    }

  }

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
