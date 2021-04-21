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
import {getTransactionStatus, getUniversalTransStatus} from '../../constants';

class SellSelectBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
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

  getBankData = async () => {
    Api.get('/api/gold/user/bank/details').then(res => {

      this.setState({ show_loader: false, skelton: false });

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
      this.setState({ show_loader: false, skelton: false });
    });

  }


  componentDidMount() {
    this.onload();
    this.getBankData();
  }

  navigate = (pathname, address_id, status) => {

    if(pathname === 'sell-add-bank') {
      this.sendEvents('next', {add_bank_clicked: true});
    }
    let searchParams = getConfig().searchParams;
    if (address_id) {
      searchParams += '&address_id=' + address_id;
    }

    if (status) {
      searchParams += '&status=' + status;
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
    sellData.bank = selectedBank;
    
    this.sendEvents('next');


    var options = {
      "plutus_rate_id": sellData.goldSellInfo.plutus_rate_id,
      "sell_price": sellData.amount_selected,
      "sell_weight": sellData.weight_selected,
      "inputMode": sellData.inputMode,
      'bank_id': selectedBank.bank_id
    }

    this.setState({
      show_loader: true,
    });

    try {
      const res = await Api.post('/api/gold/user/sell/confirm/' + this.state.provider, options);
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        var sellDetails = result.sell_confirmation_info;
        sellData.payment_details = sellDetails;
        sellData.transact_id  = sellDetails.provider_txn_id;
        storageService().setObject('sellData', sellData);
        
        this.setState({
          show_loader: false,
        });

        
        sellDetails.orderType = this.state.orderType;
        sellDetails.final_status = getTransactionStatus(sellDetails);
        let uniStatus = getUniversalTransStatus(sellDetails);

        this.navigate('/gold/' + this.state.provider  + '/sell/payment', '', uniStatus);
      } else if (res.pfwresponse.result.is_gold_rate_changed) {
        // let new_rate = res.pfwresponse.result.new_rate;
        // let amountUpdated, weightUpdated;
        // let sellData = this.state.sellData;
        // if (sellData.isAmount) {
        //   amountUpdated = sellData.amount;
        //   weightUpdated = (sellData.amount) * (new_rate.plutus_rate);
        // } else {
        //   weightUpdated = sellData.weight;
        //   amountUpdated = (sellData.weight) / (new_rate.plutus_rate);
        // }
        // this.setState({
        //   show_loader: false,
        //   amountUpdated: amountUpdated,
        //   weightUpdated: weightUpdated,
        //   new_rate: new_rate,
        //   openPopup: true
        // });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  isVerificationPending(bank) {
    let status = bank.penny_verification_reference.penny_verification_state;

    if (status === 'success') {
      return false;
    }

    return true;

    // if(!status || status === 'request_triggered' || 
    //   status === 'delayed_response') {
    //   return true;
    // }
  }

  renderBanks(props, index) {
    return (
      <div onClick={() => this.chooseBank(index, props)}
        className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`}
        key={index}
        style={{ opacity: this.isVerificationPending(props) ? 0.4 : 1,
        cursor: this.isVerificationPending(props) ? 'unset': 'pointer' }}
      >
        <div className="left-icon">
          <img style={{ width: '30px', margin: '0 7px 0 0' }}
            src={props.ifsc_image} alt="info"
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
    this.setState({
      openConfirmDialog: true,
      price_summary_clicked: true
    })
  }

  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'account_selection',
        'add_bank_clicked': data.add_bank_clicked ? 'yes' : 'no',
        'price_summary_clicked' : this.state.price_summary_clicked ? 'yes' : 'no',
        "timeout_alert": this.state.timeout_alert_event ? 'yes' : 'no',
        "refresh_price": this.state.refresh_price_event ? 'yes' : 'no'
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
        skelton={this.state.skelton}
        title="Select an account"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="CONTINUE"
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
              background: getConfig().styles.highlightColor, padding: '4px 9px 4px 9px',
              color: getConfig().styles.secondaryColor, margin: '0 20px 0 0'
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
