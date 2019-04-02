import React, { Component } from 'react';
import qs from 'qs';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import Button from '../../../common/ui/Button';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';


class AddEditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialogReset: false,
      pincode: '',
      pincode_error: '',
      addressline1: '',
      addressline1_error: '',
      addressline2: '',
      addressline2_error: '',
      city: '',
      state: '',
      checked: true,
      error: '',
      apiError: '',
      openDialog: false,
      address_present: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }

  componentWillMount() {
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
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Address',
        'addressline1': this.state.addressline1_error ? 'invalid' : this.state.addressline1 ? 'valid' : 'empty',
        'addressline2': this.state.addressline2_error ? 'invalid' : this.state.addressline2 ? 'valid' : 'empty',
        'pincode': this.state.pincode_error ? 'invalid' : this.state.pincode ? 'valid' : 'empty',
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

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Mandate(OTM)"
        handleClick={this.handleClick}
        classOverRide="result-container"
        classOverRideContainer="result-container"
        edit={this.props.edit}
        buttonTitle="Add Biller"
        type={this.state.type}
        events={this.sendEvents('just_set_events')}
        noFooter={true}
      >
        <div className="biller-details-tile">
          <div style={{ fontSize: 14, color: getConfig().primary, marginBottom: 8 }}>Primary Account</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="biller-bankname ">{this.state.bank_name}</div>
              <div className="biller-accountnumber">Account Number: {this.state.account_number}</div>
              <div className="biller-accountnumber">IFSC Code: {this.state.ifsc_code}</div>
            </div>
            <div style={{ width: '20%', right: '13px', position: 'relative' }}>
              <img style={{ width: '100%', height: '64px' }} src={this.state.bank_image} alt="Biller" />
            </div>
          </div>

          <div className="biller-margin">
            Biller Details
          </div>
          <div>
            <div className="biller-accountnumber">URN Number: {this.state.biller_id}</div>
            <div className="biller-accountnumber">Status: {this.state.status}</div>
          </div>
          <div style={{ marginTop: 30 }}>
            <Button style={{ borderRadius: 6 }} buttonTitle="Proceed" onClick={this.handleClose} color="primary" autoFocus>
              OK
          </Button>
          </div>
        </div>
      </Container >
    );
  }
}

export default AddEditAddress;
