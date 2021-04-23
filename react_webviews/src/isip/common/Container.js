import React, { Component , Fragment} from 'react';
import { withRouter } from 'react-router';

import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listener';
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
// eslint-disable-next-line
  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  }

  historyGoBack = () => {

    let pathname = this.props.history.location.pathname;
    // let { params } = this.props.location;

    switch (pathname) {
      case "/isip/biller/about":
        nativeCallback({ action: 'exit', events: this.getEvents('back') });
        break;
      default:
        // if (navigator.onLine) {
        //   this.props.history.goBack();
        // } else {
        //   this.setState({
        //     openDialog: true
        //   });
        // }
        if (this.getEvents('back')) {
          nativeCallback({ events: this.getEvents('back') });
        }
        this.props.history.goBack();
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });
  }

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    nativeCallback({ action: this.state.callbackType });

  }


  handleTopIcon() {
    this.setState({
      callbackType: 'exit',
      openPopup: true,
      popupText: 'Are you sure you want to exit ?'
    })
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
