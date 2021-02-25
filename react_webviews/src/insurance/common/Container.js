import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { getConfig } from 'utils/functions';
// import Header from './Header';
// import Footer from './footer';
// import Banner from '../../common/ui/Banner';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from 'utils/native_callback';
import '../../utils/native_listner';
import {didMount ,commonRender} from '../../common/components/container_functions';
class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  }

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    if (this.state.callbackType === 'show_quotes') {
      let eventObj = {
        "event_name": 'exit_from_payment',
        "properties": {
          "user_action": 'yes',
          "source": 'summary'
        }
      };
      nativeCallback({ events: eventObj });
      window.sessionStorage.setItem('show_quotes', true);
      this.navigate('/insurance/quote');
    }


    nativeCallback({ action: this.state.callbackType });
  }


  historyGoBack = () => {
    // let insurance_v2 = getConfig().insurance_v2;
    nativeCallback({ action: 'native_back' });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });

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
