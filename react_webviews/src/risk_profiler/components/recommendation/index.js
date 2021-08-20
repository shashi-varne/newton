import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
// import Input from '../../../common/ui/Input';
import Container from '../../common/Container';
import Api from 'utils/api';
import { inrFormatDecimal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { getConfig, getBasePath } from 'utils/functions';
import check from 'assets/check_mark.png';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent
} from 'material-ui/Dialog';

class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      mfTab: 0,
      yearTab: 4,
      amount: 1000,
      amount_error: '',
      funds: [],
      oepnDialog: false,
      amountModal: '',
      amount_changed: false,
      edit_amount: false
    }
    this.renderFunds = this.renderFunds.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.setNewAmount = this.setNewAmount.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      indicator: params ? params.indicator : false
    })

  }

  async getFunds(duration, amount, type) {
    try {
      let type_choices = ['sip', 'onetime'];
      let timeChoices = ['0m', '6m', '1y', '3y', '5y'];

      if (!this.amountValidation(type, amount)) {
        return;
      }

      this.setState({
        show_loader: true,
        order_type: type_choices[type],
        period: timeChoices[duration]
      });
      let url = '/api/risk/profile/user/recommendation?';
      let riskRecommendationParams = 'duration=' + timeChoices[duration] +
      '&amount=' + amount + '&type=' + type_choices[type];

      let final_url = url + riskRecommendationParams;
      const res = await Api.post(final_url);

      if (res.pfwresponse.result.funds) {
        this.setState({
          funds: res.pfwresponse.result.funds,
          amount_error: '',
          riskRecommendationParams: riskRecommendationParams
        })
      } else {
        toast(res.pfwresponse.result.message || res.pfwresponse.result.error)
        this.setState({
          funds: [],
          amount_error: res.pfwresponse.result.message || res.pfwresponse.result.error || 'Increase the Amount'
        })
      }
      this.setState({
        show_loader: false,
      });
    } catch (err) {
      this.setState({
        show_loader: false,
        funds: []
      });
      toast('Something went wrong');
    }
  }

  async componentDidMount() {
    if (window.sessionStorage.getItem('backData')) {
      let backData = JSON.parse(window.sessionStorage.getItem('backData'));
      window.sessionStorage.setItem('backData', '');
      this.setState({
        mfTab: backData.mfTab,
        yearTab: backData.yearTab,
        amount: backData.amount
      })
      this.getFunds(backData.yearTab, backData.amount, backData.mfTab);
    } else {
      this.getFunds(this.state.yearTab, this.state.amount, this.state.mfTab);
    }

    this.setState({
      amountModal: this.state.amount
    })
  }

  navigate = (pathname, params) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: params || {}
    });
  }

  handleChange = (field) => (event) => {

    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
  }

  handleClickOpen = () => {
    this.setState({
      oepnDialog: true,
      amountModal: this.state.amount,
      edit_amount: true
    })
  }

  handleClose() {
    this.setState({
      oepnDialog: false
    })
  }

  setNewAmount(amount) {
    this.setState({
      amount: this.state.amountModal,
      oepnDialog: false,
      amount_changed: true
    })
    this.onBlurAmount(true, this.state.amountModal);
  }

  handleChangeTabs = (type, value) => {
    this.setState({
      [type]: value
    });



    if (type === 'mfTab') {
      this.getFunds(this.state.yearTab, this.state.amount, value);
    } else {
      this.getFunds(value, this.state.amount, this.state.mfTab);
    }

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Risk Analyser',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Fund Recommendation',
        "risk_tolerance": this.state.indicator,
        "order_type": this.state.order_type,
        "period": this.state.period,
        "edit_amount": this.state.edit_amount,
        "amount_changed": this.state.amount_changed,
        "amount": this.state.amount
      }
    };
    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async (event, isin) => {

    this.sendEvents('next');
    let basepath = getBasePath();
    if (this.state.funds.length === 0) {

      this.setState({
        amount_error: 'No funds found, try changing Amount/Type/Term'
      })
      return;
    }


    // eslint-disable-next-line
    let nativeRedirectUrl = basepath +
      '/risk/recommendation' + getConfig().searchParams;

    let backData = {
      mfTab: this.state.mfTab,
      yearTab: this.state.yearTab,
      amount: this.state.amount
    }
    window.sessionStorage.setItem('backData', JSON.stringify(backData));

    let investment = {
      name: this.state.funds[0].itype,
      bondstock: '',
      // eslint-disable-next-line
      amount: parseInt(this.state.amount),
      term: 15,
      type: this.state.funds[0].itype,
      order_type: this.state.order_type,
      subtype: this.state.funds[0].subtype
    }

    let allocations = [];
    let isins = [];
    let fundsData = this.state.funds;
    for (var i in fundsData) {
      let obj = {
        "amount": fundsData[i].amount,
        "mfid": fundsData[i].isin,
        "mfname": fundsData[i].name,
        "amc_logo_big": fundsData[i].amc_logo_big
      };
      allocations.push(obj);
      isins.push(fundsData[i].isin)
    }
    investment.allocations = allocations;

    let webview_redirect_url = encodeURIComponent(
      basepath + '/risk/recommendation' + 
                                getConfig().searchParams
    );

    let openWebModule = getConfig().isWebOrSdk;
    if (isin) {

      if(openWebModule) {
        
        window.location.href =  getConfig().webAppUrl +  'risk/fund-info?isin=' + 
        isin + '&webview_redirect_url=' + webview_redirect_url;
      
      } else {
        nativeCallback({
          action: 'show_fund', message: {
            investment: investment,
            isins: isins,
            selected_isin: isin || '',
            funds: fundsData
          }
        });
      }
      
    } else {
      if(openWebModule) {

        window.location.href =  getConfig().webAppUrl +  'risk/recommendations?' + 
        this.state.riskRecommendationParams + '&webview_redirect_url=' + webview_redirect_url;
  
      } else {
        nativeCallback({
          action: 'invest', message: {
            investment: investment,
            isins: isins,
            funds: fundsData
          }
        });
      }
    }
    
  }

  showFundDetails(isin) {
    this.sendEvents('fund_clicked');
    this.handleClick('', isin);
  }

  getTabClassName(type, value) {
    if (value === this.state[type]) {
      return getConfig().configPrimaryColorClass;
    }
    return '';
  }

  amountValidation(type, amount) {

    this.setState({
      amount_error_validation: false
    })

    if (type === 0 && amount < 1000) {
      this.setState({
        amount_error: 'Minimum amount is 1000 for SIP',
        funds: [],
        amount_error_validation: true
      })
      return false;
    } else if (type === 0 && amount > 500000) {
      this.setState({
        amount_error: 'Maximum amount is 5 Lakh for SIP',
        funds: [],
        amount_error_validation: true
      })
      return false;
    } else if (type === 1 && amount < 5000) {
      this.setState({
        amount_error: 'Minimum amount is 5,000 for One Time',
        funds: [],
        amount_error_validation: true
      })
      return false;
    } else if (type === 1 && amount > 2000000) {
      this.setState({
        amount_error: 'Maximum amount is 20 Lakh for One Time',
        funds: [],
        amount_error_validation: true
      })
      return false;
    } else {
      return true;
    }
  }

  onBlurAmount(modal, amount) {

    if (!modal) {
      amount = this.state.amount;
    }

    this.getFunds(this.state.yearTab, amount, this.state.mfTab);
  }

  renderFunds(props, index) {
    return (
      <div key={index} className="fund-details" onClick={() => this.showFundDetails(props.isin)}>
        <div>
          <img style={{ border: '1px solid #ededed' }} alt="Risk Profile" src={props.amc_logo_big} width={75} />
        </div>
        <div style={{ marginLeft: 10 }}>
          <div className="fund-details-head">{props.name}</div>
          <div className="fund-details-below">{inrFormatDecimal(props.amount)}</div>
        </div>
      </div>
    )
  }

  renderAmountDialog() {
    return (
      <Dialog fullScreen={false} open={this.state.oepnDialog} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Amount</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            type="number"
            autoComplete="off"
            name="amountModal"
            value={this.state.amountModal}
            onChange={this.handleChange('amountModal')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default">
            Cancel
          </Button>
          <Button onClick={this.setNewAmount} color="default">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  openTermsAndCondition(type) {
    let url = '';
    if (type === 'terms') {
      url = getConfig().termsLink;
    } else {
      url = getConfig().schemeLink;
    }

    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Fund Recommendation"
        handleClick={this.handleClick}
        classOverRide="recommendation-containerWrapper"
        classOverRideContainer="recommendation-container"
        edit={this.props.edit}
        buttonTitle="Invest"
        isDisabled={!(this.state.funds)}
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '1px 10px 1px 10px' }}>
          <p style={{ color: '#4a4a4a', fontSize: 14 }}>Investment type</p>
          <div className="ui-tabs">
            <div className={`ui-tab ${this.getTabClassName('mfTab', 0)}`} value={0} onClick={() => this.handleChangeTabs('mfTab', 0)}>SIP</div>
            <div className={`ui-tab ${this.getTabClassName('mfTab', 1)}`} value={1} onClick={() => this.handleChangeTabs('mfTab', 1)}>One Time</div>
          </div>

          <p style={{ color: '#4a4a4a', fontSize: 14 }}>Time</p>
          <div className="ui-tabs">
            <div className={`ui-tab2 ${this.getTabClassName('yearTab', 0)}`} onClick={() => this.handleChangeTabs('yearTab', 0)}>0-6m</div>
            <div className={`ui-tab2 ${this.getTabClassName('yearTab', 1)}`} onClick={() => this.handleChangeTabs('yearTab', 1)}>6m-1y</div>
            <div className={`ui-tab2 ${this.getTabClassName('yearTab', 2)}`} onClick={() => this.handleChangeTabs('yearTab', 2)}>1y-3y</div>
            <div className={`ui-tab2 ${this.getTabClassName('yearTab', 3)}`} onClick={() => this.handleChangeTabs('yearTab', 3)}>3y-5y</div>
            <div className={`ui-tab2 ${this.getTabClassName('yearTab', 4)}`} onClick={() => this.handleChangeTabs('yearTab', 4)}>>5y</div>
          </div>
          <FormControl fullWidth style={{ marginTop: '20px' }} >
            {/* <div className="InputField" >
              <Input
                autoFocus={false}
                error={(this.state.amount_error) ? true : false}
                helperText={this.state.amount_error}
                type="number"
                width="40"
                label="Amount"
                style={{ color: '#4a4a4a', fontSize: 14 }}
                class=""
                id="yo"
                name="amount"
                value={this.state.amount}
                // onFocus={() => this.handleClickOpen()}
                onClick={() => this.handleClickOpen()}
                onChange={() => this.handleClickOpen()}
                // onChange={this.handleChange('amount')}
              // onKeyChange={this.onBlurAmount()}
              />
            </div> */}
            <div style={{cursor: 'pointer'}} onClick={() => this.handleClickOpen()} >
              <p style={{ color: '#4a4a4a', fontSize: 14 }}>Amount</p>
              <div style={{ color: getConfig().styles.primaryColor }}>{inrFormatDecimal(this.state.amount)}</div>
              <div style={{ border: '1px solid #f2f2f2', marginTop: 3 }}></div>
              <p style={{ color: 'red', fontSize: 12 }}>{this.state.amount_error}</p>
            </div>
          </FormControl>
          <p style={{ color: '#4a4a4a', fontSize: 14 }}>Recommended Funds  </p>
          <div className="funds-card">
            {this.state.funds && this.state.funds.map(this.renderFunds)}
          </div>
          <div style={{ display: '-webkit-box', marginBottom: 10, fontSize: 10 }}>
            <img style={{ verticalAlign: '-webkit-baseline-middle' }} width={15} src={check} alt="Invest" />
            <div style={{ width: '94%', marginLeft: 8, color: '#4a4a4a' }}>I agree that I have read and accepted the
              <span onClick={() => this.openTermsAndCondition('terms')} style={{ textDecoration: 'underline', margin: '0 2px 0px 2px', cursor: 'pointer' }}> terms & conditions
              </span> and understood the
              <span onClick={() => this.openTermsAndCondition('offer')} style={{ textDecoration: 'underline', margin: '0 2px 0px 2px', cursor: 'pointer' }}> scheme offer documents </span>
            </div>
          </div>
        </div>
        {this.renderAmountDialog()}
      </Container>
    );
  }
}

export default Recommendation;
