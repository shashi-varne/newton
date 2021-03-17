import React, { Component , Fragment } from 'react';
import { withRouter } from 'react-router';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';


import {didMount ,commonRender} from '../../common/components/container_functions';



class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      productName: getConfig().productName
    }
    this.handleTopIcon = this.handleTopIcon.bind(this);
    this.handlePopup = this.handlePopup.bind(this);

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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  historyGoBack = () => {
    this.setState({
      back_pressed: true
    });
    let pathname = this.props.history.location.pathname;
    let { params } = this.props.location;
    let { search } = this.props.location;

    if (search.indexOf('goBack') < 0) {
      if (pathname.indexOf('result') >= 0) {
        if (getConfig().isWebCode) {
          nativeCallback({ events: this.getEvents('back') });
          this.props.history.goBack();
        } else {
          nativeCallback({ action: 'exit', events: this.getEvents('back') });
        }
        return;
      }
    }

    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' });
      return;
    }

    // if (pathname.indexOf('question1') >= 0) {
    //   nativeCallback({ events: this.getEvents('back') });
    //   this.navigate('intro');
    //   return;
    // }

    switch (pathname) {
      case "/risk":
      case "/risk/intro":
        if (getConfig().isWebCode) {
          nativeCallback({ events: this.getEvents('back') });
          this.props.history.goBack();
        } else {
          nativeCallback({ action: 'exit', events: this.getEvents('back') });
        }
        break;
      case "/risk/recommendation":
        this.navigate('result');
        break;
      default:
        if (navigator.onLine) {
          nativeCallback({ events: this.getEvents('back') });
          this.props.history.goBack();
        } else {
          this.setState({
            openDialog: true
          });
        }
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


  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    nativeCallback({ action: this.state.callbackType, events: this.getEvents('exit_yes') });
  }


  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: 'Are you sure you want to exit ?'
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
