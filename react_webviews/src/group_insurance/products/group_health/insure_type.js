import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {health_providers} from '../../constants';

class GroupHealthSelectInsureType extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      provider: 'HDFC_ERGO'
    }
  }

  componentWillMount() {
    this.setState({
      providerData: health_providers[this.state.provider]
    })
  }


  async componentDidMount() {

   
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {

  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_suraksha',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Insurance"
        fullWidthButton={true}
        buttonTitle="Get insured"
        onlyButton={true}
        handleClick={() => this.handleClick()}
    >
      </Container>
    );
  }
}

export default GroupHealthSelectInsureType;