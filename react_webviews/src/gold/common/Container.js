import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";

import {didmount ,commonRender} from '../../common/components/container_functions';


import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listner';
import {checkStringInString, storageService} from 'utils/validators';
import {forceBackState, goBackMap} from '../constants';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      inPageTitle: true,
      new_header:true,
      force_hide_inpage_title: false,
      project: 'gold' //to use in common functions
    };

    this.didmount = didmount.bind(this);
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
    
    let fromHeader = backData ? backData.fromHeader : false;
    let pathname = this.props.history.location.pathname;

    let provider = '';
    if(checkStringInString(pathname, "safegold")) {
      provider = 'safegold';
    }

    if(checkStringInString(pathname, "mmtc")) {
      provider = 'mmtc';
    }

    if (fromHeader && checkStringInString(pathname, "check-how")) {
      this.navigate("/gold/landing");
      return;
    }

    if(forceBackState()) {
      // let state = forceBackState();
      storageService().remove('forceBackState');
      // this.navigate(state);
      // return;
    }

    if(goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }
    
    if (checkStringInString(pathname, "payment")) {
      this.navigate("/gold/landing");
      return;
    }


    if(checkStringInString(pathname, "gold-delivery-order")) {
      this.navigate("/gold/" + provider +  "/delivery-select-address");
      return;
    }

    if(checkStringInString(pathname, "delivery-select-address")) {
      this.navigate("/gold/" + provider +  "/select-gold-product");
      return;
    }

    if(checkStringInString(pathname, "select-gold-product")) {
      this.navigate("/gold/delivery-products");
      return;
    }

    if(checkStringInString(pathname, "sell-select-bank")) {
      this.navigate("/gold/sell");
      return;
    }

    switch (pathname) {
      case "/gold/gold-locker":
        this.navigate("/gold/landing");
        break;
      case "/gold":
      case "/gold/my-gold":
      case "/gold/about":
      case "/gold/landing":
        nativeCallback({ action: "native_back"});
        break;
      default:
        this.props.history.goBack();
    }
  };


  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({fromHeader: true});
  }

  handlePopup = () => {
    this.setState({
        openPopup: false
    });

    nativeCallback({ action: "native_back", events: this.getEvents("back") });
  };

  render() {
    return(
      <Fragment>
      {this.commonRender()}
      </Fragment>
    )
  }
}

export default withRouter(Container);
