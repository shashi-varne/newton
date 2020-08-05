import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getConfig } from 'utils/functions';

class AppUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {

    this.sendEvents('next');
    let url = getConfig().appLink;
    this.openInBrowser(url);
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Update"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="UPDATE NOW"
      >

        <div style={{ textAlign: 'center',margin: '20px 0 0 0' }}>
          <div>
            <img src={require(`assets/${this.state.productName}/update_mobile.svg`)} alt="" />
          </div>

          <div style={{
            fontSize: 24, color: 'black', fontWeight: 500,
            margin: '20px 0 10px 0'
          }}>
            <span>Update your application</span>

          </div>

          <div style={{ color: '#6d7278', fontSize: 13 }}>
          We have added loan products in our product suite so that you can have the money you want.
       </div>
        </div>
      </Container>
    );
  }
}

export default AppUpdate;
