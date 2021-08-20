import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { copyToClipboard } from 'utils/validators';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';

import { banks_details } from '../../constants';

class BillerSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialog: true,
      bank_code: '',
      copyText: 'Copy',
      callback_supported: true,
      params: qs.parse(props.history.location.search.slice(1))
    }

    this.renderBankSteps = this.renderBankSteps.bind(this);
  }


  componentWillMount() {
    this.setState({
      bank_code: this.state.params.bank_code ? this.state.params.bank_code : 'SBI'
    })

  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/mandate/' + this.state.params.pc_urlsafe +
        '/fetch/biller/information');
      if (res.pfwresponse.result) {
        let result = res.pfwresponse.result;
        this.setState({
          show_loader: false,
          account_number: result.account_number || '',
          bank_code: result.bank_code || '',
          bank_image: result.bank_image || '',
          bank_name: result.bank_name || '',
          biller_id: result.biller_id || 546378444292284,
          ifsc_code: result.ifsc_code || '',
          status: result.status || ''
        });
      }
      else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }

  }

  navigate = (pathname) => {

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      state: {
        account_number: this.state.account_number,
        bank_code: this.state.bank_code,
        bank_image: this.state.bank_image,
        bank_name: this.state.bank_name,
        biller_id: this.state.biller_id,
        ifsc_code: this.state.ifsc_code,
        status: this.state.status
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Biller',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Add iSIP Biller Steps',
        'netbanking_link': 'empty'
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
    this.navigate('details');
  }

  handleClose() {
    this.setState({
      openDialog: false,
      show_loader: true
    });
  }

  copyItem = (string) => {
    if (copyToClipboard(string)) {
      toast('Copied');
      this.setState({
        copyText: 'Copied'
      })
      this.sendEvents('copy');
    }
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
        title={"How to add Biller"}
        handleClick={this.handleClick}
        classOverRide="result-container2"
        classOverRideContainer="result-container2"
        edit={this.props.edit}
        events={this.sendEvents('just_set_events')}
        buttonTitle={"Get URN Number"}
        noFooter={!this.state.callback_supported}
      >
        {this.state.bank_code && <div>
          <div className="biller-steps-small-title">
            {banks_details[this.state.bank_code].head_small_title}
          </div>
          <div style={{ margin: '0 10px 0px 0px' }}>
            {banks_details[this.state.bank_code].steps.map(this.renderBankSteps)}
          </div>
          <div className="biller-steps-footer-title">
            {banks_details[this.state.bank_code].footer_title}
          </div>
          {!this.state.callback_supported && <div>
            <div style={{ margin: '20px 0px 12px', color: '#4a4a4a', fontSize: 14 }}>
              Copy {banks_details[this.state.bank_code].name} net banking link to create i-SIP biller
            </div>
            <div className="biller-netbank-tile">
              <div className="biller-netbank-link">
                {banks_details[this.state.bank_code].netbanking_link}
              </div>
              <div className="biller-netbnak-copy"
                onClick={() => this.copyItem(banks_details[this.state.bank_code].netbanking_link)}>
                {this.state.copyText}
              </div>
            </div>

          </div>}
        </div>}
      </Container >

    );
  }
}

export default BillerSteps;
