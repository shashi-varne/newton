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
      openResponseDialog: false,
      minutes: "",
      seconds: "",
      timeAvailable: "",
      ifsc_code: '',
      bank_name: '',
      branch_name: '',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      account_no: '',
      account_no_error: '',
      confirm_account_no: '',
      confirm_account_no_error: '',
      ifsc_error: ''
    }
    this.countdown = this.countdown.bind(this);
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
    let timeAvailable = window.localStorage.getItem('timeAvailableSell');
    console.log("timeva " + timeAvailable);
    let sellData = JSON.parse(window.localStorage.getItem('sellData'));
    this.setState({
      timeAvailable: timeAvailable,
      sellData: sellData
    })
    if (timeAvailable >= 0 && sellData) {
      this.countdown(timeAvailable);
    }

    try {
      const res = await Api.get('/api/gold/user/bank/details');
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let bankDetails, account_no, confirm_account_no, ifsc_code;
        console.log(result);
        if (result.banks.length != 0) {
          account_no = result.banks[0].account_number;
          confirm_account_no = result.banks[0].account_number;
          ifsc_code = result.banks[0].ifsc_code;
          // this.checkIFSCFormat(result.banks[0].ifsc_code);
        } else {
          bankDetails = {
            account_no: '',
            confirm_account_no: '',
            ifsc_code: ''
          };
        }
        this.setState({
          show_loader: false,
          bankDetails: bankDetails,
          account_no: account_no,
          confirm_account_no: confirm_account_no,
          ifsc_code: ifsc_code
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }

  countdown(timeAvailable) {
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      // window.location.reload();
      return;
    }
    this.timerHandle = setTimeout(() => {
      let minutes = Math.floor(timeAvailable / 60);
      let seconds = Math.floor(timeAvailable - minutes * 60);
      --timeAvailable;
      this.setState({
        timeAvailable: timeAvailable,
        minutes: minutes,
        seconds: seconds
      })
      window.localStorage.setItem('timeAvailableSell', timeAvailable);
      this.countdown(timeAvailable);
      this.timerHandle = 0;
    }, 1000);
  };

  componentWillUnmount = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  async checkIFSCFormat() {
    if (this.state.ifsc_code && ('' + this.state.ifsc_code).length == 11) {

      try {
        const res = await Api.get('/api/ifsc/' + (this.state.ifsc_code).toUpperCase());
        if (res.pfwresponse.status_code == 200) {
          let result = res.pfwresponse.result;
          let bankDetails, ifsc_error, bank_name, branch_name;
          if (result.length == 0) {
            ifsc_error = true;
            bank_name = '';
            branch_name = '';
            return;
          }

          if (result[0]) {
            ifsc_error = false;
            bank_name = result[0].bank;
            branch_name = result[0].branch;
          }
          this.setState({
            show_loader: false,
            bank_name: bank_name,
            branch_name: branch_name,
            ifsc_error: ifsc_error
          });
        } else {
          this.setState({
            show_loader: false, openResponseDialog: true,
            apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong', 'error');
      }
    }

  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (field) => (event) => {
    if (event.target.name === 'ifsc_code') {
      this.checkIFSCFormat(event.target.value);
      this.setState({
        [event.target.name]: event.target.value
      });

    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
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
    } else if (!this.state.ifsc_code) {
      this.setState({
        ifsc_error: 'Please enter IFSC Code'
      });
    } else if (this.state.ifsc_code && (this.state.ifsc_code.length < 11 || this.state.ifsc_code.length > 11)) {
      this.setState({
        ifsc_error: 'Invalid IFSC Code'
      });
    } else if (this.state.ifsc_code && !ifsc_regex.test(this.state.ifsc_code)) {
      this.setState({
        ifsc_error: 'Invalid IFSC Code'
      });
    } else {
      var options = {
        'account_number': this.state.account_no,
        'ifsc_code': this.state.ifsc_code
      };

      try {
        const res = await Api.post('/api/gold/user/bank/details', options);
        if (res.pfwresponse.status_code == 200) {
          let result = res.pfwresponse.result;
          let sellData = this.state.sellData;
          sellData.account_number = this.state.account_no;
          sellData.ifsc_code = this.state.ifsc_code;
          window.localStorage.setItem('sellData', JSON.stringify(sellData));
          this.navigate('sell-gold-order');
          this.setState({
            show_loader: false,
          });
        } else {
          this.setState({
            show_loader: false, openResponseDialog: true,
            apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong', 'error');
      }

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
              id="ifsc_code"
              name="ifsc_code"
              value={this.state.ifsc_code}
              onChange={this.handleChange('ifsc_code')} />
          </div>
          <div className="bank-timer">Price expires in <b>{this.state.minutes}:{this.state.seconds}</b></div>
        </div>
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default SellOrder;
