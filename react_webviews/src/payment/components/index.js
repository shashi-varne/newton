import React from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import "./Style.css";
import "./Style.scss";

import icn_upi_apps from 'assets/icn_upi_apps.svg';
import icn_debit_card from 'assets/icn_debit_card.svg';
import icn_gpay from 'assets/icn_gpay.svg';
import icn_phonepe from 'assets/icn_phonepe.svg';
import icn_paytm from 'assets/icn_paytm.svg';
import icn_more from 'assets/icn_more.svg';
import icn_secure_payment from 'assets/icn_secure_payment.svg';
import completed_step from 'assets/completed_step.svg';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';

let store = {}
let retry_enabled = true;
let intent_supported = false;
let upi_others = true;
window.PlutusInitState = {};

const pushEvent = (eventObj) => {
  // todo
};

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
        <div className="upi-button margin-top">
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
        <header className={`${store.app}`}>
          {store.app !== 'pro' && <img src="/static/img/ic_close_fisdom.svg" width="25" onClick={() => props.closeBankModal()} alt="close" />}
          {store.app === 'pro' && <img src="/static/img/ic_close_myway.svg" width="25" onClick={() => props.closeBankModal()} alt="close" />}
        </header>
        <div className="header">
          <h1>Select preferred bank</h1>
        </div>
        <div className="list">
          {bankList}
        </div>
        <div className="footer upi-button margin-top">
          <button className={`active ${store.partner}`} onClick={() => props.closeBankModal(true)}>Continue</button>
        </div>
      </div>
    </div>
  );
};

