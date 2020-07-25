import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';

class MandatePan extends Component {
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
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

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

  conversionCallBack = () => {
    let body = {
      "request_type": "conversion"
    }

    let resultData = await this.callBackApi(body);
    if (resultData.callback_status) {
      // upload pan and redirect to e-mandate
    } else {
      let searchParams = getConfig().searchParams + '&status=sorry';
      this.navigate('instant-kyc-status', { searchParams: searchParams });
    }
  }

  handleClick = () => {
    this.sendEvents('next');

    this.setState({
      show_loader: true
    })

    // after api response hit this this.conversionCallBack();

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="DUMMY_HEADER_TITLE"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
      >
        <div className="loan-mandate-pan">
          {/* {code goes here} */}
        </div>
      </Container>
    );
  }
}

export default MandatePan;
