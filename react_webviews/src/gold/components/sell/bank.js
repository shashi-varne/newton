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
      minutes: "",
      seconds: "",
      timeAvailable: "",
      ifsc_code: '',
      accountnumber: '',
      c_accountnumber: '',
      ifsc_code: '',
      bank_name: '',
      branch_name: '',
      ifsccodeError: '',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
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

  componentDidMount() {
    let timeAvailable = window.localStorage.getItem('timeAvailableSell');
    let sellData = JSON.parse(window.localStorage.getItem('sellData'));
    this.setState({
      timeAvailable: timeAvailable,
      sellData: sellData
    })
    if (timeAvailable >= 0 && sellData) {
      this.countdown();
    }
    Api.get('/api/gold/user/bank/details').then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let bankDetails, accountnumber, c_accountnumber, ifsc_code;
        console.log(result);
        if (result.banks.length != 0) {
          accountnumber = result.banks[0].account_number;
          c_accountnumber = result.banks[0].account_number;
          ifsc_code = result.banks[0].ifsc_code;
          // this.checkIFSCFormat(result.banks[0].ifsc_code);
        } else {
          bankDetails = {
            accountnumber: '',
            c_accountnumber: '',
            ifsc_code: ''
          };
        }
        this.setState({
          show_loader: false,
          bankDetails: bankDetails,
          accountnumber: accountnumber,
          c_accountnumber: c_accountnumber,
          ifsc_code: ifsc_code
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });
  }

  countdown() {
    let timeAvailable = this.state.timeAvailable;
    console.log(timeAvailable);
    if (timeAvailable <= 0) {
      this.setState({
        minutes: '',
        seconds: ''
      })
      // window.location.reload();
      return;
    }
    setTimeout(
      function () {
        let minutes = Math.floor(timeAvailable / 60);
        let seconds = Math.floor(timeAvailable - minutes * 60);
        timeAvailable--;
        this.setState({
          timeAvailable: timeAvailable,
          minutes: minutes,
          seconds: seconds
        })
        window.localStorage.setItem('timeAvailableSell', timeAvailable);
        this.countdown();
      }
        .bind(this),
      1000
    );
  };

  async checkIFSCFormat() {
    if (this.state.ifsc_code && ('' + this.state.ifsc_code).length == 11) {

      Api.get('/api/ifsc/' + (this.state.ifsc_code).toUpperCase()).then(res => {
        if (res.pfwresponse.status_code == 200) {
          let result = res.pfwresponse.result;
          let bankDetails, ifsccodeError, bank_name, branch_name;
          if (result.length == 0) {
            ifsccodeError = true;
            bank_name = '';
            branch_name = '';
            return;
          }

          if (result[0]) {
            ifsccodeError = false;
            bank_name = result[0].bank;
            branch_name = result[0].branch;
          }
          this.setState({
            show_loader: false,
            bank_name: bank_name,
            branch_name: branch_name,
            ifsccodeError: ifsccodeError
          });
        } else {
          this.setState({
            show_loader: false, openDialog: true,
            apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
          });
        }

      }).catch(error => {
        this.setState({ show_loader: false });
        console.log(error);
      });
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

  sellGold = async () => {
    var options = {
      'account_number': this.state.accountnumber,
      'ifsc_code': this.state.ifsc_code
    };

    Api.post('/api/gold/user/bank/details', options).then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let sellData = this.state.sellData;
        sellData.account_number = this.state.accountnumber;
        sellData.ifsc_code = this.state.ifsc_code;
        window.localStorage.setItem('sellData', JSON.stringify(sellData));
        this.navigate('sell-gold-order');
        this.setState({
          show_loader: false,
        });
      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Details"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
        handleClick={this.sellGold}
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
              id="accountnumber"
              name="accountnumber"
              value={this.state.accountnumber}
              onChange={this.handleChange('accountnumber')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
              type="text"
              width="40"
              label="Confirm Account Number *"
              class="confirm_account_no"
              id="c_accountnumber"
              name="c_accountnumber"
              value={this.state.c_accountnumber}
              onChange={this.handleChange('c_accountnumber')} />
          </div>
          <div className="InputField">
            <Input
              error={false}
              helperText=''
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
        <ToastContainer autoClose={8000} />
      </Container>
    );
  }
}

export default SellOrder;
