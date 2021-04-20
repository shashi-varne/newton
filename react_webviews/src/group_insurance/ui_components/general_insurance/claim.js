import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
class RenderDiseasesClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      color: getConfig().styles.primaryColor,
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
        "screen_name": 'how_to_claim',
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
          <div style={{lineHeight: '20px', color: '#6f6f6f'}}>
            <div style={{marginTop: '22px', marginBottom: '22px',  color: '#000000'}}>Follow these simple steps to ensure a faster, speedier and easier process:</div>
            <div style={{marginBottom: '22px',  color: '#000000', fontWeight: 'bold'}}>Claim notification</div>
            <div>1. Notify us through any of our 24x7  convenient intimation modes:</div>
            <div>a) Call us on a toll-free number <b>(1800-103-2292)</b></div>
            <div>b) Drop us an email <b>(claims@bhartiaxa.com)</b> to register your claim</div>
            <div style={{marginTop: '15px'}}>2. Once your claim is registered, you will receive a <b>confirmation SMS</b> on your registered number within an hour. This will have your <b>Bharti-AXA General Insurance (BAGI) claim number</b> along with the next steps towards your claim settlement process</div>
            <div style={{marginTop: '15px'}}>3. In less than 24 hours of your claim registration, a BAGI representative will call you explaining the complete process and intimating you about the various documents that you will need to furnish for claim processing</div>
            <div style={{marginTop: '22px', marginBottom: '22px', color: '#000000', fontWeight: 'bold'}}>Claim form</div>
            <div>1. Upon the notification of the claim, the company will dispatch the <b>claim Form A and Form B</b> to the Insured/covered person</div>
            <div style={{marginTop: '15px'}}>2. Claim forms will also be available with the company offices and on its website. You can download and email along with the following documents:</div>
            <div style={{marginTop: '15px', fontWeight: 'bold'}}>Document check list</div>
            <div>a) Duly signed claim Form A and Form B</div>
            <div>b) Discharge summary for quarantine cases</div>
            <div>c) NEFT details in the name of policy holder</div>
            <div>d) Reports from authorised centres of ICMR - National Institute of Virology, Pune</div>
            <div style={{marginTop: '22px', marginBottom: '22px',  color: '#000000', fontWeight: 'bold'}}>Settlement Process</div>
            <div>1. On receipt of the complete set of claim documents to the company’s satisfaction, the company will send offer of settlement, along with a settlement statement within 30 days to the insured.</div>
            <div style={{marginTop: '15px', marginBottom: '20px'}}>2. Payment will be made within 7 days of receipt of acceptance of such settlement offer.</div>
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