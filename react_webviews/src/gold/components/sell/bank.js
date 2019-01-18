import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import Input from '../../ui/Input';
import { ToastContainer } from 'react-toastify';
import toast from '../../ui/Toast';

class SellOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      account_no: '',
      account_no_error: '',
      confirm_account_no: '',
      confirm_account_no_error: '',
      ifsc: '',
      ifsc_error: ''
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

  handleChange = (field) => (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name+'_error']: ''
    });
  }

  handleClick = async () => {
    let ifsc_regex = /^[A-Za-z]{4}\d{7}$/;

    if (!this.state.account_no) {
      this.setState({
        account_no_error: 'Please enter account number' 
      });
    } else if (!this.state.confirm_account_no) {
      this.setState({
        confirm_account_no_error: 'This field is required' 
      });
    } else if (this.state.account_no !== this.state.confirm_account_no) {
      this.setState({
        confirm_account_no_error: 'Account number mismatch' 
      });
    } else if (!this.state.ifsc) {
      this.setState({
        ifsc_error: 'Please enter IFSC Code' 
      });
    } else if (this.state.ifsc && (this.state.ifsc.length < 11 || this.state.ifsc.length > 11)) {
      this.setState({
        ifsc_error: 'Invalid IFSC Code' 
      });
    } else if (this.state.ifsc && !ifsc_regex.test(this.state.ifsc)) {
      this.setState({
        ifsc_error: 'Invalid IFSC Code' 
      });
    } else {
      // To-do
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Details"
        edit={this.props.edit}
        handleClick={this.handleClick}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="bank-details">
          <div className="InputField">
            <Input
              error={(this.state.account_no_error) ? true : false}
              helperText={this.state.account_no_error}
              type="text"
              width="40"
              label="Your Account Number *"
              class="account_no"
              id="account_no"
              name="account_no"
              value={this.state.account_no}
              onChange={this.handleChange('account_no')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.confirm_account_no_error) ? true : false}
              helperText={this.state.confirm_account_no_error}
              type="text"
              width="40"
              label="Confirm Account Number *"
              class="confirm_account_no"
              id="confirm_account_no"
              name="confirm_account_no"
              value={this.state.confirm_account_no}
              onChange={this.handleChange('confirm_account_no')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.ifsc_error) ? true : false}
              helperText={this.state.ifsc_error}
              type="text"
              width="40"
              label="IFSC Code *"
              class="ifsc"
              id="ifsc"
              name="ifsc"
              value={this.state.ifsc}
              onChange={this.handleChange('ifsc')} />
          </div>
          <div className="bank-timer">Price expires in <b>00:00</b></div>
        </div>
        <ToastContainer autoClose={8000} />
      </Container>
    );
  }
}

export default SellOrder;
