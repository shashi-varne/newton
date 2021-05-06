import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import Button from '../../../common/ui/Button';

import Container from '../../common/Container';
import { banks_details } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { copyToClipboard } from 'utils/validators';


class AddEditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      account_number: props.history.location.state.account_number,
      bank_code: props.history.location.state.bank_code,
      bank_image: props.history.location.state.bank_image,
      bank_name: props.history.location.state.bank_name,
      biller_id: props.history.location.state.biller_id,
      ifsc_code: props.history.location.state.ifsc_code,
      status: props.history.location.state.status,
      copyText: 'Copy',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Biller',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Biller Details',
        'bank_code': this.state.bank_code ? this.state.bank_code : 'empty',
        'biller_id': this.state.biller_id ? this.state.biller_id : 'empty'
      }
    };


    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    if (this.state.copyText === 'Copied') {
      this.sendEvents('next');
      if (getConfig().isSdk) {
        // close webview for sdk
        nativeCallback({ action: 'exit_web_sdk' });
      } else {
        nativeCallback({
          action: 'open_in_browser', message: {
            url: banks_details[this.state.bank_code].netbanking_link
          }
        });
      }
    } else {
      toast('Please copy URN Number');
    }
  }

  copyItem = (string) => {
    if (this.state.copyText !== 'Copied') {
      if (copyToClipboard(string)) {
        toast('URN Number Copied');
        this.setState({
          copyText: 'Copied'
        })
        this.sendEvents('copy');
      }
    }

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Biller URN Detail"
        handleClick={this.handleClick}
        classOverRide="result-container-isip"
        classOverRideContainer="result-container-isip"
        edit={this.props.edit}
        buttonTitle="Proceed"
        events={this.sendEvents('just_set_events')}
        noFooter={true}
      >
        <div className="biller-details-tile">
          <div style={{ fontSize: 14, color: getConfig().styles.primaryColor, marginBottom: 8 }}>Primary Account</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="biller-bankname ">{this.state.bank_name}</div>
              <div className="biller-accountnumber">Account Number: {this.state.account_number}</div>
              <div className="biller-accountnumber">IFSC Code: {this.state.ifsc_code}</div>
            </div>
            <div style={{ width: '20%', position: 'relative' }}>
              <img src={this.state.bank_image} alt="Biller" />
            </div>
          </div>

          <div className="biller-margin">
            Biller Details
          </div>
          <div>
            <div className="biller-accountnumber2">
              <span style={{ float: 'left' }}>URN Number:</span>
              <span className="copy-item-billder-details" id="billerId">{this.state.biller_id}
                <span onClick={() => this.copyItem(this.state.biller_id)} style={{ color: getConfig().styles.secondaryColor }}>{this.state.copyText}</span>
              </span>
            </div>

            <div className="biller-accountnumber2">
              <span style={{ float: 'left' }}>Status :</span>
              <span className="copy-item-billder-details" id="billerId">{this.state.status}
              </span>
            </div>
          </div>
          <div style={{ marginTop: 30 }} onClick={this.handleClick}>
            <Button style={{ borderRadius: 6 }} buttonTitle="Proceed to Add Biller" color="primary" disable={this.state.copyText !== 'Copied'} autoFocus>
              OK
          </Button>
          </div>
        </div>
      </Container >
    );
  }
}

export default AddEditAddress;
