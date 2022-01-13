import React from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { API_CONSTANST, getImage } from '../constants'
import "./Style.scss";

import icn_upi_apps from 'assets/icn_upi_apps.svg';
import icn_more from 'assets/icn_more.svg';
import icn_secure_payment from 'assets/icn_secure_payment.svg';
import completed_step from 'assets/completed_step.svg';
import ic_close from 'assets/close_icon.svg';
import SVG from 'react-inlinesvg';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import Dialog, { DialogContent, DialogActions, DialogTitle } from "material-ui/Dialog";
import Button from '../../common/ui/Button';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import { getBasePath } from '../../utils/functions';
import isEmpty from 'lodash/isEmpty';

let store = {};
let intent_supported = false;
let upi_others = true;
let upi_apps = {};
let nativeData;
const config = getConfig();
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      // paramName = paramName.toLowerCase();
      // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
const urlParams = getAllUrlParams(window.location.href);
if (urlParams.payment_data) {
  const decodeData = decodeURI(urlParams.payment_data);
  nativeData = JSON.parse(decodeData);
  intent_supported = nativeData.intent_supported;
  upi_others = nativeData.upi_others;
  upi_apps = nativeData.upi_apps;
}

window.PlutusInitState = {};

const pushEvent = (eventObj) => {
  nativeCallback({ events: eventObj });
};

const UpiRows = (props) => {
  let gpay, phonepe, paytm = false;
  let rows = [];
  let i = 0;
  let upis_keys = Object.keys(upi_apps);
  let upi_packages = Object.values(upi_apps);
  upi_packages.findIndex(function (item) {
    if (item.package_name === "com.google.android.apps.nbu.paisa.user") {
      gpay = true;
    }
    if (item.package_name === "com.phonepe.app") {
      phonepe = true;
    }
    if (item.package_name === "net.one97.paytm") {
      paytm = true;
    }

    return false;
  })
  if (gpay && phonepe && paytm) {
    rows.push(<div onClick={() => props.goToPayment('com.google.android.apps.nbu.paisa.user')} key={i}><img alt="payment" src={getImage('com.google.android.apps.nbu.paisa.user')} /><div className="bottomtext">GPay</div></div>)
    rows.push(<div onClick={() => props.goToPayment('com.phonepe.app')} key={i}><img alt="payment" src={getImage('com.phonepe.app')} /><div className="bottomtext">PhonePe</div></div>)
    rows.push(<div onClick={() => props.goToPayment('net.one97.paytm')} key={i}><img alt="payment" src={getImage('net.one97.paytm')} /><div className="bottomtext">Paytm</div></div>)
  } else {
    for (let key in upi_apps) {
      if (i === 3) {
        break;
      } else {
        if (upis_keys.length > 3 & i < 3) {
          if (gpay) {
            i++;
            rows.push(<div onClick={() => props.goToPayment('com.google.android.apps.nbu.paisa.user')} key={i}><img alt="payment" src={getImage('com.google.android.apps.nbu.paisa.user')} /><div className="bottomtext">GPay</div></div>)
            gpay = false;
            continue;
          }
          if (phonepe) {
            i++;
            rows.push(<div onClick={() => props.goToPayment('com.phonepe.app')} key={i}><img alt="payment" src={getImage('com.phonepe.app')} /><div className="bottomtext">PhonePe</div></div>)
            phonepe = false;
            continue;
          }
          if (paytm) {
            i++;
            rows.push(<div onClick={() => props.goToPayment('net.one97.paytm')} key={i}><img alt="payment" src={getImage('net.one97.paytm')} /><div className="bottomtext">Paytm</div></div>)
            paytm = false;
            continue;
          }

          if (i < 3 && (!gpay || !phonepe || !paytm)) {
            i++;
            rows.push(<div onClick={() => props.goToPayment(upi_apps[key].package_name)} key={i}><img alt="payment" src={getImage(upi_apps[key].package_name)} /><div className="bottomtext">{key.split(" ")[0]}</div></div>)
            continue;
          }

        } else {
          i++;
          rows.push(<div onClick={() => props.goToPayment(upi_apps[key].package_name)} key={i}><img alt="payment" src={getImage(upi_apps[key].package_name)} /><div className="bottomtext">{key.split(" ")[0]}</div></div>)
          continue;
        }
      }
    }
  }
  return (rows)
}

