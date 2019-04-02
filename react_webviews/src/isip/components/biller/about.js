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
      "event_name": 'Biller',
      "properties": {
        "user_action": user_action,
        "screen_name": 'About'
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
    this.navigate('details');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="About Biller"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Continue"
        type={this.state.type}
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ textAlign: 'center', margin: '60px 0px 60px 0px' }}>
          <img width={100} src={icon} alt="OTM" />
        </div>
        <div style={{ marginTop: 26, marginBottom: 5 }}>
          <div className="biller-about-points">
            <div className="biller-dot"></div>
            <div style={{ width: '90%' }}>Biller is a completely paperless, secure and the easiest method for paying monthly
              SIP installments.
            </div>
          </div>

          <div className="biller-about-points">
            <div className="biller-dot"></div>
            <div style={{ width: '90%' }}>  On successful addition of biller, your bank will notify you before the SIP
              dates and debit SIP instalment from your account.
            </div>
          </div>

        </div>

      </Container>

    );
  }
}

export default About;
