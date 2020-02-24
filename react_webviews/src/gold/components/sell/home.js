import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { default_provider, gold_providers, setSellDataAfterUpdate,
  calculate_gold_wt_sell, calculate_gold_amount_sell, isUserRegistered} from  '../../constants';
import { inrFormatDecimal2, storageService, formatAmountInr, formatGms} from "utils/validators";
import GoldProviderFilter from '../ui_components/provider_filter';
import GoldLivePrice from '../ui_components/live_price';
import RefreshSellPrice from '../ui_components/sell_price';
import PriceChangeDialog from '../ui_components/price_change_dialog';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';

const stepsContentMapper = [
  {'icon': 'ic_gold_provider', 'content': '1. Select your preferred gold provider'},
  {'icon': 'ic_input', 'content': '2. Enter amount in rupees or grams'},
  {'icon': 'ic_make_payment', 'content': '3. Confirm bank account details'},
  {'icon': 'ic_gold_added', 'content': '4. Get money in selected bank account within 48 hrs'}
];

class GoldSellHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      popupText: '',
      apiError: '',
      provider_info: {},
      user_info: {},
      goldSellInfo: {},
      gold_products: [],
      maxWeight: '',
      maxAmount: '',
      isRegistered: false,
      isWeight: false,
      isAmount: true,
      amountError: false,
      weightError: false,
      weight: '',
      amount: '',
      params: qs.parse(props.history.location.search.slice(1)),
      value: 0,
      error: false,
      errorMessage: '',
      countdownInterval: null,
      provider: storageService().get('gold_provider') || default_provider,
      gold_providers: gold_providers,
      orderType: "sell",
      redirect_state: 'sell-home',
      fetchLivePrice: true,
      openPriceChangedDialog: false,
      productName: getConfig().productName
    }

  }

   // common code start
  onload = () => {
    this.setState({
      openOnloadModal: false
    })
    this.setState({
      openOnloadModal: true
    })
  }

  updateParent(key, value) {

    if(key === 'fetchLivePrice' && !value) {
      this.setMaxWeightAmount();
    }

    this.setState({
      [key]: value
    })
  }

  handleClose = () => {
    this.setState({
      openDialogOffer: false
    });

    if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
  }

  setMaxWeightAmount() {
    let maxWeight = this.state.maxWeight;
    let maxAmount = ((this.state.goldSellInfo.plutus_rate) * (maxWeight || 0)).toFixed(2);
    let weightDiffrence = this.state.provider_info.gold_balance - maxWeight;
    let sellWeightDiffrence = false;
    if(weightDiffrence > 0) {
      sellWeightDiffrence = true
    }
    this.setState({
      maxWeight: maxWeight,
      maxAmount: maxAmount,
      sellWeightDiffrence: sellWeightDiffrence
    });
  }

  async componentDidMount() {

    this.setState({
      error: false,
      errorMessage: ''
    });

    try {

      const res = await Api.get('/api/gold/user/account/' + this.state.provider);
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result || {};
        let isRegistered = isUserRegistered(result);
        this.setState({
          provider_info: result.gold_user_info.provider_info || {},
          user_info: result.gold_user_info.user_info || {},
          isRegistered: isRegistered
        });

        if(!isRegistered) {
          let err = 'You haven’t invested in gold yet, buy now!';
          this.setState({
            base_error: err,
            amountError: err,
            weightError: err
          })
        }
      } else {
        this.setState({
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
        
      }

      const res3 = await Api.get('/api/gold/user/sell/balance/' + this.state.provider);

      if (res3.pfwresponse.status_code === 200) {

        let result = res3.pfwresponse.result;
        
        let maxWeight = parseFloat(result.sellable_gold_balance || 0).toFixed(4);
        this.setState({
          sellable_gold_balance: result.sellable_gold_balance,
          maxWeight: maxWeight
        })
        this.setMaxWeightAmount();
       
      } else {
        this.setState({
          error: true,
          errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
            'Something went wrong'
        });
      }
    
    } catch (err) {
      this.setState({
        show_loader: false,
        error: true,
        errorMessage: 'Something went wrong'
      });
    }

    this.setState({
      show_loader: false
    });
  }

 
  sendEvents(user_action, current_data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'sell_gold',
        "provider": this.state.provider || '',
        "sell_option": this.state.isAmount ? 'inr': 'gms',
        "faq_clicked": this.state.faq_clicked ? 'yes' : 'no',
        "change_provider": current_data.change_provider ? 'yes' : 'no',
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

  handleClick = async () => {

    this.handleClose();
    this.sendEvents('next');

    let amount = this.state.amount;
    let weight = this.state.weight;
    if (!weight || weight < 0) {
      toast('Please enter a correct value for the weight', 'error');
      return;
    }

    if (!amount || amount < 0) {
      toast('Please enter a correct value for the amount', 'error');
      return;
    }

    if (amount >= 0 && amount < 1) {
      toast('Minimum amount should be Rs. 1', 'error');
      return;
    }

    if (amount > parseFloat(this.state.maxAmount) ||
      weight > parseFloat(this.state.maxWeight)) {
      toast("You don't have enough gold", 'error');
      return;
    }

    if(!this.state.user_info.pan_number) {
      this.navigate(this.state.provider + '/sell-pan');
    } else {
      this.navigate(this.state.provider + '/sell-select-bank');
    }

  }

  selectGoldProduct(index) {
    this.sendEvents('next', this.state.gold_products[index].disc);
    let selectedProduct = this.state.gold_products[index];
    window.localStorage.setItem('goldProduct', JSON.stringify(selectedProduct));
    this.navigate(this.state.provider + '/select-gold-product');
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  chooseTabs() {
    this.setState({
      isAmount: !this.state.isAmount
    })
  }

  setAmountGms = (event) => {

    if(this.state.base_error) {
      return;
    }
    let amountError = false;
    let weightError = false;
    let amount = '', weight = '';
    let inputData = {};

    let eventName = event.target.name;
    let eventValue = event.target.value;

    if(eventName === 'weight') {
      eventValue = (eventValue).replace(/in gm /g, "");
      eventValue = (eventValue).replace(/in gm/g, "");
      weight = eventValue;
    }

    if(eventName === 'amount') {
      eventValue = (eventValue).replace(/,/g, "");
      eventValue = eventValue.replace(/₹/g, "");
      amount = eventValue
    }

    if (eventName === 'amount' && eventValue) {
      inputData = calculate_gold_wt_sell(this.state.sellData, amount);
      weight = inputData.weight;

    } else if (eventName === 'weight' && eventValue) {
      inputData = calculate_gold_amount_sell(this.state.sellData, weight);
      amount = inputData.amount;
    } else {
      amount = '';
      weight = '';
    }

    if (!weight || parseFloat(weight) < 0 ||
      parseFloat(weight) > parseFloat(this.state.maxWeight)) {
      weightError = true;
    }

    if (!amount || parseFloat(amount) < 0) {
      amountError = true;
    }

    if (amount >= 0 && parseFloat(amount) < 1) {
      amountError = true;
    }

    if (parseFloat(amount) > parseFloat(this.state.maxAmount) ||
      parseFloat(weight) > parseFloat(this.state.maxWeight)) {
      amountError = true;
    }

    // will consume for buy price and buy order;
    let sellData = storageService().getObject('sellData');
    sellData.amount_selected = amount;
    sellData.weight_selected = weight;
    sellData.inputMode = this.state.isAmount ? 'amount' : 'weight';
    storageService().setObject('sellData', sellData);

    setSellDataAfterUpdate(inputData);


    this.setState({
      amountError: amountError,
      weightError: weightError,
      amount: amount,
      weight: weight,
      sellData: sellData
    })
  };

  updateChild = (key, value) => {
    this.setState({
      [key] : value
    })
  }

  showHideSteps() {

    this.setState({
      showSteps: !this.state.showSteps,
      faq_clicked: true
    })
    
  }

  renderInfoSteps =(props, index) => {
    return(
      <div key={index} className="tile">
        <img className="icon" 
        src={require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="Gold" />
        <div className="content">
          {props.content}
        </div>
      </div>
    );
  }

  render() {

    return (
      <Container
        noFooter={true}
        showLoader={this.state.show_loader}
        buttonTitle="Proceed"
        headerType="provider-filter"
        handleClick={this.handleClick}
        title={'Sell gold: ' + this.state.gold_providers[this.state.provider].title}
        events={this.sendEvents('just_set_events')}
        updateChild={this.updateChild}
      >
        <GoldProviderFilter parent={this} />
        <GoldLivePrice parent={this} 
        style={{
          margin: '40px 0 20px 0'
        }}
        />
        <div className="sell-home" id="goldSection">
        <div className="gold-aw-inputs">
              <div className="gold-aw-tabs">
                <div onClick={() => this.chooseTabs()} className={`gold-aw-tab ${this.state.isAmount ? 'selected': ''}`}>
                  Enter in INR
                </div>
                <div onClick={() => this.chooseTabs()} className={`gold-aw-tab ${!this.state.isAmount ? 'selected': ''}`}>
                  Enter in gms
                </div>
              </div>
              
              <FormControl fullWidth>
               
                <div className="InputField">
                {this.state.isAmount &&
                  <div >
                    <div>
                      <TextField
                          type="text"
                          autoComplete="off"
                          error={this.state.base_error ? true: false}
                          helperText={this.state.base_error}
                          name="amount"
                          id="amount"
                          disabled={!this.state.openOnloadModal || !this.state.isRegistered}
                          onChange={(event) => this.setAmountGms(event)}
                          onKeyPress={this.handleKeyChange('amount')}
                          value={formatAmountInr(this.state.amount || '')}
                        />

                        <label className="gold-placeholder-right">= {this.state.weight} gms</label>
                      </div>
                      {this.state.isRegistered &&  
                      <div className={'input-below-text ' + (this.state.amountError ? 'error' : '')}>
                      {this.state.maxAmount >= 1 && <span> Min ₹1.00 - </span>}
                      {/* {this.state.sellWeightDiffrence && <span>*</span>} */}
                      <span> Max ₹ {this.state.maxAmount}</span>
                      </div>}
                  </div>
                }

                {!this.state.isAmount &&
                  <div >
                    <div>
                        <TextField
                          type="text"
                          autoComplete="off"
                          label=""
                          name="weight"
                          id="weight"
                          error={this.state.base_error ? true: false}
                          helperText={this.state.base_error}
                          disabled={!this.state.openOnloadModal || !this.state.isRegistered}
                          onChange={(event) => this.setAmountGms(event)}
                          onKeyPress={this.handleKeyChange('weight')}
                          value={formatGms(this.state.weight || '')}
                        />

                        <label className="gold-placeholder-right">= {inrFormatDecimal2(this.state.amount || '')}</label>
                      </div>

                      {this.state.isRegistered && <div className={'input-below-text ' + (this.state.weightError ? 'error' : '')}>
                      {/* {this.state.sellWeightDiffrence && <span>*</span>} */}
                      Max {this.state.maxWeight} gm
                      </div>}
                  </div>
                }
                  
                </div>
              </FormControl>

              <div>
                  <Button fullWidth={true} variant="raised" disabled={!this.state.isRegistered}
                      size="large" onClick={this.handleClick} color="secondary" autoFocus>
                    Proceed
                  </Button>
              </div>
            </div>

            <div className="gold-how-steps pointer" onClick={() => this.showHideSteps()}>
                <div className="top-tile">
                  <div className="top-title">
                  How to sell digital gold?
                  </div>
                  <div className="top-icon">
                    <img src={ require(`assets/${this.state.showSteps ? 'minus_icon' : 'plus_icon'}.svg`)} alt="Gold" />
                  </div>
                </div>


              {this.state.showSteps &&
                <div className='gold-steps-images'>
                 {stepsContentMapper.map(this.renderInfoSteps)}
                </div>
              }
            </div>


            <GoldBottomSecureInfo />
          </div>

          <PriceChangeDialog parent={this} />
        {this.state.openRefreshModule &&
         <RefreshSellPrice parent={this} />}

        {this.state.fetchLivePrice && 
        <RefreshSellPrice parent={this} />}

        {this.state.openOnloadModal && 
        <GoldOnloadAndTimer parent={this} />}
      </Container>
    );
  }
}

export default GoldSellHome;
