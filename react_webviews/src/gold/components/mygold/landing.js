import React, { Component } from 'react';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';

import { nativeCallback } from 'utils/native_callback';

class GoldLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      productName: getConfig().productName
    }
  }


  async componentDidMount() {
    this.setState({
      show_loader: false
    });
  }


  sendEvents(user_action, product_name) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Gold Locker',
        "product_name": product_name
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }



  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold"
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >
          <div>
            <img src={ require(`assets/${this.state.productName}/gold_pattern.png`)} alt="Gold" />
          </div>
      </Container>
    );
  }
}

export default GoldLanding;
