import React, { Component } from 'react';
import Container from "../../common/Container";
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class LifeInsuranceAppUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName
    }
}

 openInBrowser(url) {
    nativeCallback({
        action: 'open_in_browser',
        message: {
            url: url
        }
    });
 }

 sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'app_update'
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
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Update"
        fullWidthButton={true}
        buttonTitle="UPDATE NOW"
        onlyButton={true}
        handleClick={() => this.handleClick()}
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

          <div style={{ color: '#6d7278', fontSize: 13,textAlign: 'left' }}>
          Introducing Insurance Savings Plans! Now you can secure yourself while creating wealth with these insurance cum investment plans. Update your app now to check out the best quotes.
       </div>
        </div>
      </Container>
    );
  }
}

export default LifeInsuranceAppUpdate;
