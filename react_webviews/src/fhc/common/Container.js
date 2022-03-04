import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { nativeCallback, handleNativeExit } from 'utils/native_callback';
import '../../utils/native_listener';
import { getConfig } from 'utils/functions';
import { storageService } from '../../utils/validators';
import { uploadFHCData } from '../common/ApiCalls';
import { navigate } from './commonFunctions';

import {didMount ,commonRender} from '../../common/components/container_functions';
class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      show_loader: false,
      popupText: '',
      callbackType: '',
      productName: getConfig().productName,
    }
    this.handleTopIcon = this.handleTopIcon.bind(this);
    this.historyGoBack = this.historyGoBack.bind(this);
    // this.handleYes = this.handleYes.bind(this);
    this.navigate = navigate.bind(this);
    this.didMount = didMount.bind(this);
    this.commonRender =  commonRender.bind(this);
  }
  
  componentDidMount() {
    this.didMount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = () => {
    this.setState({
      back_pressed: true,
    });
    let pathname = this.props.history.location.pathname;
    let { params } = this.props.location;
    if (params && params.disableBack) {
      handleNativeExit(this.props, {action: "exit"});
      return;
    }
    switch (pathname) {
      case "/fhc":
      case "/fhc/final-report":
        storageService().remove('fhc_data'); // remove cached fhc data
        nativeCallback({ events: this.getEvents('back') });
        handleNativeExit(this.props, {action: "exit"});
        break;
      case "/fhc/personal1":
        this.navigate('/fhc', { fromScreen1: true });
        break;
      default:
        this.props.history.goBack();
    }
  }

  handleClose = () => {
    if (this.state.openPopup) {
      nativeCallback({ events: this.getEvents('exit_no') });
    }
    this.setState({
      openDialog: false,
      openPopup: false
    });

  }

  handlePopup = async () => {
    this.setState({
      openPopup: false
    });
    this.setState({ show_loader: true });
    try {
      const fhc_data = storageService().getObject('fhc_data');
      await uploadFHCData(fhc_data, true);
    } catch (e) {
      this.setState({ show_loader: false });
    } finally {
      storageService().remove('fhc_data'); // remove cached fhc data when exiting
      nativeCallback({ events: this.getEvents('exit_yes') });
      handleNativeExit(this.props, {action: this.state.callbackType});
    }
  }

  handleTopIcon() {
    if (this.props.topIcon === "close") {
      this.setState({
        callbackType: 'exit',
        openPopup: true,
        popupText: <Fragment>Are you sure you want to <b>exit</b>? 
          <br />We will save your information securely.
        </Fragment>
      })
    } else if (this.props.topIcon === "restart") {
      this.props.handleReset()
    }
  }


  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {

    let props_base = {
      classOverRide: 'fhc-container'
    }

    return(
      <Fragment>
      {this.commonRender(props_base)}
      </Fragment>
    )
  }
};

export default withRouter(Container);