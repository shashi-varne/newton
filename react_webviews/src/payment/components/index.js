import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../common/functions';
import BottomInfo from '../../common/ui/BottomInfo';
import { getConfig } from 'utils/functions';
import SVG from 'react-inlinesvg';
import { numDifferentiationInr, inrFormatDecimal } from 'utils/validators';
import "./Style.css";

import icn_upi_apps from 'assets/icn_upi_apps.svg';
import icn_debit_card from 'assets/icn_debit_card.svg';
import icn_gpay from 'assets/icn_gpay.svg';
import icn_phonepe from 'assets/icn_phonepe.svg';
import icn_paytm from 'assets/icn_paytm.svg';
import icn_more from 'assets/icn_more.svg';
import icn_secure_payment from 'assets/icn_secure_payment.svg'

const store = {
  message: '',
  show_debit: true,
  show_netbanking: true,
  allow_neft: true,
  neft_callback_url: '',
  bank_list_url: '',
  upi_add_bank_url: '',
  banks: [{ "penny_verification_reference": {}, "obscured_account_number": "xx22", "ifsc_details": { "city": "PATNA", "district": "PATNA", "new_ifsc": null, "ifsc": "SBIN0001513", "micr": "800002033", "state": "BIHAR", "contact": "0", "branch": "PATLIPUTRA", "address": "DISTPATNA  BIHAR 800013", "id": 4871689867362304, "bank": "STATE BANK OF INDIA" }, "name_match_state": null, "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/SBI.png", "bank_status": "submitted", "bank_id": 192870294, "non_editable_details": [], "billdesk_supported": true, "partner": null, "source_of_info": null, "actual_ifsc_code": "SBIN0001513", "received_name": "", "user_id": 6503257211928577, "razorpay_supported": true, "ifsc_code": "SBIN0001513", "rejection_allowed": true, "bank_short_name": "SBI", "bank_name": "STATE BANK OF INDIA", "upi_supported": true, "account_type": "SB-NRE", "bank_code": "SBI", "neft_supported": true, "rejection_details": "None", "kyc_bank_code": "SBIN", "branch_name": "PATLIPUTRA", "dt_created": "01/24/20 05:30:00", "pg_code": "SBI", "dt_updated": "01/28/20 05:30:00", "name": null, "bank_supported": true, "version_flag": "migrated", "user_rejection_attempts": 3, "ifsc_image": "https://test-dot-plutus-staging.appspot.com/static/img/bank_logos/SBI.png", "account_number": "1236", "module_name": "kyc", "is_primary_bank": false }, { "penny_verification_reference": {}, "obscured_account_number": "xx34", "ifsc_details": { "city": "FEROZPUR", "district": "PANJKOSI", "new_ifsc": null, "ifsc": "HDFC0003132", "micr": "152240007", "state": "PUNJAB", "contact": "9815331111", "branch": "PANJE KE", "address": "HDFC BANK LTD PREMISES ADJOINING MAIN MARKET, VPO PANJE KE, DISTT. FEROZEPUR, PANJE KE PUNJAB 152024", "id": 6538793502900224, "bank": "HDFC BANK" }, "name_match_state": null, "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/HDF.png", "bank_status": "submitted", "bank_id": 200880194, "non_editable_details": [], "billdesk_supported": true, "partner": null, "source_of_info": null, "actual_ifsc_code": "HDFC0003132", "received_name": "", "user_id": 6503257211928577, "razorpay_supported": true, "ifsc_code": "HDFC0003132", "rejection_allowed": true, "bank_short_name": "HDFC", "bank_name": "HDFC BANK", "upi_supported": true, "account_type": "SB", "bank_code": "HDF", "neft_supported": true, "rejection_details": "None", "kyc_bank_code": "HDFC", "branch_name": "PANJE KE", "dt_created": "01/24/20 05:30:00", "pg_code": "HDF", "dt_updated": "01/24/20 05:30:00", "name": null, "bank_supported": true, "version_flag": "migrated", "user_rejection_attempts": 3, "ifsc_image": "https://test-dot-plutus-staging.appspot.com/static/img/bank_logos/HDF.png", "account_number": "1234", "is_primary_bank": false }, { "penny_verification_reference": {}, "obscured_account_number": "xx36", "ifsc_details": { "city": "PATNA", "district": "PATNA", "new_ifsc": null, "ifsc": "SBIN0001513", "micr": "800002033", "state": "BIHAR", "contact": "0", "branch": "PATLIPUTRA", "address": "DISTPATNA  BIHAR 800013", "id": 4871689867362304, "bank": "STATE BANK OF INDIA" }, "name_match_state": null, "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/SBI.png", "bank_status": "submitted", "bank_id": 192870294, "non_editable_details": [], "billdesk_supported": true, "partner": null, "source_of_info": null, "actual_ifsc_code": "SBIN0001513", "received_name": "", "user_id": 6503257211928577, "razorpay_supported": true, "ifsc_code": "SBIN0001513", "rejection_allowed": true, "bank_short_name": "SBI", "bank_name": "STATE BANK OF INDIA", "upi_supported": true, "account_type": "SB-NRE", "bank_code": "SBI", "neft_supported": true, "rejection_details": "None", "kyc_bank_code": "SBIN", "branch_name": "PATLIPUTRA", "dt_created": "01/24/20 05:30:00", "pg_code": "SBI", "dt_updated": "01/28/20 05:30:00", "name": null, "bank_supported": true, "version_flag": "migrated", "user_rejection_attempts": 3, "ifsc_image": "https://test-dot-plutus-staging.appspot.com/static/img/bank_logos/SBI.png", "account_number": "123456", "module_name": "kyc", "is_primary_bank": true }],
  show_warning: '',
  url: '',
  amount: 5000,
  upi_enabled: true,
  has_upi_banks: true,
  funds: {},
  supported_bank_list: {},
  flow: '',
  investor: '',
  is_nri: false,
  app: 'fisdom',
  user: {},
  preferred_banks: [{ "bank_name": "State Bank of India", "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/SBI.png", "bank_short_name": "SBI", "pg_code": "SBI", "bank_code": "SBIN" }, { "bank_name": "HDFC Bank", "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/HDF.png", "bank_short_name": "HDFC", "pg_code": "HDF", "bank_code": "HDFC" }, { "bank_name": "SBI Bank", "image": "https://test-dot-plutus-staging.appspot.com/static/img/banks/ICI.png", "bank_short_name": "SBI", "pg_code": "SBI", "bank_code": "SBIN" }],
  generic_callback: true,
  partner: 'obc'
}
let show_reason = false;
let retry_enabled = true;
let intent_supported = true;
let upi_others = true;
let account_types = [];


