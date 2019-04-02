import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

import SBI_icon2 from '../../../assets/banks/SBI/2.png';
import SBI_icon3 from '../../../assets/banks/SBI/3.png';
import SBI_icon4 from '../../../assets/banks/SBI/4.png';
import SBI_icon5 from '../../../assets/banks/SBI/5.png';
import SBI_icon6 from '../../../assets/banks/SBI/6.png';

import ICI_icon2 from '../../../assets/banks/ICI/2.png';
import ICI_icon3 from '../../../assets/banks/ICI/3.png';
import ICI_icon4 from '../../../assets/banks/ICI/4.png';
import ICI_icon5 from '../../../assets/banks/ICI/5.png';

import HDF_icon2 from '../../../assets/banks/HDF/2.png';
import HDF_icon3 from '../../../assets/banks/HDF/3.png';
import HDF_icon4 from '../../../assets/banks/HDF/4.png';
import HDF_icon5 from '../../../assets/banks/HDF/5.png';

import UTI_icon2 from '../../../assets/banks/UTI/2.png';
import UTI_icon3 from '../../../assets/banks/UTI/3.png';
import UTI_icon4 from '../../../assets/banks/UTI/4.png';
import UTI_icon5 from '../../../assets/banks/UTI/5.png';

const banks_details = {
  'HDF': {
    'name': 'HDFC',
    'head_title': 'How To Add i-SIP Biller In HDFC Bank',
    'head_small_title': 'Steps to activate your SIP through HDFC Netbanking:',
    'footer_title': 'Congratulations! Your i-SIP biller request has been registered. You will hear from your bank within 2-3 business days.',
    'steps': [
      {
        'title': 'Step 1: Go to HDFC net banking page and login with your credentials',
        'image': ''
      },
      {
        'title': 'Step 2: Click on the Bill Pay & Recharge and then Continue',
        'image': HDF_icon2
      },
      {
        'title': 'Step 3: Click on “Click here to add” under “Register New Biller”',
        'image': HDF_icon3
      },
      {
        'title': 'Step 4: Select Mutual Fund, then BSE Limited',
        'image': HDF_icon4
      },
      {
        'title': 'Step 5: Enter/Paste the URN and select the options as shown below',
        'image': HDF_icon5
      }
    ]
  },
  'ICI': {
    'name': 'ICICI',
    'head_title': 'How To Add i-SIP Biller In ICICI',
    'head_small_title': 'Steps to activate your SIP through ICICI Netbanking:',
    'footer_title': 'Congratulations! Your i-SIP biller request has been registered. You will hear from your bank within 2-3 business days.',
    'steps': [
      {
        'title': 'Step 1: Go to ICICI netbanking page and login with your credentials',
        'image': ''
      },
      {
        'title': 'Step 2: Click on the Bill payments under “Payments & Transfer”',
        'image': ICI_icon2
      },
      {
        'title': 'Step 3: Click on Register in “Electricity, Telecom and Other Utility Bills”',
        'image': ICI_icon3
      },
      {
        'title': 'Step 4: Select Mutual Fund, then BSE ISIP and click on Register',
        'image': ICI_icon4
      },
      {
        'title': 'Step 5: Enter/Paste the URN and select the options as shown below',
        'image': ICI_icon5
      }
    ]
  },
  'SBI': {
    'name': 'SBI',
    'head_title': 'How To Add i-SIP Biller In SBI',
    'head_small_title': 'Steps to activate your SIP through SBI Netbanking:',
    'footer_title': 'Congratulations! Your i-SIP biller request has been registered. You will hear from your bank within 2-3 business days.',
    'steps': [
      {
        'title': 'Step 1: Go to SBI netbanking page and login with your credentials',
        'image': ''
      },
      {
        'title': 'Step 2: Click on the Bill payments Tab',
        'image': SBI_icon2
      },
      {
        'title': 'Step 3: Click on Manage Biller',
        'image': SBI_icon3
      },
      {
        'title': 'Step 4: Click On “Add” under “Manage Biller”',
        'image': SBI_icon4
      },
      {
        'title': 'Step 5: Select Biller as BSE Limited',
        'image': SBI_icon5
      },
      {
        'title': 'Step 5: Enter/Paste the URN and select the options as shown below',
        'image': SBI_icon6
      }
    ]
  },
  'UTI': {
    'name': 'Axis Bank',
    'head_title': 'How To Add i-SIP Biller In Axis Bank',
    'head_small_title': 'Steps to activate your SIP through Axis Bank Netbanking:',
    'footer_title': 'Congratulations! Your i-SIP biller request has been registered. You will hear from your bank within 2-3 business days.',
    'steps': [
      {
        'title': 'Step 1: Go to Axis bank netbanking page and login with your credentials',
        'image': ''
      },
      {
        'title': 'Step 2: Click on the Pay Bills under “Payments”',
        'image': UTI_icon2
      },
      {
        'title': 'Step 3: Click on Add Biller',
        'image': UTI_icon3
      },
      {
        'title': 'Step 4: Select Mutual Fund, then BSE Limited',
        'image': UTI_icon4
      },
      {
        'title': 'Step 5: Enter/Paste the URN and select the options as shown below',
        'image': UTI_icon5
      }
    ]
  }
};

class BillerSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openDialog: true,
      bank_code: 'HDF',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }

    this.renderBankSteps = this.renderBankSteps.bind(this);
  }


  componentWillMount() {
    // this.setState({
    //   bank_code: this.state.params.bank_code ? this.state.params.bank_code : 'SBI'
    // })

    this.setState({
      bank_code: 'ICI'
    })

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
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Feedback Popup'
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
    nativeCallback({ action: 'exit' });
  }

  handleClose() {
    this.setState({
      openDialog: false,
      show_loader: true
    });
  }

  renderBankSteps(props, index) {
    return (
      <div className="step-tiles" key={index}>
        <div className="step-tiles-title">
          {props.title}
        </div>
        {props.image && <div className="step-tiles-image">
          <img className="steps-tiles-image-tag" width="100%" src={props.image} alt="Bank" />
        </div>}
      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={"How to add a i-SIP biller in " + banks_details[this.state.bank_code].name}
        handleClick={this.handleClick}
        edit={this.props.edit}
        type={this.state.type}
        events={this.sendEvents('just_set_events')}
        noFooter={true}
      >
        <div>
          <div className="biller-steps-title">
            {banks_details[this.state.bank_code].head_title}
          </div>
          <div className="biller-steps-small-title">
            {banks_details[this.state.bank_code].head_small_title}
          </div>
          <div style={{ margin: '0 10px 0px 0px' }}>
            {banks_details[this.state.bank_code].steps.map(this.renderBankSteps)}
          </div>
          <div className="biller-steps-footer-title">
            {banks_details[this.state.bank_code].footer_title}
          </div>
        </div>
      </Container>

    );
  }
}

export default BillerSteps;
