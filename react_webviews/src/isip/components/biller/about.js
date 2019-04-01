import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import icon from 'assets/mandate_pending_icon.svg';
import { nativeCallback } from 'utils/native_callback';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
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
        "screen_name": 'Intro'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    // this.sendEvents('next');
    this.navigate('details');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="About i-SIP Biller"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Continue"
        type={this.state.type}
      // events={this.sendEvents('just_set_events')}
      >
        <div style={{ textAlign: 'center' }}>
          <img width={100} src={icon} alt="OTM" />
        </div>
        <div style={{
          color: getConfig().default, margin: '10px 0px 10px 0px',
          fontSize: 16, textAlign: 'center'
        }}>
          One Time Bank Mandate (OTM) automates monthly debits from your bank account for monthly SIP payments. Check below for more information
        </div>
        <div style={{ marginTop: 26, marginBottom: 5 }}>
          <div style={{ display: '-webkit-box' }}>
            <div style={{
              color: '#878787', margin: '0 0 0 7px',
              fontSize: 16, fontWeight: 'bold'
            }}></div>
          </div>

          <div style={{ fontSize: 15, color: '#878787', margin: '10px 0  0 21px' }}>
            aaaaaaaaaaaaaaaaaaaa
          </div>
        </div>

      </Container>

    );
  }
}

export default About;
