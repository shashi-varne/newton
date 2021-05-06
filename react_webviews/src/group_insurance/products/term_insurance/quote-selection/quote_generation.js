import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig, manageDialog } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import dropdown_arrow_fisdom from 'assets/fisdom/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';
import DropdownInPage from '../../../../common/ui/DropdownInPage';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import {
   numDifferentiation,
  validateNumber, inrFormatDecimal
} from '../../../../utils/validators';
import RadioOptions from '../../../../common/ui/RadioOptions';
import { FormControl } from 'material-ui/Form';
import '../../../../utils/native_listener';

import { payFreqOptionInsurance, ridersOptionInsurance, quotePoints, all_providers } from '../../../constants';

class QuoteGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      quoteData: window.sessionStorage.getItem('quoteData') ? JSON.parse(window.sessionStorage.getItem('quoteData')) : '',
      canRenderList: false,
      openPopUp: false,
      renderList: [],
      openDialogFilter: false,
      openPopUpQuote: false,
      paymentFreqRadio: 'Monthly',
      ridersRadio: 'no_riders',
      expendAddOnOpen: false,
      openPopUpInfo: false,
      time_spent: 0,
      infoClicks: {},
      addOnInfoClicks: {},
      filterAclick: {},
      filterAchanges: {}
    }

    this.renderQuotes = this.renderQuotes.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderPopUpQuote = this.renderPopUpQuote.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.renderQuotePoints = this.renderQuotePoints.bind(this);
  }

  componentWillMount() {

    let excluded_providers = window.sessionStorage.getItem('excluded_providers') ?
        JSON.parse(window.sessionStorage.getItem('excluded_providers')) : [];
      let required_providers = [];
      if (excluded_providers.length > 0) {
        for (var j in excluded_providers) {
          delete all_providers[excluded_providers[j]];
        }
      }
      for (var key in all_providers) {
        (required_providers).push(key);
      }

      window.sessionStorage.setItem('required_providers', JSON.stringify(required_providers));

      let intervalId = setInterval(this.countdown, 1000);

      this.setState({
        required_providers: required_providers,
        countdownInterval: intervalId,
      })

    if (!this.state.quoteData) {
      this.navigate('intro');
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  countdown = () => {
    this.setState({
      time_spent: this.state.time_spent + 1
    })
  };

  async getQuotes() {
    this.setState({
      show_loader: true
    })

    let insuranceData = {
      tobacco_choice: this.state.quoteData.tobacco_choice,
      cover: this.state.quoteData.cover_amount,
      term: this.state.quoteData.cover_period,
      payment_frequency: this.state.quoteData.payment_frequency || 'Monthly',
      death_benefit_option: 'Lump sum',
      dob: this.state.quoteData.dob,
      gender: this.state.quoteData.gender,
      annual_income: this.state.quoteData.annual_income,
      accident_benefit: this.state.quoteData.accident_benefit,
      ci_benefit: this.state.quoteData.ci_benefit,
      // ci_amount: this.state.quoteData.annual_income,
      annual_quote_required: true,
      required_providers: this.state.required_providers,
    };
    try {
      const res = await Api.post('/api/insurance/quote', insuranceData);
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.quotes) {
        let result = res.pfwresponse.result.quotes;
        this.setState({
          quotes: result
        });
      } else {
        this.setState({
          quotes: []
        });
        toast(res.pfwresponse.result.error);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  componentDidMount() {
    
    if (!this.state.quoteData) {
      return
    }
    let inputToRender_accident_benefit = this.getInputToRenderADB();
    ridersOptionInsurance[1].inputToRender = inputToRender_accident_benefit;
    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom,
    })
    this.getQuotes();
  }


  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  getInputToRenderADB() {
    let inputToRender = {
      error: false,
      type: "text",
      width: "40",
      label: "Accidental death benefits",
      class: "Income",
      id: "income",
      name: "accident_benefit",
      onChange: this.handleChange('accident_benefit'),
      inputKeyName: 'accident_benefit'
    }
    var min = 5000000;
    var max =  this.state.quoteData.cover_amount > 30000000 ?  30000000 : this.state.quoteData.cover_amount;
    let cover_amount_min_max = 'Min ' + inrFormatDecimal(min) + ' - Max ' + inrFormatDecimal(max);
    inputToRender.cover_amount_min_max = cover_amount_min_max;
    inputToRender.helperText = cover_amount_min_max;
    inputToRender.min = min;
    inputToRender.max = max;
    this.setState({
      inputToRender_accident_benefit: inputToRender
    })

    return inputToRender;
  }

  quotesAfterFilter(type, index) {
  
    let filterAclick = this.state.filterAclick || {};
    let quoteData = this.state.quoteData;
    
    if (type === 'cover-amount' && quoteData.coverAmountList[index].name !== 'Other') {
      quoteData.cover_amount = quoteData.coverAmountList[index].value;
     
    } else if (type === 'cover-period') {
      quoteData.cover_period = quoteData.coverPeriodList[index];
    } else if (type === 'smoke') {
      quoteData.tobacco_choice = quoteData.smokeList[index] === 'Yes' ? 'Y' : 'N';
    }


    if(type === 'cover-amount' && this.state.ridersRadio === 'accident_benefit') {
      this.getInputToRenderADB();
      toast('Please select accidental amount again');
      this.setState({
        ridersRadio: 'no_riders'
      })
    }
    
    filterAclick[type] = true;
    this.setState({
      filterAclick:filterAclick,
      quoteData: quoteData
    });
    window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.getQuotes();
  }

  handleClose = () => {

    let filterAchanges = this.state.filterAchanges || {};
    if (this.state.openPopUp) {
      filterAchanges[this.state.filterType] = true;
    }
    
    if(this.state.openPopUpQuote) {
      this.sendEvents('back', 'quote');
    }
    manageDialog('general-dialog', 'flex', 'enableScroll');
    this.setState({
      openPopUp: false,
      openPopUpQuote: false,
      openDialogFilter: false,
      openPopUpInfo: false,
      filterAchanges:filterAchanges,
    });
  }

  handleCloseAction = () => {
    if(this.state.filterType === 'cover-amount'
     && this.state.quoteData.coverAmountList[this.state.selectedIndex].name === 'Other'
     && this.state.quoteData.inputToRender_cover_amount.error) {
      return;
    }
    this.setState({
      openPopUp: false
    });
    this.quotesAfterFilter(this.state.filterType, this.state.selectedIndex)
  }

  submitQuote = async (id) => {
    this.setState({
      openPopUpQuote: false,
      show_loader: true
    })

    let insuranceData = {
      quote_id: id
    };

    let show_quotes = window.sessionStorage.getItem('show_quotes');
    if (show_quotes) {
      insuranceData.create = 'Y';
      window.sessionStorage.setItem('show_quotes', '');
    }

    try {
      const res = await Api.post('/api/insurance/quote/select', insuranceData)
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.application) {
        window.sessionStorage.setItem('cameFromHome', '');
        let url = res.pfwresponse.result.profile_start;
        let search = url.split('?')[1];
        let searchParamsMustAppend = getConfig().searchParamsMustAppend.split('?')[1];
        search +=  '&' + searchParamsMustAppend;
        this.navigate("journey", search);
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleCloseQuotes = async () => {
    this.sendEvents('next', 'quote');
    this.setState({
      openPopUpQuote: false,
      show_loader: true
    })

    let quoteSelected = this.state.quoteSelected;
      let id = (this.state.payment_frequency).toLowerCase() === 'annually' ? quoteSelected.annual_quote_id :
       quoteSelected.id;

    this.submitQuote(id);
  }

  renderPopUpQuote = () => {
    if (this.state.openPopUpQuote) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="general-dialog"
          open={this.state.openPopUpQuote}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="quote-confirmation-dialog-head">
              <img className="quote-confirmation-dialog-head1" src={this.state.quoteSelected.quote_provider_logo} alt="Insurance" />
              <div className="quote-confirmation-dialog-head2">{this.state.quoteSelected.insurance_title}</div>
            </div>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Cover amount:</div>
                  <div className="confirm-quote-popup-content1b">{numDifferentiation(this.state.quoteSelected.cover_amount)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Cover period:</div>
                  <div className="confirm-quote-popup-content1b">{this.state.quoteSelected.term}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Premium frequency:</div>
                  <div className="confirm-quote-popup-content1b">{this.state.payment_frequency}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Premium details:</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1c">Base premium</div>
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.popup_premium.base_premium)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1c">Riders base premium</div>
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.popup_premium.riders_base_premium)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1c">GST & taxes</div>
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.popup_premium.total_tax)}</div>
                </div>
                <div className="confirm-quote-popup-content1 confirm-quote-popup-content1d">
                  <div className="confirm-quote-popup-content1e">Total payable</div>
                  <div className="confirm-quote-popup-content1b">{inrFormatDecimal(this.state.popup_premium.premium)}</div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleCloseQuotes}
              autoFocus>OK
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  calculateAge = (birthday) => {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();

    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  openPopUpInfo(index, provider) {
    let infoClicks = this.state.infoClicks || {};
    infoClicks[provider] = true;
    this.setState({
      openPopUpInfo: true,
      selectedIndexInfo: index,
      selectedQuoteInfo: this.state.quotes[index],
      infoClicks:infoClicks
    })
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  renderPopUpInfo() {
    if (this.state.openPopUpInfo) {
      return (
        <Dialog
        fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6 }}
          id="general-dialog"
          open={this.state.openPopUpInfo}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Plan Benefits
             </div>
              {this.state.selectedQuoteInfo.quote_provider !== 'Maxlife' &&
                <div className="annual-inc-popup-content">
                  This plan will cover your death 
                  (till  {this.calculateAge(this.state.selectedQuoteInfo.dob.replace(/\\-/g, '/').split('/').reverse().join('/')) + 
                this.state.selectedQuoteInfo.term} years of age) in all cases
                  except suicide for the first year. Plan benefit includes a payout of
               Rs {numDifferentiation(this.state.selectedQuoteInfo.cover_amount)} to your nominee. Additionally, full payout will happen in case
                  of terminal illness and your entire premium will be waived of incase of
                 Total Permanent Disability.
              </div>}
              {this.state.selectedQuoteInfo.quote_provider === 'Maxlife' &&
                <div className="annual-inc-popup-content">
                  This plan will cover your death (till 
                   {this.calculateAge(this.state.selectedQuoteInfo.dob.replace(/\\-/g, '/').split('/').reverse().join('/')) + 
                this.state.selectedQuoteInfo.term} years of age) in all cases except suicide
                   for the first year. Plan benefit includes a payout of
 Rs {numDifferentiation(this.state.selectedQuoteInfo.cover_amount)} to your nominee.
                 
                </div>}
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClose}
              autoFocus>Got it!
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }


  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="general-dialog"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          <DialogTitle id="form-dialog-title">
          <div className="quote-filter-dialog-head">
            {this.state.filterHead}
          </div>
          </DialogTitle>
          <DialogContent>
            <div style={{marginTop:-60}} className="annual-inc-dialog" id="alert-dialog-description">
              {this.renderList()}
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleCloseAction}
              autoFocus>OK
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  getSelectedIndex(type) {
    if (type === 'cover-amount') {
      return this.state.quoteData.selectedIndexCoverAmount;
    } else if (type === 'cover-period') {
      return this.state.quoteData.selectedIndexCoverPeriod;
    } else if (type === 'smoke') {
      return this.state.quoteData.selectedIndexSmoke;
    } else {
      return 0;
    }
  }

  setSelectedIndex(type, index) {
    let quoteData = this.state.quoteData;
    if (type === 'cover-amount') {
      quoteData.selectedIndexCoverAmount = index;
    } else if (type === 'cover-period') {
      quoteData.selectedIndexCoverPeriod = index;
    } else if (type === 'smoke') {
      quoteData.selectedIndexSmoke = index;
    } 

    this.setState({
      quoteData:quoteData
    })
  }

  getRecommendedIndex(type) {
    if (type === 'cover-amount') {
      return this.state.quoteData.recommendedIndexCoverAmount;
    } else if (type === 'cover-period') {
      return this.state.quoteData.recommendedIndexCoverPeriod;
    } else {
      return '';
    }
  }

  renderList() {
    if (this.state.canRenderList) {
      return (
        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.renderList}
            value={this.getSelectedIndex(this.state.filterType)}
            onChange={this.setValue}
            recommendedIndex={this.getRecommendedIndex(this.state.filterType)}
            dataType={this.state.filterType === 'cover-amount' ? 'AOB' : ''}
            keyToShow="name"
            inputKeyName="Other"
            inputToRender={this.state.filterType === 'cover-amount' ? this.state.inputToRender_cover_amount : {}} />
        </div>
      )
    }
    return null;
  }

  setValue(index) {

    this.setSelectedIndex(this.state.filterType, index);
    this.setState({
      selectedIndex: index
    })
  }

 

  selectQuote(quote, payment_frequency, index) {
    let popup_premium = quote.quote_json;
    if (payment_frequency === 'Annually') {
      popup_premium = quote.annual_quote_json;
    }
    this.setState({
      quoteSelected: quote,
      payment_frequency: payment_frequency,
      selectedIndexQuote: index,
      popup_premium: popup_premium,
      openPopUpQuote: true
    })
    this.sendEvents('next' , '', quote, payment_frequency);
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  renderQuotePoints(props, index, type) {
    return (
      <div key={index}>
        <div className="quote-tiles2">
         {index === 0 && <span className="quote-tiles2a">{index + 1}. Lump sum payment of  {numDifferentiation(this.state.quoteData.cover_amount)} to your nominee</span>}
         {(index !== 0) && <span className="quote-tiles2a">{index + 1}. {props}</span>}
        </div>
        {props.points && props.points.map((row, i) => (
          <div key={i} className="quote-tiles2">
            <span className="quote-tiles2b">- {row}</span>
          </div>
        ))}
      </div>
    )
  }

  renderAddOnPoints(props, index) {
    return (
      <div key={index}>
        <div className="quote-tiles2">
         <span className="quote-tiles2a">{index + 1}. {props}</span>
        </div>
        {props.points && props.points.map((row, i) => (
          <div key={i} className="quote-tiles2">
            <span className="quote-tiles2b">- {row}</span>
          </div>
        ))}
      </div>
    )
  }

  expendAddOn(index, provider) {
    let addOnInfoClicks = this.state.addOnInfoClicks || {};
    addOnInfoClicks[provider] = true;

    let quotes = this.state.quotes;
    quotes[index].expendAddOnOpen = !quotes[index].expendAddOnOpen;
    this.setState({
      quotes: quotes,
      addOnInfoClicks:addOnInfoClicks
    })
  }

  renderQuotes(props, index) {
    return (
      <div key={index} className="quote-tiles" style={{ marginTop: index !== 0 ? 18 : 50 }}>
        <div className="quote-tiles1">
          <div className="quote-tiles1a">
            <img style={{ width: 90 }} src={props.quote_provider_logo} alt="Insurance" />
          </div>
          <div className="quote-tiles1b">{props.insurance_title}</div>
        </div>

        <div className="quote-tiles4" style={{padding: '0 11px 10px 17px',
      margin: '0 0 10px 0px',borderBottom: '1px solid #efefef'}}>
          <div className="quote-tiles4a">
              Claim Settled
          </div>
          <div className="quote-tiles4a" style={{color:getConfig().styles.primaryColor,fontWeight:500}}>
          98%
          </div>
        </div>
        <div className="quote-tiles4">
          <div className="quote-tiles4a">
            Basic benefits
            </div>
          <div className="quote-tiles4b"
            style={{ color: getConfig().styles.primaryColor }}
            onClick={() => this.openPopUpInfo(index, props.quote_provider)}>INFO</div>
        </div>

        {/* basic benefits */}
        {props.quote_provider &&
          quotePoints[props.quote_provider].basic_benefits.map(this.renderQuotePoints)}

        {/* add on benefits */}
        <div className="quote-addon-tiles11">
          <div className="quote-addon-tiles1" onClick={() => this.expendAddOn(index,  props.quote_provider)}>
            <div className="quote-addon-tiles1a">
              Add on benefits
          </div>
            <div className="quote-addon-tiles1b">
              <img className="quote-addon-tiles1c" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
          {props.expendAddOnOpen &&
            <div style={{ marginTop: 10 }}>
              {props.quote_provider && quotePoints[props.quote_provider].add_on_benefits.map(this.renderAddOnPoints)
              }
            </div>
          }
        </div>

        <div className="quote-tiles3">
          <div className="quote-tiles3a" onClick={() => this.selectQuote(props, props.payment_frequency, index)}>
            <div className="quote-tiles3aa">
              <span className="bold-premium"> {inrFormatDecimal(props.quote_json.premium)}</span>
              <span style={{ textTransform: 'lowercase', marginLeft: 4 }}>{props.payment_frequency}</span>
            </div>
          </div>
          <div className="quote-tiles3b" onClick={() => this.selectQuote(props, 'Annually', index)}>
            <div className="quote-tiles3ba">  
              <span className="bold-premium">{inrFormatDecimal(props.annual_quote_json.premium)}</span>
              <span style={{ marginLeft: 4 }}>annually</span>
            </div>
            <div className="quote-tiles3bb">
              Save {inrFormatDecimal(props.annual_quote_json.total_savings)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleChange = name => event => {
    let value = event.target.value.replace(/,/g, "")*1;
    let inputToRender = this.state['inputToRender_' + name];
    
    let error = "";
    if (!value) {
      error = 'Cover Amount cannot be empty';
    } else if ((!validateNumber(value) || !value)) {
      error = 'Invalid Cover Amount';
    } else if (value < inputToRender.min) {
      error = 'Minimum Cover Amount is ' + inrFormatDecimal(inputToRender.min);
    } else if (value > inputToRender.max) {
      error = 'Maximum Cover Amount is ' + inrFormatDecimal(inputToRender.max);
    } else if ((!validateNumber(value) || !value)) {
      error = 'Invalid Cover Amount';
    } 

    if(error) {
      inputToRender.helperText = error;
      inputToRender.error = true;
      inputToRender.value = value;
      this.setState({
        [name +'_error'] : error,
        ['inputToRender_' + name]: inputToRender
      })
    }else  {
      inputToRender.helperText = inputToRender.cover_amount_min_max;
      inputToRender.error = false;
      inputToRender.value = value;
      this.setState({
        [name]: value,
        [name + '_error']: '',
        ['inputToRender_' + name]: inputToRender
      });
    }

    if (!error && value && name === 'cover_amount') {
      let quoteData = this.state.quoteData;
      quoteData.cover_amount = value;
      this.setState({
        quoteData: quoteData
      })
    }
  
  };

  filterHandler(type) {

    if (type === 'cover-amount') {
      let inputToRender = this.state.quoteData.inputToRender_cover_amount;
      inputToRender.onChange = this.handleChange('cover_amount');
      inputToRender.value = this.state.quoteData.cover_amount;
      inputToRender.error = false;
      this.setState({
        renderList: this.state.quoteData.coverAmountList,
        filterHead: 'Cover Amount',
        inputToRender_cover_amount: inputToRender,
        selectedIndex: this.state.quoteData.selectedIndexCoverAmount
      });
    } else if (type === 'cover-period') {
      this.setState({
        renderList: this.state.quoteData.coverPeriodList,
        filterHead: 'Cover Period',
        selectedIndex: this.state.quoteData.selectedIndexCoverPeriod
      });
    } else if (type === 'smoke') {
      this.setState({
        renderList: this.state.quoteData.smokeList,
        filterHead: 'Smoke',
        selectedIndex: this.state.quoteData.selectedIndexSmoke
      });
    }

    this.setState({
      canRenderList: true,
      openPopUp: true,
      filterType: type
    });
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  openFilter() {
    this.setState({
      openDialogFilter: true
    });
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  handleFilter = () => {
    let quoteData = this.state.quoteData;
    quoteData.payment_frequency = this.state.paymentFreqRadio;
    let ci_benefit, accident_benefit = '';
    if(this.state.ridersRadio === 'accident_benefit') {
      if(this.state.inputToRender_accident_benefit.error 
        || !this.state.inputToRender_accident_benefit.value) {
        return;
      }
      accident_benefit = this.state.inputToRender_accident_benefit.value;
    }else if(this.state.ridersRadio === 'ci_benefit') {
      ci_benefit = 'Y';
    }

    quoteData.ci_benefit = ci_benefit;
    quoteData.accident_benefit = accident_benefit;

    this.setState({
      openDialogFilter: false,
      quoteData: quoteData,
      premium_payment_frequency_clicked: true
    });
    this.getQuotes();
  }

  handleRadio = name => event => {
    this.setState({
      [name]: event.target.value,
      [name + '_error']: ''
    });
  };

  renderFilter() {
    if (this.state.openDialogFilter) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="general-dialog"
          open={this.state.openDialogFilter}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Additional Options
             </div>
              <div className="annual-inc-popup-content">
                <FormControl fullWidth>
                  <div style={{ fontSize: 15, color: '#4a4a4a' }}>
                    Premium Payment Frequency
                </div>
                  <div className="InputField">
                    <RadioOptions
                      icon_type="blue_icon"
                      error={(this.state.paymentFreqRadio_error) ? true : false}
                      helperText={this.state.paymentFreqRadio_error}
                      width="40"
                      // label="Premium Payment Frequency"
                      class="MaritalStatus"
                      options={payFreqOptionInsurance}
                      id="pay-freq"
                      value={this.state.paymentFreqRadio}
                      onChange={this.handleRadio('paymentFreqRadio')} />
                  </div>
                </FormControl>

                <FormControl fullWidth>
                  <div style={{ fontSize: 15, color: '#4a4a4a' }}>
                    Riders
                </div>
                  <div className="InputField">
                    <RadioOptions
                     icon_type="blue_icon"
                      error={(this.state.ridersRadio_error) ? true : false}
                      helperText={this.state.ridersRadio_error}
                      width="40"
                      // label="Premium Payment Frequency"
                      class="MaritalStatus"
                      options={ridersOptionInsurance}
                      id="pay-freq"
                      value={this.state.ridersRadio}
                      onChange={this.handleRadio('ridersRadio')} />
                  </div>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleFilter}
              autoFocus>Apply
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  sendEvents(user_action, screen_name, quote, payment_frequency) {

    let eventObj = {};
    if (screen_name === 'quote') {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'selected_quote_details',
          'from': 'quotes'
        }
      };
    } else {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'quote_page',
          'provider':   quote? quote.quote_provider: this.state.quoteSelected && this.state.quoteSelected.quote_provider ? this.state.quoteSelected.quote_provider: '',
          'premium':payment_frequency || this.state.payment_frequency,
          'time_spent': this.state.time_spent,
          'cover_amount_click': this.state.filterAclick && this.state.filterAclick['cover-amount'] ? 'yes': 'no',
          'cover_amount_change': this.state.filterAchanges && this.state.filterAchanges['cover-amount'] ? 'yes': 'no',
          'cover_period_click': this.state.filterAclick && this.state.filterAclick['cover-period'] ? 'yes': 'no',
          'cover_period_change': this.state.filterAchanges && this.state.filterAchanges['cover-period'] ? 'yes': 'no',
          'smoke_click': this.state.filterAclick && this.state.filterAclick['smoke'] ? 'yes': 'no',
          'smoke_change': this.state.filterAchanges && this.state.filterAchanges['smoke'] ? 'yes': 'no',
          'premium_payment_frequency_clicked': this.state.premium_payment_frequency_clicked ? 'yes':'no',
          'info_hdfc': this.state.infoClicks['HDFC'] ? 'yes':'no',
          'info_ipru': this.state.infoClicks['IPRU'] ? 'yes':'no',
          'info_maxlife': this.state.infoClicks['Maxlife'] ? 'yes':'no',
          'addOnInfo_hdfc': this.state.addOnInfoClicks['HDFC'] ? 'yes':'no',
          'addOnInfo_ipru': this.state.addOnInfoClicks['IPRU'] ? 'yes':'no',
          'addOnInfo_maxlife': this.state.addOnInfoClicks['Maxlife'] ? 'yes':'no'
        }
      };

    }

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
      events={this.sendEvents('just_set_events')}
        noFooter={true}
        showLoader={this.state.show_loader}
        title="Select the Insurance"
        smallTitle="Premiums are inclusive of GST"
        buttonTitle="Save & Continue"
        fullWidthButton={true}
        onlyButton={true}
        filterPage={true}
        handleFilter={this.openFilter}
        closePopup={this.handleClose}
      >

        <div className="quote-top-tiles">
        <div className="quote-top-tiles-container">
          <div className="quote-top-tiles1" onClick={() => this.filterHandler('cover-amount')}>
            <div className="quote-top-tiles1a" >
              <div className="quote-top-tiles1b">Cover</div>
              <div className="quote-top-tiles1c">{numDifferentiation(this.state.quoteData.cover_amount)}</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div style={{borderLeft: ' 1px solid #f2eded', borderRight: ' 1px solid #f2eded'}} className="quote-top-tiles1" onClick={() => this.filterHandler('cover-period')}>
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Cover upto</div>
              <div className="quote-top-tiles1c">{this.state.quoteData.cover_period} years</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div className="quote-top-tiles1" onClick={() => this.filterHandler('smoke')}>
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Smoke</div>
              <div className="quote-top-tiles1c">
                {this.state.quoteData.tobacco_choice === 'Y' ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="quote-top-tiles1d">
              <img className="quote-top-tiles1e" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
          </div>
        </div>
        {this.state.quotes && this.state.quotes.map(this.renderQuotes)}

        {this.renderPopUp()}
        {this.renderPopUpQuote()}
        {this.renderFilter()}
        {this.renderPopUpInfo()}
      </Container>
    );
  }
}

export default QuoteGeneration;
