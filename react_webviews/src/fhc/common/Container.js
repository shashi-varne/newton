import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';
import { storageService } from '../../utils/validators';
import { uploadFHCData } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
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
      productName: getConfig().productName
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
      nativeCallback({ action: 'exit' });
      return;
    }
    switch (pathname) {
      case "/fhc":
      case "/fhc/final-report":
        storageService().remove('fhc_data'); // remove cached fhc data
        nativeCallback({ action: 'exit', events: this.getEvents('back') });
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
      storageService().remove('fhc_data'); // remove cached fhc data when exiting
      nativeCallback({ action: this.state.callbackType, events: this.getEvents('exit_yes') });
    } catch (e) {
      this.setState({ show_loader: false });
      console.log(e);
      toast(e);
    }
  }

  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: <Fragment>Are you sure you want to <b>exit</b>? 
        <br />We will save your information securely.
      </Fragment>
    })
  }


  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  render() {

    return(
      <Fragment>
      {this.commonRender()}
      </Fragment>
    )
  }
};

export default withRouter(Container);