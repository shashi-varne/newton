import React, { Component } from 'react';
import qs from 'qs';

// import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import { nativeCallback } from 'utils/native_callback';

class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openDialog: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }


  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Feedback Popup'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    nativeCallback({ action: 'exit' });
  }

  handleClose() {
    this.setState({
      openDialog: false,
      show_loader: true
    });
  }



  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Mandate(OTM)"
        handleClick={this.handleClick}
        classOverRide="result-container"
        classOverRideContainer="result-container"
        edit={this.props.edit}
        buttonTitle="Add Biller"
        type={this.state.type}
        events={this.sendEvents('just_set_events')}
        noFooter={true}
      >
      </Container>

    );
  }
}

export default Success;
