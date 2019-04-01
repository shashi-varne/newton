import React, { Component } from 'react';
import qs from 'qs';
import contact from 'assets/address_details_icon.svg';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

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
      const res = await Api.get('/api/mandate/campaign/address/' + this.state.params.key);
      if (res.pfwresponse.result) {
        let address = res.pfwresponse.result[0];
        this.setState({
          show_loader: false,
          pincode: address.pincode || '',
          addressline1: address.addressline1 || '',
          addressline2: address.addressline2 || '',
          city: address.city || '',
          state: address.state || '',
          address_id: address.id || '',
          address_present: address.id ? true : false
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
        edit={this.props.edit}
        buttonTitle="Add Biller"
        type={this.state.type}
        events={this.sendEvents('just_set_events')}
      >
        <div style={{
          border: '1px solid red',
          padding: '10px'
        }}>
          <div style={{ fontSize: 14, color: 'blue', marginBottom: 8 }}>Primary Account</div>
          <div>
            <div>
              <div style={{ color: '#878787', fontSize: 14 }}>State Bank of India</div>
              <div>Account Number: XXXXXXXXXX</div>
              <div>IFSC Code: XXXXXX</div>
            </div>
            <div>
              <img width="20" src={contact} alt="Biller" />
            </div>
          </div>

          <div>
            Biller Details
          </div>
          <div>
            <div>URN Number: XXXXXX</div>
            <div>Status: Initialized</div>
          </div>
        </div>
      </Container >
    );
  }
}

export default AddEditAddress;
