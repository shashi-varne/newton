import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';

class DeliveryAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
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

  componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (field) => (value) => {
    // field == name
  }

  handlePincode = name => async (event) => {
    // const pincode = event.target.value;

    // this.setState({
    //   [name]: pincode,
    //   [name+'_error']: ''
    // });

    // if (pincode.length === 6) {
    //   const res = await Api.get('/api/pincode/' + pincode);

    //   if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
    //     if (name === 'pincode') {
    //       this.setState({
    //         city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
    //         state: res.pfwresponse.result[0].state_name
    //       });
    //     } else {
    //       this.setState({
    //         ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
    //         cstate: res.pfwresponse.result[0].state_name
    //       });
    //     }
    //   } else {
    //     this.setState({
    //       city: '',
    //       state: '',
    //       ccity: '',
    //       cstate: ''
    //     });
    //   }
    // }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold Delivery Address"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="delivery-address">
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="number"
              width="40"
              label="Pincode *"
              id="pincode"
              name="pincode"
              value='560052'
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Address *"
              class="address"
              id="address"
              name="address"
              value='#1, 1st Cross, Some Layout, Bengaluru'
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Landmark (Optional)"
              class="landmark"
              id="landmark"
              name="landmark"
              value='Bangalore Central'
              onChange={this.handleChange('landmark')} />
          </div>
        </div>
      </Container>
    );
  }
}

export default DeliveryAddress;
