import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import completed_step from "assets/completed_step.svg";
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';

import ConfirmDialog from '../ui_components/confirm_dialog';
import GoldLivePrice from '../ui_components/live_price';
import RefreshSellPrice from '../ui_components/sell_price';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import { storageService } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';

class SellSelectBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      selectedIndex: -1,
      provider: this.props.match.params.provider,
      openConfirmDialog: false,
      orderType: 'sell'
    }

    this.renderBanks = this.renderBanks.bind(this);
  }

  componentWillMount() {
    storageService().remove('goldVerifyBankData');
  }

  onload = () => {
    this.setState({
      openOnloadModal: false
    })
    this.setState({
      openOnloadModal: true
    })
  }

  updateParent(key, value) {
    this.setState({
      [key]: value
    })
  }

  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
    });

    if (this.state.openPriceChangedDialog && this.state.timeAvailable > 0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  refreshData = () => {

    if (this.state.timeAvailable > 0) {
      this.handleClick();
    } else {
      this.setState({
        show_loader: true,
        openRefreshModule: true
      })
    }

  }

  getBankData = async () => {
    Api.get('/api/gold/user/bank/details').then(res => {

      this.setState({ show_loader: false });

      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let bankData = result.plutus_bank_info || [];
        this.setState({
          bankData: bankData
        })
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    }).catch(error => {
      this.setState({ show_loader: false });
    });

    // let bank_data = {
    //   "bank_name": 'ICICI Bank',
    //   "account_number": "xxxx-8600"
    // };

    // let bank_data2 = {
    //   "bank_name": 'ICICI Bank',
    //   "account_number": "xxxx-8600",
    //   "status": 'pending'
    // };
    // this.setState({
    //   bankData: [bank_data, bank_data, bank_data2],
    //   show_loader: false
    // })
  }


  componentDidMount() {
    this.onload();
    this.getBankData();
  }

  navigate = (pathname, address_id) => {
    let searchParams = getConfig().searchParams;
    if (address_id) {
      searchParams += '&address_id=' + address_id;
    }

    this.props.history.push({
      pathname: pathname,
      search: searchParams,
    });
  }

  chooseBank = (index, bank) => {
    if (this.isVerificationPending(bank)) {
      return;
    }
    this.setState({
      selectedIndex: index
    })
  }

  handleClick = async () => {

    this.handleClose();

    if (this.state.selectedIndex === -1) {
      return;
    }

    let selectedBank = this.state.bankData[this.state.selectedIndex];
    let sellData = storageService().getObject('sellData');
    this.sendEvents('next');


    var options = {
      "plutus_rate_id": sellData.goldSellInfo.plutus_rate_id,
      "sell_price": sellData.amount_selected,
      'account_number': selectedBank.account_number,
      'ifsc_code': selectedBank.ifsc_code
    }

    this.setState({
      show_loader: true,
    });

    try {
      const res = await Api.post('/api/gold/user/sell/confirm/' + this.state.provider, options);
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        var sellDetails = result.sell_confirmation_info;

        window.localStorage.setItem('sellDetails', JSON.stringify(sellDetails));
        this.setState({
          show_loader: false,
        });
        this.navigate('/gold/' + this.state.provider  + '/sell/payment', sellDetails.provider_sell_order_status)
      } else if (res.pfwresponse.result.is_gold_rate_changed) {
        let new_rate = res.pfwresponse.result.new_rate;
        let amountUpdated, weightUpdated;
        let sellData = this.state.sellData;
        if (sellData.isAmount) {
          amountUpdated = sellData.amount;
          weightUpdated = (sellData.amount) * (new_rate.plutus_rate);
        } else {
          weightUpdated = sellData.weight;
          amountUpdated = (sellData.weight) / (new_rate.plutus_rate);
        }
        this.setState({
          show_loader: false,
          amountUpdated: amountUpdated,
          weightUpdated: weightUpdated,
          new_rate: new_rate,
          openPopup: true
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

  isVerificationPending(bank) {
    let status = bank.penny_verification_reference.penny_verification_state;

    if(status === 'request_triggered' || status === 'delayed_response') {
      return true;
    }

    return false;
  }

  renderBanks(props, index) {
    return (
      <div onClick={() => this.chooseBank(index, props)}
        className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
        key={index}
        style={{ opacity: this.isVerificationPending(props) ? 0.4 : 1 }}
      >
        <div className="left-icon">
          <img style={{ width: '40px', margin: '0 7px 0 0' }}
            src={require(`assets/ic_health_myway.svg`)} alt="info"
          />
        </div>
        <div className="select-bank">
          <div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="bank-name">
                  {props.bank_name}
                </div>
                <div className="account-number">
                  {props.account_number}
                  {this.isVerificationPending(props) &&
                    <span> (Verification pending)</span>}
                </div>
              </div>
              <div style={{}}>
                {index === 0 &&
                  <span className="primary-bank">PRIMARY</span>}
                {index === this.state.selectedIndex &&
                  <img style={{ width: 9, margin: '4px 0 0 8px', verticalAlign: 'middle' }} src={completed_step} alt="Gold Delivery" />}
              </div>

            </div>

          </div>
        </div>
      </div >
    )
  }

  handleClick2 = () => {
    if (this.state.selectedIndex === -1) {
      return;
    }
    this.setState({
      openConfirmDialog: true
    })
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Sell Bank Details',
        'account_no': this.state.account_no_error ? 'invalid' : this.state.account_no ? 'valid' : 'empty',
        'confirm_account_no': this.state.confirm_account_no_error ? 'invalid' : this.state.confirm_account_no ? 'valid' : 'empty',
        'ifsc_code': this.state.ifsc_code_error ? 'invalid' : this.state.ifsc_code ? 'valid' : 'empty'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  render() {
    return (
      <Container
        summarypage={true}
        showLoader={this.state.show_loader}
        title="Select an account"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="Continue"
        disable={this.state.selectedIndex === -1 ? true : false}
        withProvider={true}
        buttonData={this.state.bottomButtonData}
        events={this.sendEvents('just_set_events')}
      >
        <div className="common-top-page-subtitle">
          Amount will be credited to selected account
        </div>

        <GoldLivePrice parent={this} />
        <div className="gold-sell-select-bank">
          {this.state.bankData && this.state.bankData.map(this.renderBanks)}
          <div
            onClick={() => this.navigate('sell-add-bank')}
            className="add-new-button">
            <span style={{
              background: '#F0F7FF', padding: '4px 9px 4px 9px',
              color: getConfig().secondary, margin: '0 9px 0 0'
            }}>+</span> Add Bank
            </div>
        </div>
        <ConfirmDialog parent={this} />

        <PriceChangeDialog parent={this} />

        {this.state.openRefreshModule &&
          <RefreshSellPrice parent={this} />}

        {this.state.openOnloadModal &&
          <GoldOnloadAndTimer parent={this} />}
      </Container >
    );
  }
}


export default SellSelectBank;
