import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';

class SellOrder extends Component {
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Details"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="bank-details">
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Your Account Number *"
              class="account_no"
              id="account_no"
              name="account_no"
              value='1234567890'
              onChange={this.handleChange('account_no')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Confirm Account Number *"
              class="confirm_account_no"
              id="confirm_account_no"
              name="confirm_account_no"
              value='1234567890'
              onChange={this.handleChange('confirm_account_no')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="IFSC Code *"
              class="ifsc"
              id="ifsc"
              name="ifsc"
              value='SBIN0013159'
              onChange={this.handleChange('ifsc')} />
          </div>
          <div className="bank-timer">Price expires in <b>00:00</b></div>
        </div>
      </Container>
    );
  }
}

export default SellOrder;
