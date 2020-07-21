import React, { Component } from 'react';
import Container from '../../common/Container';
import Button from 'material-ui/Button';
import { nativeCallback } from 'utils/native_callback';
import crd_gold_info from 'assets/crd_gold_info.svg';
import { initialize } from '../../common/functions';

class Landing extends Component {
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Personal loan"
        noHeader={this.state.show_loader}
        noFooter={true}
        events={this.sendEvents('just_set_events')}
      >
        <div className="gold-landing" id="goldSection">
          <div className="infoimage-block1" onClick={() => this.navigate('check-how1')} >
            <img style={{ width: '100%', cursor: 'pointer' }} src={crd_gold_info} alt="" />
            <div className="inner">
              <div className="title generic-page-title">
                Personalised instant loan
              </div>
              <div className="button">
                <Button variant="raised"
                  size="large" color="secondary" autoFocus>
                  Apply now
                  </Button>
              </div>
              <div className="bottom-content">
                No paper-work | Money in A/c within 2 hrs
              </div>
            </div>
          </div>
        </div>

      </Container>
    );
  }
}

export default Landing;
