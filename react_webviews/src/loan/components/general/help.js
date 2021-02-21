import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';

class Help extends Component {
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

  sendEvents(user_action, data={} ) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'need help',
        "link_clicked": this.state.link_clicked ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = (link_clicked) => {
      
    this.setState({
      link_clicked: link_clicked
    }, () => this.sendEvents('next'));
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Need help"
        events={this.sendEvents('just_set_events')}
        handleClick={this.handleClick}
        noFooter={true}
        classOverRide={'loanMainContainer'}
      >
        <div className="loan-help">
          <div className="label" style={{lineHeight: '20px'}}>
            For any other queries/help, please connect at
            <br />
            below details:
          </div>

          <div className="customer-care">
            DMI Customer Care:
          </div>

          <div className="label">
            Email:
            <span className="details">
              {` customercare@dmifinance.in`}
            </span>  
          </div>

          <div className="label">
            Whatsapp bot:
            <span className="details" style={{lineHeight: '25px'}}>
              {` 9350657100`}
              <br />
              <div className="link" onClick={() => {
                this.handleClick(true)
                this.openInBrowser('https://bit.ly/DMIFINWA')
              }}>
                https://bit.ly/DMIFINWA
              </div>
            </span>  
          </div>

          <div className="customer-care">
            Fisdom Customer Care:
          </div>

          <div className="label">
            Email:
            <span className="details">
              {` ask@fisdom.com`}
            </span>  
          </div>

          <div className="label">
            Call:
            <span className="details">
              {` +80-30-408363`}
            </span>  
          </div>
        </div>
      </Container>
    );
  }
}

export default Help;