const pushEvent = (eventObj) => {
  // todo
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
      hasAccount: store.banks.length,
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
      show_loader: false
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
    this.inputOnClick = this.inputOnClick.bind(this);
    this.sendReason = this.sendReason.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    const supportedBanks = store.banks.filter((item, i) => {
      return item.bank_supported;
    });

    const upiBanks = store.banks.filter((item, i) => {
      return item.upi_supported;
    });

    const neftBanks = store.banks.filter((item, i) => {
      return item.neft_supported;
    });

    const unSupportedBanks = store.banks.filter((item, i) => {
      return !item.bank_supported;
    });

    const unSupportedBankNames = unSupportedBanks.map((item, i) => {
      return item.bank_name;
    });
    let activeIndex = store.banks.findIndex(x => x.is_primary_bank === true);
    this.setState({
      notSupportedBankCount: unSupportedBanks.length,
      supportedBanks: supportedBanks,
      unSupportedBanks: unSupportedBanks,
      unSupportedBankNames: unSupportedBankNames,
      upiBanks: upiBanks,
      neftBanks: neftBanks,
      activeIndex: activeIndex,
      selectedBank: store.banks[activeIndex]
    })

    // window.PlutusInitState.modalCallback = (bool) => {
    //   this.setState({ showUpiModal: bool, showNetBankModal: bool });
    //   window.PlutusInitState.page = 'pg_option';
    // };

    // window.PlutusInitState.cancelModalCallback = (bool) => {
    //   this.setState({ showCancelModal: bool });
    //   window.PlutusInitState.page = 'pg_option';
    // }
    document.addEventListener('click', this.handleClick, false);
    // $(document).ready(function () {
    //   $('input[type=radio]').prop('checked', false)[0].checked = true;
    // })
  }

  handleClick(e) {
    let upimodal = document.getElementById('upiModal');
    if (e.target == upimodal) {
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
      ifsc: (this.state.unSupportedBanks.length == 1) ? true : false,
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
      this.setState({ showBilldeskLoader: true, show_loader: false });
      nativeCallback('take_control', window.location.href);
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

  selectptype(type) {
    let eventObj = {
      "event_name": "pg_payment_option",
      "properties": {
        "user_action": "next",
        "pg_mode": type,
        "flow": store.flow,
        "investor": store.investor,
        "initial_kyc_status": store.initial_kyc_status,
        "add_bank_drop": (this.state.netbank.isSelected) ? "yes" : "no"
      }
    };

    pushEvent(eventObj);
    if (type == "debit") {
      this.setState({ isDebitSelected: true, isNetbankingSelected: false, isUpiSelected: false, isNEFTSelected: false, isOpen: true }, () => {
      });
    } else if (type == "upi") {
      this.setState({ isUpiSelected: true, isNetbankingSelected: false, isDebitSelected: false, isNEFTSelected: false }, () => {
      });
    } else if (type == "netbanking") {
      this.setState({ isNetbankingSelected: true, isUpiSelected: false, isDebitSelected: false, isNEFTSelected: false }, () => {

      });
    } else if (type == "neft") {
      this.setState({ isNEFTSelected: true, isNetbankingSelected: false, isDebitSelected: false, isUpiSelected: false }, () => {
      });
    }
  }

  goToPayment(type) {
    if (type === "debit") {
      this.setState({ showDebitLoader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&gateway_type=HMP';
    } else if (type === "netbanking") {
      this.setState({ showBilldeskLoader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&bank_code=' + this.state.selectedBank.bank_code + '&account_number=' + this.state.selectedBank.account_number;
    } else if (type === "neft") {
      this.props.history.push('/neft', {
        neftBanks: this.state.neftBanks
      });
    } else if (type === "upi") {
      this.setState({ showBilldeskLoader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&account_number=' + this.state.selectedBank.account_number + '&gateway_type=UPI';
    } else {
      nativeCallback('show_toast', 'Pay using bank a/c - ' + this.state.selectedBank.obscured_account_number + ' only');
      this.setState({ showBilldeskLoader: true });
      let that = this;
      // $.ajax({
      //   type: 'GET',
      //   url: store.intent_url + '?bank_id=' + this.state.selectedBank.bank_id + `&gateway_type=UPI`
      // }).done(function (data) {
      //   if (data.pfwresponse.status_code == 200) {
      //     let upi_payment_data = data.pfwresponse.result;
      //     upi_payment_data.package_name = type;
      //     nativeCallback('take_control', window.location.href);
      //     nativeCallback('initiate_upi_payment', upi_payment_data);
      //     console.log(upi_payment_data)
      //   } else {
      //     that.setState({ showBilldeskLoader: false });
      //     if (data.pfwresponse.result.error == 'failure') {
      //       nativeCallback('show_toast', data.pfwresponse.result.message);
      //     }
      //   }
      // })
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
      this.setState({ showBilldeskLoader: true });
      nativeCallback('take_control', window.location.href);
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

  inputOnClick(reason) {
    this.setState({ reason: reason });
  }

  sendReason() {
    if (!this.state.reason) {
      nativeCallback('show_toast', 'Please select a reason');
    } else {
      this.setState({ show_loader: true });

      let that = this;

      let eventObj = {
        "event_name": "pg_back_clicked",
        "properties": {
          "user_action": "ok",
          "reason": that.state.reason,
          "flow": store.flow,
          "investor": store.investor,
          "initial_kyc_status": store.initial_kyc_status
        }
      };
      pushEvent(eventObj);

      // $.ajax({
      //   type: 'POST',
      //   dataType: 'json',
      //   contentType: 'application/json',
      //   url: nativeData.pc_link,
      //   data: JSON.stringify({
      //     purpose: nativeData.purpose,
      //     amount: nativeData.amount,
      //     order_type: nativeData.order_type,
      //     reason_key: that.state.reason
      //   })
      // })
      //   .done(function (data) {
      //     if (data.pfwresponse.status_code == 200) {
      //       nativeCallback('close_webview');
      //     }
      //     that.setState({ show_loader: false });
      //   })
      //   .fail(function (jqXHR, textStatus) {
      //     that.setState({ show_loader: false });
      //     console.log("Request failed: " + textStatus);
      //   });
    }
  }

  render() {
    let carouselItems;

    if (this.state.supportedBanks.length > 0) {
      carouselItems = this.state.supportedBanks.map((item, i) => {
        return (
          <div className={`carousel-item ${(this.state.netbank.code == item.bank_code) ? 'active' : ''}`} key={i} onClick={() => this.selectNetBank(item)}>
            <div className="flex">
              <div className="item">
                <img src={item.image} width="30" />
              </div>
              <div className="item">
                <div className="dark-grey-text uppercase">{item.bank_short_name}</div>
                <div className="light-grey">{item.obscured_account_number}</div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      carouselItems = store.preferred_banks.map((item, i) => {
        return (
          <div className={`carousel-item ${(this.state.netbank.code == item.bank_code) ? 'active' : ''}`} key={i} onClick={() => this.selectUnsupportedNetBank(item)}>
            <div className="flex">
              <div className="item">
                <img src={item.image} width="30" />
              </div>
              <div className="item">
                <div className="dark-grey-text uppercase">{item.bank_short_name}</div>
              </div>
            </div>
          </div>
        );
      });
    }
    if (this.state.selectedBank) {
      return (
        <Container
          title=""
          subtitle=""
          header={true}
          page="pg_option"
          showLoader={this.state.show_loader}
          title="Select payment method"
          buttonTitle='Continue'
        >
          <div className="block-padding bold payment-option-sub">Payable amount: ₹ {store.amount.toLocaleString()}</div>
          <div className="block-padding">
            {this.state.selectedBank &&
              <div className="selectedBank selected-bank" onClick={() => this.openModal('bank')}>
                <div className="flex">
                  <div className="icon" ><img src={this.state.selectedBank.image} width="36" /></div>
                  <div>
                    <div className="banktext-header">PAY FROM</div>
                    <div className="banktext-subheader">{this.state.selectedBank.bank_name} - {this.state.selectedBank.obscured_account_number}</div>
                  </div>
                </div>
                {store.banks.length > 1 && <div className="change">CHANGE</div>}
              </div>
            }
          </div>
          <div className="block-padding payusing">
            Pay using
          </div>
          <div className="tabs">
            {(store.has_upi_banks || (store.upi_add_bank_url && store.upi_enabled)) && this.state.selectedBank.upi_supported && retry_enabled &&
              <div className="card upi tab" onClick={() => this.selectptype('upi')}>
                <input type="radio" id="rd1" name="rd" checked="true" />
                <label className={`tab-label ${store.app}`} htmlFor="rd1">
                  <div className="item-header">
                    <img src={icn_upi_apps} width="20" />
                    <div className="bold dark-grey-text">UPI APPs</div>
                  </div>
                </label>
                {intent_supported && !upi_others && <div className="add-button tab-content">
                  <div onClick={() => this.goToPayment('com.google.android.apps.nbu.paisa.user')}><img src={icn_gpay} /><div className="bottomtext">Google Pay</div></div>
                  <div onClick={() => this.goToPayment('com.phonepe.app')}><img src={icn_phonepe} /><div className="bottomtext">PhonePe</div></div>
                  <div onClick={() => this.goToPayment('net.one97.paytm')}><img src={icn_paytm} /><div className="bottomtext">Paytm</div></div>
                  <div onClick={() => this.goToPayment('others')}><img src={icn_more} /><div className="bottomtext">Others</div></div>
                </div>}
                {intent_supported && upi_others && <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('others')}>Pay using UPI</button>
                </div>}
                {!intent_supported && <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('upi')}>Pay using UPI</button>
                </div>}
              </div>
            }
            {store.show_netbanking && this.state.selectedBank.bank_supported &&
              <div className="card tab" onClick={() => this.selectptype('netbanking')}>
                <input type="radio" id="rd2" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd2">
                  <div className="item-header">
                    <img src={this.state.selectedBank.image} width="20" />
                    <div className="bold dark-grey-text">Net Banking</div>
                  </div>
                </label>
                <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('netbanking')}>Pay using net banking</button>
                </div>

              </div>
            }
            {store.show_debit &&
              <div className="card tab" onClick={() => this.selectptype('debit')}>
                <input type="radio" id="rd3" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd3">
                  <div className="item-header">
                    <img src={icn_debit_card} width="20" />
                    <div className="bold dark-grey-text">Debit Cards</div>
                  </div>
                </label>
                <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('debit')}>Pay using debit card</button>
                </div>
              </div>
            }
            {store.allow_neft && this.state.selectedBank.neft_supported &&
              <div className="card tab" onClick={() => this.selectptype('neft')}>
                <input type="radio" id="rd4" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd4">
                  <div className="item-header">
                    <img src={this.state.selectedBank.image} width="20" />
                    <div className="bold dark-grey-text">NEFT/RTGS</div>
                  </div>
                </label>
                <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('neft')}>Pay using NEFT</button>
                </div>
              </div>
            }
          </div>
          <div className="encription">
            <img src={icn_secure_payment} />
          </div>
        </Container>
      );
    } else {
      return null
    }
  }
}

export default PaymentOption;