const UpiModal = (props) => {
  window.PlutusInitState.page = 'modal';
  const bankList = props.banks.map((item, i) => {
    if (item.upi_supported) {
      return (
        <div
          className={`item ${(props.activeIndex === i) ? 'active' : ''}`}
          key={i}
          onClick={() => props.selectedUpiBank(i, item)}>
          <img src={item.image} alt="bank" />
          <div className="flex-1">
            <div className="text">{item.bank_name}</div>
            <div className="text">{item.obscured_account_number}</div>
          </div>
          {props.activeIndex === i && <img src="/static/img/check_selected_blue.svg" width="15" className="margin-0" alt="select" />}
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <div id="upiModal" className="modal modal-center">
      <div className="modal-content page-padding-10">
        <div className="header">
          <h1>Select your bank for UPI</h1>
        </div>
        <div className="list">
          {bankList}
        </div>
        <div className="flex upitext">
          <label className="checkbox"><input type="checkbox" onChange={() => props.handleCheck()} /><span className={`checkmark ${store.partner}`}></span></label>
          <div className={`${props.highlighttnc ? 'active' : ''} ${store.partner}`}>Make sure to use same <b>VPA(UPI ID)</b> linked to above selected account</div>
        </div>
        <div className={`${getConfig().app === 'ios' ? 'ios' : ''} upi-button margin-top`}>
          <button className={`${props.checked ? 'active' : ''} ${store.partner}`} onClick={() => props.loadUPi()}>Continue to Pay ₹ {store.amount}</button>
        </div>
      </div>
    </div>
  );
};

const SelectBankModal = (props) => {
  window.PlutusInitState.page = 'modal';
  const bankList = props.banks.map((item, i) => {
    if (item.bank_status === 'verified') {
      return (
        <div
          className={`item ${(props.activeIndex === i) ? 'active' : ''}`}
          key={i}
          onClick={() => props.selectedBank(i, item)}>
          <img src={item.image} width="36" alt="bank" />
          <div className="flex-1">
            <div className="text">{item.bank_name}</div>
            <div className="subtext">{item.obscured_account_number}</div>
          </div>
          {props.activeIndex === i && <div className="selected_bank"> {item.is_primary_bank && <div className="primary">PRIMARY</div>}<img src={completed_step} width="15" className="margin-0" alt="selected" /></div>}
        </div>
      )
    } else {
      return (
        <div className="item disabled" key={i}>
          <img src={item.image} width="36" alt="bank" />
          <div className="flex-1">
            <div className="text">{item.bank_name}</div>
            <div className="subtext">{item.obscured_account_number} (Verification pending)</div>
          </div>
        </div>
      )
    }
  });

  return (
    <div id="selectBankModal" className="modal modal-center">
      <div className="modal-content">
        <header className={`${getConfig().productName}`}>
          <SVG className="ic_close" preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)} src={ic_close} width="25" onClick={() => props.closeBankModal()} />
        </header>
        <div className="header">
          <h1>Select preferred bank</h1>
        </div>
        <div className="list">
          {bankList}
        </div>
        <div className={`${getConfig().app === 'ios' ? 'ios' : ''} footer upi-button margin-top`}>
          <button className={`active ${store.partner}`} onClick={() => props.closeBankModal(true)}>Continue</button>
        </div>
      </div>
    </div>
  );
};

const IppbDisclaimer = ({ open, close }) => {
  return (
    <Dialog open={open} className="po-ippb-disclaimer">
      <DialogTitle className="po-ippb-disclaimer-title">
        DISCLAIMER:
      </DialogTitle>
      <DialogContent className="po-ippb-disclaimer-content">
        <p>
          <b>1.</b> India Post Payments Bank (hereto also referred as "IPPB") has
          entered into a limited term partnership with M/s Finwizard Technology
          Pvt Ltd. (popularly known & hereafter referred as "<span className="text-transform-uppercase">{config.productName}</span>") to
          facilitate Mutual Fund investments.
        </p>
        <p>
          <b>2.</b> IPPB, the bank, through its field distribution teams, including the
          BC channel will only provide referral of the "<span className="text-transform-uppercase">{config.productName}</span> Mobile App" to
          its customers.
        </p>
        <p><b>3.</b> Mutual Funds are subject to market risks.</p>
        <p>
          <b>4.</b> IPPB nor any of its affiliates, does not in any way, assure any
          quantum of returns from the mutual funds
        </p>
        <p>
          <b>5.</b> IPPB and all its affiliates shall not be responsible for any kind
          of deficiency in the services of <span className="text-transform-capitalize">{config.productName}</span>.
        </p>
        <p>
          <b>6.</b> I have read, understood and agree to the terms and conditions as
          above.
        </p>
      </DialogContent>
      <DialogActions className="po-ippb-disclaimer-actions">
        <Button buttonTitle="CONTINUE" onClick={close} style={{ width: "100%" }} />
      </DialogActions>
    </Dialog>
  );
};

class PaymentOption extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      reason: '',
      isBilldeskOpen: false,
      isMoreBanksOpen: false,
      account_number: '',
      bank: {},
      selectedBank: {},
      isSelectedBank: false,
      isNetbankingSelected: false,
      isDebitSelected: false,
      isNEFTSelected: false,
      isUpiSelected: true,
      isShowFunds: false,
      netbank: {
        isSelected: false,
        bank: {},
        code: ''
      },
      isUpiModalOpen: false,
      upiBanks: [],
      neftBanks: [],
      // hasAccount: store.banks.length,
      notSupportedBankCount: 0,
      supportedBanks: [],
      unSupportedBanks: [],
      unSupportedBankNames: [],
      activeIndex: 0,
      checked: false,
      highlighttnc: false,
      isModalOpen: false,
      showModal: false,
      showUpiModal: false,
      showNetBankModal: false,
      showCancelModal: false,
      showDebitLoader: false,
      showBilldeskLoader: false,
      skelton: true,
      openIppbDisclaimer: false,
      productName: getConfig().productName,
      paymentOptions: [],
      paymentUrl: '',
      bankDetails:{},
      neftSupported: false,
      upiSupported: false,
      netBankingSupported: false,
      amount: 0,
    };

    this.goToBank = this.goToBank.bind(this);
    this.goToPayment = this.goToPayment.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.selectptype = this.selectptype.bind(this);
    this.selectNetBank = this.selectNetBank.bind(this);
    this.selectUnsupportedNetBank = this.selectUnsupportedNetBank.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.loadUPi = this.loadUPi.bind(this);
    this.closeBankModal = this.closeBankModal.bind(this);
    this.selectedUpiBank = this.selectedUpiBank.bind(this);
    this.selectedBank = this.selectedBank.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeIppbDisclaimer = this.closeIppbDisclaimer.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }
  
  getPaymentOptions = async (url) => {
    try {
      const result = await  Api.get(url);
      if(result.pfwresponse.status_code === 200) {
        let paymentData = result.pfwresponse.result;
        const neftSupported = paymentData?.payment_options.indexOf('neft') !== -1;
        const netBankingSupported = paymentData?.payment_options.indexOf('netbanking') !== -1;
        const upiSupported = paymentData?.payment_options.indexOf('upi') !== -1;
        this.setState({
          paymentOptions: paymentData?.payment_options,
          bankDetails: paymentData?.bank_details,
          amount: paymentData?.amount,
          paymentUrl: paymentData?.payment_start_url,
          paymentIntentUrl: config.base_url + paymentData?.payment_start_intent_url,
          neftSupported,
          netBankingSupported,
          upiSupported
        })
        this.setState({ show_loader: false });
      } else {
        throw result;
      }
    } catch(err) {
      this.setState({ show_loader: false });
      if (err.pfwresponse.result.error === 'failure') {
        toast(err.pfwresponse.result.message);
      }
    }

  }
  

  componentDidMount = async () => {
    window.PlutusInitState.page = this.props.page;
    const basepath = getBasePath();
    this.setState({
      skelton: true
    })
    const config = getConfig();
    let { redirect_url = "" } = config.current_params;
    const flow = this.props.match?.params?.flow || "default";
    const apiRoute = API_CONSTANST[flow] || API_CONSTANST.default;
    let url = config.base_url + apiRoute + config.pc_urlsafe;
    if(config.Web && flow === "default") {
      redirect_url = encodeURIComponent(`${basepath}/pg/eq/payment-status` + config.searchParams);
    }
    if(!isEmpty(redirect_url)) {
      // eslint-disable-next-line no-useless-escape
      url += (url.match(/[\?]/g) ? '&' : '?')+`plutus_redirect_url=${redirect_url}`;
    }
    await this.getPaymentOptions(url);
    this.setState({
      skelton: false
    })
  }

  handleClick(e) {
    let upimodal = document.getElementById('upiModal');
    if (e.target === upimodal) {
      let eventObj = {
        "event_name": "pg_upi_instruction",
        "properties": {
          "clicked_outside": 'yes'
        }
      };
      this.setState({ showUpiModal: false, checked: false, highlighttnc: false });
      pushEvent(eventObj);
    }
  }

  goToBank() {
    let eventObj = {
      "event_name": "pg_payment_option",
      "properties": {
        "user_action": "add_bank"
      }
    };

    pushEvent(eventObj);

    this.props.history.push('/add-bank', {
      title: this.state.bank.bank_name,
      subtitle: 'Add Bank A/c Number',
      bank_code: this.state.bank.bank_code,
      pg_code: this.state.bank.pg_code,
      ifsc: (this.state.unSupportedBanks.length === 1) ? true : false,
      pg_mode: 'bank'
    });
  }

  closeBankModal(update_bank) {
    if (update_bank && this.state.bank.account_number) {
      this.setState({ selectedBank: this.state.bank, showNetBankModal: false });
    } else {
      this.setState({ showNetBankModal: false });
    }
  }

  loadUPi() {
    if (this.state.checked) {
      let eventObj = {
        "event_name": "pg_upi_instruction",
        "properties": {
          "user_action": 'next',
          "flow": store.flow,
          "investor": store.investor,
          "initial_kyc_status": store.initial_kyc_status,
          "VPA_checked": 'yes'
        }
      };

      pushEvent(eventObj);

      // show loader
      this.setState({ show_loader: 'page' });
      nativeCallback({
        action: 'take_control', message: {
          back_url: window.location.href,
          back_text: 'Are you sure you want to exit the payment process?'
        }
      });
      window.location.href = store.url + '&bank_code=' + this.state.bank.bank_code + '&account_number=' + this.state.bank.account_number + '&gateway_type=UPI';
    } else {
      let eventObj = {
        "event_name": "pg_upi_instruction",
        "properties": {
          "user_action": 'next',
          "flow": store.flow,
          "investor": store.investor,
          "initial_kyc_status": store.initial_kyc_status,
          "VPA_checked": 'no'
        }
      };

      pushEvent(eventObj);
      this.setState({ highlighttnc: true });
    }
  }

  addBank(type) {
    let eventObj = {
      "event_name": "pg_add_bank",
      "properties": {
        "user_action": 'next',
        "add_bank": 'yes',
        "flow": store.flow,
        "investor": store.investor,
        "initial_kyc_status": store.initial_kyc_status
      }
    };

    pushEvent(eventObj);
    this.props.history.push('/add-bank', { title: 'Add Bank Account Number', pg_mode: type });
  }

  handleCheck() {
    this.setState({ checked: !this.state.checked });
  }

  openModal(type) {
    if (store.banks.length < 2) {
      return;
    } else {
      this.setState({ showNetBankModal: true });
    }
  }

  closeModal() {
    this.setState({ showCancelModal: false, reason: '' });
  }

  closeIppbDisclaimer() {
    this.setState({ openIppbDisclaimer: false });
  }

  selectptype(type) {
    let eventObj = {
      "event_name": "pg_payment_option",
      "properties": {
        "user_action": "next",
        "amount": store.amount,
        "channel": store.partner,
        "pg_mode": type,
        "flow": store.flow,
        "investor": store.investor,
        "initial_kyc_status": store.initial_kyc_status,
        "add_bank_drop": (this.state.netbank.isSelected) ? "yes" : "no"
      }
    };

    pushEvent(eventObj);
    if (type === "debit") {
      this.setState({ isDebitSelected: true, isNetbankingSelected: false, isUpiSelected: false, isNEFTSelected: false, isOpen: true }, () => {
      });
    } else if (type === "upi") {
      this.setState({ isUpiSelected: true, isNetbankingSelected: false, isDebitSelected: false, isNEFTSelected: false }, () => {
      });
    } else if (type === "netbanking") {
      this.setState({ isNetbankingSelected: true, isUpiSelected: false, isDebitSelected: false, isNEFTSelected: false }, () => {

      });
    } else if (type === "neft") {
      this.setState({ isNEFTSelected: true, isNetbankingSelected: false, isDebitSelected: false, isUpiSelected: false }, () => {
      });
    }
  }

  handlePayment = async (url,postArgs) => {
    try {
      const result = await Api.post(url,postArgs);
      if(result.pfwresponse.status_code !== 200) {
        throw result;
      } else {
        console.log("result from handle payment is",result);
      }
    } catch(error) {
      this.setState({ show_loader: false });
      if (error.pfwresponse.result.error === 'failure') {
        toast(error.pfwresponse.result.message);
      }
    }
  }

  getPaymentData = async (api) => {
    let that = this;
    try {
      const result = await Api.get(api);
      if(result.pfwresponse.status_code === 200) {
        let paymentData = result.pfwresponse.result;
        const url = paymentData.post_url;
        const postArgs =  paymentData.post_args;
        nativeCallback({
          action: 'take_control', message: {
            back_url: window.location.href,
            back_text: 'Are you sure you want to exit the payment process?'
          }
        });
        this.handlePayment(url,postArgs);
      } else {
        throw result;
      }
    } catch(err) {
      that.setState({ show_loader: false });
      if (err.pfwresponse.result.error === 'failure') {
        toast(err.pfwresponse.result.message);
      }
    }
  }

  async goToPayment(type) {
    if (type === "netbanking") {
      this.setState({ show_loader: 'page' });
      nativeCallback({
        action: 'take_control', message: {
          back_url: window.location.href,
          back_text: 'Are you sure you want to exit the payment process?'
        }
      });
      window.location.href = `${this.state.paymentUrl}?payment_method=netbanking`;
    } else if (type === "neft") {
      this.props.history.push(
        { pathname: '/pg/eq/neft', search: getConfig().searchParams },
        { store: {bankDetails:this.state.bankDetails,amount:this.state.amount} }
      );
    } else if (type === "upi") {
      this.setState({ show_loader: 'page' });
      nativeCallback({
        action: 'take_control', message: {
          back_url: window.location.href,
          back_text: 'Are you sure you want to exit the payment process?'
        }
      });
      window.location.href = `${this.state.paymentUrl}?payment_method=upi`;
    } else {
      let eventObj = {
        "event_name": "pg_payment_option",
        "properties": {
          "user_action": "next",
          "upi_name": type
        }
      };
      pushEvent(eventObj);
      this.setState({ show_loader: 'page' });
      let that = this;
      Api.get(this.state.paymentIntentUrl).then(data => {
        if (data?.pfwresponse?.status_code === 200) {
          let upi_payment_data = data.pfwresponse.result;
          upi_payment_data.package_name = type;
          nativeCallback({
            action: 'take_control', message: {
              back_url: window.location.href,
              back_text: 'Are you sure you want to exit the payment process?'
            }
          });
          nativeCallback({ action: 'initiate_upi_payment', message: upi_payment_data });
        } else {
          that.setState({ show_loader: false });
          toast(data?.pfwresponse?.result?.message || data?.pfwresponse?.result?.error || "Something went wrong!");
        }
      })
    }
  }

  selectedUpiBank(i, item) {
    this.setState({ bank: item, activeIndex: i });
  }

  selectedBank(i, item) {
    this.setState({ bank: item, activeIndex: i });
  }

  selectUnsupportedNetBank(item) {
    this.setState({ isSelectedBank: true, bank: item });
  }

  selectNetBank(item) {
    this.setState(prevState => ({
      netbank: {
        isSelected: !prevState.netbank.isSelected,
        bank: item,
        code: item.bank_code
      }
    }));

    let eventObj = {
      "event_name": "pg_payment_option",
      "properties": {
        "user_action": "next",
        "pg_mode": "net",
        "flow": store.flow,
        "investor": store.investor,
        "initial_kyc_status": store.initial_kyc_status
      }
    };

    pushEvent(eventObj);

    // show loader
    if (item.bank_code) {
      this.setState({ show_loader: 'page' });
      nativeCallback({
        action: 'take_control', message: {
          back_url: window.location.href,
          back_text: 'Are you sure you want to exit the payment process?'
        }
      });

      window.location.href = store.url + '&bank_code=' + item.bank_code + '&account_number=' + item.account_number;
    } else {
      let eventObj = {
        "event_name": "pg_payment_option",
        "properties": {
          "user_action": "add_bank"
        }
      };

      pushEvent(eventObj);
      this.props.history.push('/add-bank', {
        title: item.bank_name,
        subtitle: 'Add Bank A/c Number',
        account_number: item.account_number,
        account_type: item.account_type,
        pg_mode: 'bank',
        ifsc_only: true
      });
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        header={true}
        noFooter={true}
        page="pg_option"
        title="Payment modes"
        buttonTitle='Continue'
        noBackIcon={getConfig().Web}
      >
          <div>
            {/* <div className="block-padding bold payment-option-sub">Payable amount: ₹ {store.amount.toLocaleString()}</div> */}
            <div className="block-padding">
                <div>
                  <div className="selectedBank selected-bank" style={{ border: 'unset' }}>
                    <div className="flex">
                      <div className="icon" ><img src={this.state.bankDetails?.image} width="36" alt="bank" /></div>
                      <div>
                        <div className="banktext-header">{this.state.bankDetails.bank_code} - {this.state.bankDetails.bank_acc_no}</div>
                        <div className="banktext-subheader">Primary bank account</div>
                      </div>
                    </div>
                  </div>
                  <WVInfoBubble
                    isDismissable={false}
                    type='info'
                    hasTitle={false}>
                        Make payment via UPI or net banking using your {this.state.bankDetails.bank_code} account ending with {(this.state.bankDetails.bank_acc_no || '').replace(/\x/g, '')}
                    </WVInfoBubble>
                </div>
            </div>
            <div className="block-padding payusing">
              Pay ₹ {this.state.amount?.toLocaleString()} using
            </div>
            <div className="tabs">
              {/* upi */}
              {
                this.state.upiSupported &&
                <div className="paymentcard upi tab" onClick={() => this.selectptype('upi')}>
                  <input type="radio" id="rd1" name="rd" defaultChecked={this.state.isUpiSelected} />
                  <label className={`tab-label ${getConfig().productName}`} htmlFor="rd1">
                    <div className="item-header">
                      <img src={icn_upi_apps} width="20" alt="upi" />
                      <div className="bold dark-grey-text">UPI APPs</div>
                    </div>
                  </label>
                  {intent_supported && !upi_others && <div className="add-button tab-content">
                    <UpiRows goToPayment={this.goToPayment} />
                    <div onClick={() => this.goToPayment('others')}><img src={icn_more} alt="more" /><div className="bottomtext">Others</div></div>
                  </div>}
                  {intent_supported && upi_others && <div className="add-button tab-content">
                    <button className={`${store.partner}`} onClick={() => this.goToPayment('others')}>Pay using UPI</button>
                  </div>}
                  {!intent_supported && <div className="add-button tab-content">
                    <button className={`${store.partner}`} onClick={() => this.goToPayment('upi')}>Pay using UPI</button>
                  </div>}
                </div>
              }

                {/* netbanking */}
                {
                  this.state.netBankingSupported &&
                  <div className="paymentcard tab" onClick={() => this.selectptype('netbanking')}>
                    <input type="radio" id="rd2" name="rd" defaultChecked={this.state.isNetbankingSelected} />
                    <label className={`tab-label ${getConfig().productName}`} htmlFor="rd2">
                      <div className="item-header">
                        <img src={this.state.bankDetails.image} width="20" alt="netbanking" />
                        <div className="bold dark-grey-text">Net Banking</div>
                      </div>
                    </label>
                    <div className="add-button tab-content">
                      <button className={`${store.partner}`} onClick={() => this.goToPayment('netbanking')}>Pay using net banking</button>
                    </div>

                  </div>
                }

                {/* neft */}
                {
                  this.state.neftSupported &&
                  <div className="paymentcard tab" onClick={() => this.selectptype('neft')}>
                    <input type="radio" id="rd4" name="rd" defaultChecked={this.state.isNEFTSelected} />
                    <label className={`tab-label ${getConfig().productName}`} htmlFor="rd4">
                      <div className="item-header">
                        <img src={this.state.bankDetails.image} width="20" alt="neft" />
                        <div className="bold dark-grey-text">NEFT/RTGS</div>
                      </div>
                    </label>
                    <div className="add-button tab-content">
                      <button className={`${store.partner}`} onClick={() => this.goToPayment('neft')}>Pay using NEFT/RTGS</button>
                    </div>
                  </div>
                }

            </div>
            <div className="encription">
              <img src={icn_secure_payment} alt="secure" />
            </div>
            {this.state.showUpiModal &&
              <UpiModal
                banks={this.state.upiBanks}
                accountNumber={this.state.bank.account_number}
                selectedUpiBank={this.selectedUpiBank}
                loadUPi={this.loadUPi}
                handleCheck={this.handleCheck}
                checked={this.state.checked}
                activeIndex={this.state.activeIndex}
                highlighttnc={this.state.highlighttnc} />
            }
            {this.state.showNetBankModal &&
              <SelectBankModal
                banks={store.banks}
                selectedBank={this.selectedBank}
                closeBankModal={this.closeBankModal}
                activeIndex={this.state.activeIndex} />
            }
            {this.state.openIppbDisclaimer && (
              <IppbDisclaimer
                open={this.state.openIppbDisclaimer}
                close={this.closeIppbDisclaimer}
              />
            )}
          </div>
      </Container>
    );
  }
}

export default PaymentOption;