const CancelModal = (props) => {
  window.PlutusInitState.page = 'pg_option_modal';
  const reasons = [
    { "key": "reason3", "value": "I don't have net banking/ debit-card/ UPI" },
    { "key": "reason2", "value": "Bank page not opening" },
    { "key": "reason6", "value": "Looking for more information" },
    { "key": "reason1", "value": "Just exploring" },
    { "key": "reason5", "value": "Amount debited & order not completed" }
  ];

  const reasonList = reasons.map((item, i) => {
    return (
      <div className="list" onClick={() => props.inputOnClick(item.key)} key={i}>
        <label>
          <div className="item">
            <input
              type="radio"
              name="reason"
            />
          </div>
          <div className="item">
            <div className="text">{item.value}</div>
          </div>
        </label>
      </div>
    );
  });

  return (
    <div id="myModal" className="modal modal-center">
      <div className="modal-content">
        <div className="header">
          <h1>Do you really want to cancel the investment? Please share your feedback:</h1>
        </div>
        <div className="questions">
          {reasonList}
        </div>
        <div className="buttons">
          <button className={`border-button ${store.partner}`} onClick={props.sendReason}>OK</button>
          <button className={`filled-button ${store.partner}`} onClick={props.goBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

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
      show_loader: true
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
  componentDidMount = async () => {
    window.PlutusInitState.page = this.props.page;
    let url = getConfig().base_url + '/api/invest/test/pg/summary/' + getConfig().pc_urlsafe;
    try {
      let res = await Api.get(url);
      let resultData = res.pfwresponse.result;
      store = resultData;
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
        show_loader: false,
        notSupportedBankCount: unSupportedBanks.length,
        supportedBanks: supportedBanks,
        unSupportedBanks: unSupportedBanks,
        unSupportedBankNames: unSupportedBankNames,
        upiBanks: upiBanks,
        neftBanks: neftBanks,
        activeIndex: activeIndex,
        selectedBank: store.banks[activeIndex]
      })
    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }

    window.PlutusInitState.modalCallback = (bool) => {
      this.setState({ showUpiModal: bool, showNetBankModal: bool });
      window.PlutusInitState.page = 'pg_option';
    };

    window.PlutusInitState.cancelModalCallback = (bool) => {
      this.setState({ showCancelModal: bool });
      window.PlutusInitState.page = 'pg_option';
    }
    document.addEventListener('click', this.handleClick, false);
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelector("input[type=radio]:checked").value = true;
    }, false);

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
      this.setState({ show_loader: true });
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

  goToPayment(type) {
    if (type === "debit") {
      this.setState({ show_loader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&gateway_type=HMP';
    } else if (type === "netbanking") {
      this.setState({ show_loader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&bank_code=' + this.state.selectedBank.bank_code + '&account_number=' + this.state.selectedBank.account_number;
    } else if (type === "neft") {
      this.props.history.push('neft', { store: store, neftBanks: this.state.neftBanks });
    } else if (type === "upi") {
      this.setState({ show_loader: true });
      nativeCallback('take_control', window.location.href);
      window.location.href = store.url + '&account_number=' + this.state.selectedBank.account_number + '&gateway_type=UPI';
    } else {
      nativeCallback('show_toast', 'Pay using bank a/c - ' + this.state.selectedBank.obscured_account_number + ' only');
      this.setState({ show_loader: true });
      let that = this;
      Api.get(store.intent_url + '?bank_id=' + this.state.selectedBank.bank_id + `&gateway_type=UPI`).then(data => {
        if (data.pfwresponse.status_code === 200) {
          let upi_payment_data = data.pfwresponse.result;
          upi_payment_data.package_name = type;
          nativeCallback('take_control', window.location.href);
          nativeCallback('initiate_upi_payment', upi_payment_data);
        } else {
          that.setState({ show_loader: false });
          if (data.pfwresponse.result.error === 'failure') {
            nativeCallback('show_toast', data.pfwresponse.result.message);
          }
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
      this.setState({ show_loader: true });
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
      //     if (data.pfwresponse.status_code === 200) {
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
    if (this.state.selectedBank && store.banks && store.banks.length) {
      return (
        <Container
          subtitle=""
          header={true}
          noFooter={true}
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
                  <div className="icon" ><img src={this.state.selectedBank.image} width="36" alt="bank" /></div>
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
              <div className="paymentcard upi tab" onClick={() => this.selectptype('upi')}>
                <input type="radio" id="rd1" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd1">
                  <div className="item-header">
                    <img src={icn_upi_apps} width="20" alt="upi" />
                    <div className="bold dark-grey-text">UPI APPs</div>
                  </div>
                </label>
                {intent_supported && !upi_others && <div className="add-button tab-content">
                  <div onClick={() => this.goToPayment('com.google.android.apps.nbu.paisa.user')}><img src={icn_gpay} alt="gpay" /><div className="bottomtext">Google Pay</div></div>
                  <div onClick={() => this.goToPayment('com.phonepe.app')}><img src={icn_phonepe} alt="phonepe" /><div className="bottomtext">PhonePe</div></div>
                  <div onClick={() => this.goToPayment('net.one97.paytm')}><img src={icn_paytm} alt="paytm" /><div className="bottomtext">Paytm</div></div>
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
            {store.show_netbanking && this.state.selectedBank.bank_supported &&
              <div className="paymentcard tab" onClick={() => this.selectptype('netbanking')}>
                <input type="radio" id="rd2" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd2">
                  <div className="item-header">
                    <img src={this.state.selectedBank.image} width="20" alt="netbanking" />
                    <div className="bold dark-grey-text">Net Banking</div>
                  </div>
                </label>
                <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('netbanking')}>Pay using net banking</button>
                </div>

              </div>
            }
            {store.show_debit &&
              <div className="paymentcard tab" onClick={() => this.selectptype('debit')}>
                <input type="radio" id="rd3" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd3">
                  <div className="item-header">
                    <img src={icn_debit_card} width="20" alt="debit" />
                    <div className="bold dark-grey-text">Debit Cards</div>
                  </div>
                </label>
                <div className="add-button tab-content">
                  <button className={`${store.partner}`} onClick={() => this.goToPayment('debit')}>Pay using debit card</button>
                </div>
              </div>
            }
            {store.allow_neft && this.state.selectedBank.neft_supported &&
              <div className="paymentcard tab" onClick={() => this.selectptype('neft')}>
                <input type="radio" id="rd4" name="rd" />
                <label className={`tab-label ${store.app}`} htmlFor="rd4">
                  <div className="item-header">
                    <img src={this.state.selectedBank.image} width="20" alt="neft" />
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
          {this.state.showCancelModal &&
            <CancelModal
              inputOnClick={this.inputOnClick}
              sendReason={this.sendReason}
              goBack={this.closeModal} />
          }
        </Container>
      );
    } else {
      return null
    }
  }
}

export default PaymentOption;
