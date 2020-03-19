import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
class RenderDiseasesClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      color: getConfig().primary,
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);
  }
  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async handleClickCurrent() {
    this.sendEvents('next');
    this.props.history.goBack();
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": '',
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
        fullWidthButton={true}
        buttonTitle='Back To Plan'
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClickCurrent()}
        title='How to claim'
        classOverRideContainer="accident-plan">

        <div style={{ padding: '0 15px' }}>

          <div className="plan-details">
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: '20px' }}>
            <p>Follow these simple steps to ensure a faster, speedier and easier process:</p>
            <h4>Claim notification</h4>
            <ol style={{ color: '#6f6f6f', padding: '15px', margin: '0' }}>
              <li>Notify us through any of our 24x7  convenient intimation modes:</li>
              <ol type="a" style={{ color: '#6f6f6f', padding: '15px', margin: '0' }}>
                <li>Call us on a toll-free number <a href="tel:1800-103-2292">(1800-103-2292)</a></li>
                <li>Drop us an email <a href="mailto: claims@bhartiaxa.com">(claims@bhartiaxa.com)</a> to register your claim</li>
              </ol>
              <li>Once your claim is registered, you will receive a confirmation SMS on your registered number within an hour. This will have your Bharti-AXA General Insurance (BAGI) claim number along with the next steps towards your claim settlement process</li>
              <li>In less than 24 hours of your claim registration, a BAGI representative will call you explaining the complete process and intimating you about the various documents that you will need to furnish for claim processing</li>
            </ol>
            <h4>Claim form</h4>
            <ol style={{ color: '#6f6f6f', padding: '15px', margin: '0' }}>
              <li>Upon the notification of the claim, the company will dispatch the claim Form A and Form B to the Insured/covered person</li>
              <li>Claim forms will also be available with the company offices and on its website. You can download and email along with the following documents:</li>
              <ol type="a" style={{ color: '#6f6f6f', padding: '15px', margin: '0' }}>
                <li>Duly signed claim Form A and Form B</li>
                <li>Discharge summary for quarantine cases</li>
                <li>NEFT details in the name of policy holder</li>
                <li>Reports from authorised centres of ICMR - National Institute of Virology, Pune</li>
              </ol>
            </ol>
            <h4>Settlement Process</h4>
            <ol style={{ color: '#6f6f6f', padding: '15px', margin: '0' }}>
              <li>On receipt of the complete set of claim documents to the company’s satisfaction, the company will send offer of settlement, along with a settlement statement within 30 days to the insured.</li>
              <li>Payment will be made within 7 days of receipt of acceptance of such settlement offer.</li>
            </ol>



          </div>
        </div>


      </Container>
    );
  }
}

const RenderDiseasesComponent = (props) => (
  <RenderDiseasesClass
    {...props} />
);

export default RenderDiseasesComponent;