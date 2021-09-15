import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import DotDotLoader from '../../../../common/ui/DotDotLoader';
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
  DialogTitle,
} from 'material-ui/Dialog';
import {
  numDifferentiation,
  validateNumber, inrFormatDecimal, getRecommendedIndex
} from '../../../../utils/validators';
import { add_on_benefits_points } from '../../../constants';

class AddOnBenefits extends Component {

  constructor(props) {
    var quoteSelected = JSON.parse(window.sessionStorage.getItem('quoteSelected')) || {};
    let required_providers = window.sessionStorage.getItem('required_providers') ?
      JSON.parse(window.sessionStorage.getItem('required_providers')) : [];
    let insuranceData = {
      tobacco_choice: quoteSelected.tobacco_choice,
      cover: quoteSelected.cover_amount,
      term: quoteSelected.term,
      payment_frequency: quoteSelected.payment_frequency_selected === 'Annually' ? 'Yearly' : quoteSelected.payment_frequency,
      death_benefit_option: '',
      dob: quoteSelected.dob,
      gender: quoteSelected.gender,
      annual_income: quoteSelected.annual_income,
      accident_benefit: '',
      ci_benefit: '',
      ci_amount: '',
      annual_quote_required: true,
      required_providers: required_providers,
      generate_illustration: true
    };
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      insurance_app_id: (quoteSelected.payment_frequency_selected).toLowerCase() === 'annually' ? quoteSelected.annual_quote_id :
        quoteSelected.id,
      quoteSelected: quoteSelected,
      openPopUpCoverAmount: false,
      required_providers: required_providers,
      buttonTitle: 'Skip & Continue',
      totalAddedAmount: 0,
      totalAddedBenefits: 0,
      totalPremium: (quoteSelected.payment_frequency_selected).toLowerCase() === 'annually' ? Number(quoteSelected.annual_quote_json.base_premium_total) :
        Number(quoteSelected.quote_json.base_premium_total),
      basePremium: (quoteSelected.payment_frequency_selected).toLowerCase() === 'annually' ? Number(quoteSelected.annual_quote_json.base_premium_total) :
        Number(quoteSelected.quote_json.base_premium_total),
      openPopUpInfo: false,
      openPopUpQuote: false,
      payment_frequency: quoteSelected.payment_frequency_selected,
      insuranceData: insuranceData,
      infoClicks: {}
    }
    this.renderList = this.renderList.bind(this);
    this.setValue = this.setValue.bind(this);
    this.renderListCoverAmount = this.renderListCoverAmount.bind(this);
    this.handleCloseAction = this.handleCloseAction.bind(this);
    this.handleCloseQuotes = this.handleCloseQuotes.bind(this);
  }

  getInputToRender(data) {
    let inputToRender = {
      error: false,
      type: "text",
      width: "40",
      label: "Cover Amount",
      class: "Income",
      id: "income",
      name: "cover_amount",
      onChange: this.handleChange('cover_amount')
    }

    let cover_amount_min_max = 'Min ' + inrFormatDecimal(data.min) + ' - Max ' + inrFormatDecimal(data.max);
    inputToRender.cover_amount_min_max = cover_amount_min_max;
    inputToRender.helperText = cover_amount_min_max;
    inputToRender.value = data.recommended;
    inputToRender.min = data.min;
    inputToRender.max = data.max;
    return inputToRender;
  }

  async getRiders() {
    try {

      let insuranceData = this.state.insuranceData;
      insuranceData.required_providers = [this.state.quoteSelected.quote_provider];


      this.setState({
        insuranceData: insuranceData
      });

      insuranceData.set_defaults = true;
      insuranceData.insurance_all_web = true;

      const res = await Api.post('/api/insurance/quote', insuranceData);
      let result = res.pfwresponse.result.quotes[0];
      let riders_info = result.riders_info;

      for (var i = 0; i < riders_info.length; i++) {

        if (this.state.quoteSelected.quote_provider !== 'Maxlife' && riders_info[i].cover_amount) {
          (riders_info[i].cover_amount).push('Other');
        }

        if (this.state.quoteSelected.quote_provider === 'Maxlife' &&
          riders_info[i].rider_type === 'ci_benefit') {
          this.setState({
            ci_benefit_index: i
          })
        }

        riders_info[i].inputToRender = this.getInputToRender(riders_info[i]);
        let recommendedIndex = getRecommendedIndex(riders_info[i].cover_amount, riders_info[i].recommended);
        riders_info[i].recommendedIndex = recommendedIndex;
        riders_info[i].selectedIndex = recommendedIndex;
      }
      this.setState({
        show_loader: false,
        riders_info: riders_info,
      });
    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  componentDidMount() {

    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom
    })
    this.getRiders()
  }


  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  getInsuranceData() {
    let accident_benefit, ci_benefit = '', ci_amount;
    let riders_info = this.state.riders_info;
    for (var i = 0; i < this.state.riders_info.length; i++) {
      if (riders_info[i].isAdded) {
        if (riders_info[i].rider_type === 'accident_benefit') {
          accident_benefit = riders_info[i].value || riders_info[i].recommended;
        } else if (riders_info[i].rider_type === 'ci_amount') {
          ci_amount = riders_info[i].value || riders_info[i].recommended;
        } else if (riders_info[i].rider_type === 'ci_benefit') {
          ci_benefit = 'Y';
        }
      }
    }

    let insuranceData = this.state.insuranceData;
    insuranceData.generate_illustration = false;
    insuranceData.ci_benefit = ci_benefit || '';
    insuranceData.ci_amount = ci_amount || '';
    insuranceData.accident_benefit = accident_benefit || '';
    insuranceData.set_defaults = false;
    return insuranceData;
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })
    this.sendEvents('next');

    let insuranceData = this.getInsuranceData();
    insuranceData.generate_illustration = false;
    insuranceData.set_defaults = false;
    insuranceData.insurance_all_web = true;

    try {

      const res = await Api.post('/api/insurance/quote', insuranceData)
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.quotes) {
        let quote = res.pfwresponse.result.quotes[0];
        this.setState({
          openPopUpQuote: true,
          final_id: quote.id,
          final_quote: quote
        })
        manageDialog('general-dialog', 'flex', 'disableScroll');
      } else {
        toast(res.pfwresponse.result.error);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
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

    insuranceData.insurance_all_web = true;

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

  setValue(index) {
    let selectedRiderList = this.state.selectedRiderList;
    selectedRiderList.selectedIndex = index;
    selectedRiderList.value = this.state.selectedRiderList.cover_amount[index];


    let riders_info = this.state.riders_info;
    riders_info[this.state.selectedIndex] = selectedRiderList;
    this.setState({
      selectedRiderList: selectedRiderList,
      riders_info: riders_info
    })
  }

  changeAmount(index) {
    this.setState({
      selectedRiderList: this.state.riders_info[index],
      selectedIndex: index,
      openPopUpCoverAmount: true
    })
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  renderListCoverAmount() {
    if (this.state.openPopUpCoverAmount) {
      return (
        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.selectedRiderList.cover_amount}
            value={this.state.selectedRiderList.selectedIndex}
            onChange={this.setValue}
            recommendedIndex={this.state.selectedRiderList.recommendedIndex}
            dataType=""
            inputKeyName="Other"
            inputToRender={this.state.selectedRiderList.inputToRender} />
        </div>
      )
    }
    return null;
  }

  handleChange = name => event => {
    let value = event.target.value.replace(/,/g, "");
    let inputToRender = this.state.selectedRiderList.inputToRender;
    let error = '';
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
    } else {


      let selectedRiderList = this.state.selectedRiderList;
      selectedRiderList.inputToRender.helperText = this.state.selectedRiderList.inputToRender.cover_amount_min_max;
      selectedRiderList.inputToRender.error = false;
      selectedRiderList.inputToRender.value = value;
      this.setState({
        [name]: value,
        [name + '_error']: '',
        selectedRiderList: selectedRiderList
      });
    }

    if (error) {
      let selectedRiderList = this.state.selectedRiderList;
      selectedRiderList.inputToRender.helperText = error;
      selectedRiderList.inputToRender.error = true;
      selectedRiderList.inputToRender.value = value;
      this.setState({
        cover_amount_error: error,
        selectedRiderList: selectedRiderList
      });
    }
  };

  async handleCloseAction(fromAdded, index) {
    var riders_info_current = this.state.riders_info;
    let selectedRiderList = this.state.selectedRiderList;
    let insuranceData = this.state.insuranceData;
    let which_keys_to_update = [];
    insuranceData.generate_illustration = true;
    if (fromAdded) {
      riders_info_current[this.state.ci_benefit_index].showDotDot = true;
    } else {

      if (selectedRiderList.isAdded) {
        which_keys_to_update.push(this.state.ci_benefit_index);
        riders_info_current[this.state.ci_benefit_index].showDotDot = true;
        insuranceData.generate_illustration = false;
      }
      riders_info_current[this.state.selectedIndex].showDotDot = true;
    }

    this.setState({
      riders_info: riders_info_current,
      openPopUpCoverAmount: false,
      showDotDotMain: true
    })

    try {

      if (fromAdded) {
        if (fromAdded === 'add') {
          which_keys_to_update.push(index);
        }
        which_keys_to_update.push(this.state.ci_benefit_index);
      } else {
        let value = selectedRiderList.value || selectedRiderList.cover_amount[selectedRiderList.selectedIndex];
        let key = riders_info_current[this.state.selectedIndex].rider_type;
        if (selectedRiderList.cover_amount[selectedRiderList.selectedIndex] === 'Other') {
          value = selectedRiderList.inputToRender.value;
        }
        insuranceData[key] = value;
        which_keys_to_update.push(this.state.selectedIndex);
      }

      if (this.state.quoteSelected.quote_provider === 'Maxlife') {

        if (fromAdded) {
          insuranceData.generate_illustration = false;
          insuranceData.ci_amount = '';
          insuranceData.accident_benefit = '';
          let accident_benefit, ci_benefit = 'Y', ci_amount;
          let riders_info = this.state.riders_info;

          for (var i = 0; i < this.state.riders_info.length; i++) {
            if (riders_info[i].isAdded) {
              if (riders_info[i].rider_type === 'accident_benefit') {
                accident_benefit = riders_info[i].value || riders_info[i].recommended;
              } else if (riders_info[i].rider_type === 'ci_amount') {
                ci_amount = riders_info[i].value || riders_info[i].recommended;
              } else if (riders_info[i].rider_type === 'ci_benefit') {
                ci_benefit = 'Y';
              }
            }
          }

          if (ci_amount) {
            insuranceData.ci_amount = ci_amount;
          }
          if (accident_benefit) {
            insuranceData.accident_benefit = accident_benefit;
          }

          insuranceData.ci_benefit = ci_benefit;
        }
      }

      this.setState({
        insuranceData: insuranceData
      })

      insuranceData.set_defaults = false;
      insuranceData.insurance_all_web = true;
      const res = await Api.post('/api/insurance/quote', insuranceData);

      if (res.pfwresponse.status_code === 200) {
        if (!fromAdded) {
          riders_info_current[this.state.selectedIndex].showDotDot = false;
        }
        riders_info_current[this.state.ci_benefit_index].showDotDot = false;

        this.setState({
          riders_info: riders_info_current
        });
        let result = res.pfwresponse.result.quotes[0];
        let riders_info = result.riders_info;
        let riders_info_currnet = this.state.riders_info;
        for (let i = 0; i < riders_info.length; i++) {
          if (which_keys_to_update.indexOf(i) !== -1) {
            riders_info_currnet[i].pay_amount = riders_info[i].pay_amount;
          }
        }
        this.setState({
          riders_info: riders_info_currnet,
          showDotDotMain: false
        });

        if (fromAdded && riders_info_currnet[this.state.ci_benefit_index].isAdded) {
          this.addExtraPremium(this.state.ci_benefit_index, riders_info_currnet[this.state.ci_benefit_index], 'remove', true);
          this.addExtraPremium(this.state.ci_benefit_index, riders_info_currnet[this.state.ci_benefit_index], 'add', true);
        }

        if (this.state.selectedIndex >= 0 && riders_info_current[this.state.selectedIndex].isAdded) {
          this.addExtraPremium(this.state.selectedIndex, riders_info_currnet[this.state.selectedIndex], 'remove', true);
          this.addExtraPremium(this.state.selectedIndex, riders_info_currnet[this.state.selectedIndex], 'add', true);
        }

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }


    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
        showDotDotMain: false
      });
      toast('Something went wrong');
    }
  }

  renderPopUpCoverAmount() {
    if (this.state.openPopUpCoverAmount) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="general-dialog"
          open={this.state.openPopUpCoverAmount}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="form-dialog-title">
            <div className="quote-filter-dialog-head">
              Cover Amount
          </div>
          </DialogTitle>
          <DialogContent>
            <div style={{ marginTop: -60 }} className="annual-inc-dialog" id="alert-dialog-description">
              {this.renderListCoverAmount()}
            </div>

          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={() => this.handleCloseAction()}
              autoFocus>OK
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  handleClose = () => {
    if (this.state.openPopUpQuote) {
      this.sendEvents('back', 'quote');
    }
    manageDialog('general-dialog', 'flex', 'enableScroll');
    this.setState({
      openPopUpCoverAmount: false,
      openPopUpInfo: false,
      openPopUpQuote: false
    });
  }

  openPopUpInfo(rider_type) {
    let infoClicks = this.state.infoClicks || {};
    infoClicks[rider_type] = true;
    this.setState({
      openPopUpInfo: true,
      popupRider: rider_type,
      infoClicks: infoClicks
    })
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  renderPopUpInfo() {
    if (this.state.openPopUpInfo) {
      return (
        <Dialog
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
                {add_on_benefits_points[this.state.popupRider].title}
              </div>
              <div className="annual-inc-popup-content">
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontWeight: 500 }}>Benefit: </span> {add_on_benefits_points[this.state.popupRider].benefit}
                </div>
                <div>
                  {add_on_benefits_points[this.state.popupRider].content}
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
              onClick={this.handleClose}
              autoFocus>Got it!
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  addExtraPremium = (index, benefit, whatTo, fromApi) => {


    let totalAddedBenefits = this.state.totalAddedBenefits;
    let totalAddedAmount = this.state.totalAddedAmount;
    let riders_info = this.state.riders_info;
    let buttonTitle = 'Skip & Continue';
    let clicked_items = this.state.clicked_items || {};

    let last_pay_amounts = this.state.last_pay_amounts || {};

    if (whatTo === 'add') {
      clicked_items[benefit.rider_type] = true;
      totalAddedBenefits += 1;
      totalAddedAmount += benefit.pay_amount;
      riders_info[index].isAdded = true;
    } else {
      clicked_items[benefit.rider_type] = false;
      totalAddedBenefits -= 1;
      totalAddedAmount -= last_pay_amounts[benefit.rider_type];
      riders_info[index].isAdded = false;
    }

    if (this.state.quoteSelected.quote_provider === 'Maxlife' && !fromApi) {
      this.handleCloseAction(whatTo, index, benefit);
    }

    if (totalAddedBenefits > 0) {
      buttonTitle = 'Buy now';
    }

    last_pay_amounts[benefit.rider_type] = benefit.pay_amount;


    this.setState({
      totalAddedAmount: totalAddedAmount,
      totalAddedBenefits: totalAddedBenefits,
      riders_info: riders_info,
      totalPremium: this.state.basePremium + totalAddedAmount,
      buttonTitle: buttonTitle,
      last_pay_amounts: last_pay_amounts,
      clicked_items: clicked_items
    });

  }

  getCoverAmount(props) {
    if (props.inputToRender && props.cover_amount[props.selectedIndex] === 'Other') {
      return props.inputToRender.value;
    } else {
      return props.value || props.recommended;
    }
  }

  renderList(props, index) {
    return (
      <div style={{ marginTop: index === 0 ? 0 : 20 }} key={index} className="ins-riders-tiles">
        <div className="ins-riders-tiles1">
          <div className="ins-riders-tiles1a">{props.title}
            {props.sub_title &&
              <span className="ins-riders-tiles1aa">({props.sub_title})</span>}
          </div>
          <div className="ins-riders-tiles1b"
            style={{ color: getConfig().styles.primaryColor }}
            onClick={() => this.openPopUpInfo(props.rider_type)}>INFO</div>
        </div>

        {props.cover_amount && props.cover_amount.length > 1 && <div className="ins-riders-tiles2" onClick={() => this.changeAmount(index)}>
          <div className="ins-riders-tiles2a">Cover Amount</div>
          <div className="ins-riders-tiles2b">
            <div className="ins-riders-tiles2c">{this.getCoverAmount(props)}</div>
            <div className="ins-riders-tiles2d">
              <img className="ins-riders-tiles2e" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
        </div>}

        <div className="ins-riders-tiles3">
          <div className="ins-riders-tiles3a">
            <span className="ins-riders-tiles3b">Pay + </span>
            {props.showDotDot &&
              <div style={{ marginTop: 2 }}>
                <DotDotLoader></DotDotLoader>
              </div>}
            {!props.showDotDot && <span className="ins-riders-tiles3c">{inrFormatDecimal(props.pay_amount)} {this.state.payment_frequency}</span>}
          </div>
          {!props.isAdded && <div className="ins-riders-tiles3d" onClick={() => this.addExtraPremium(index, props, 'add')}>
            Add
          </div>}
          {props.isAdded && <div className="ins-riders-tiles3e" onClick={() => this.addExtraPremium(index, props, 'remove')}>
            Remove
          </div>}
        </div>
      </div>
    )
  }

  bannerText = () => {
    return (
      <span>
        Select any add ons and enhance your plan
      </span>
    );
  }

  handleCloseQuotes() {
    this.sendEvents('next', 'quote');
    this.submitQuote(this.state.final_id);
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
              <img className="quote-confirmation-dialog-head1" src={this.state.final_quote.quote_provider_logo} alt="Insurance" />
              <div className="quote-confirmation-dialog-head2">{this.state.final_quote.insurance_title}</div>
            </div>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Cover amount:</div>
                  <div className="confirm-quote-popup-content1b">{numDifferentiation(this.state.final_quote.cover_amount)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1a">Cover period:</div>
                  <div className="confirm-quote-popup-content1b">{this.state.final_quote.term}</div>
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
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.final_quote.quote_json.base_premium)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1c">Add on benefits</div>
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.final_quote.quote_json.riders_base_premium)}</div>
                </div>
                <div className="confirm-quote-popup-content1">
                  <div className="confirm-quote-popup-content1c">GST & taxes</div>
                  <div className="confirm-quote-popup-content1c">{inrFormatDecimal(this.state.final_quote.quote_json.total_tax)}</div>
                </div>
                <div className="confirm-quote-popup-content1 confirm-quote-popup-content1d">
                  <div className="confirm-quote-popup-content1e">Total payable</div>
                  <div className="confirm-quote-popup-content1b">{inrFormatDecimal(this.state.final_quote.quote_json.premium)}</div>
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

  sendEvents(user_action, screen_name) {

    let eventObj = {};
    if (screen_name === 'quote') {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'selected_quote_details',
          'from': 'riders'
        }
      };
    } else {
      eventObj = {
        "event_name": 'term_insurance ',
        "properties": {
          "user_action": user_action,
          "screen_name": 'add_on_benefits',
          '40_critical_ill_add_clicked': this.state.clicked_items && this.state.clicked_items.ci_amount ? 'yes' : 'no',
          'disabilities_add_clicked': this.state.clicked_items && this.state.clicked_items.ci_benefit ? 'yes' : 'no',
          'accidental_death_add_clicked': this.state.clicked_items && this.state.clicked_items.accident_benefit ? 'yes' : 'no',
          'info_ci_amount': this.state.infoClicks['ci_amount'] ? 'yes' : 'no',
          'info_ci_benefit': this.state.infoClicks['ci_benefit'] ? 'yes' : 'no',
          'info_accident_benefit': this.state.infoClicks['accident_benefit'] ? 'yes' : 'no',
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
        showDotDot={this.state.showDotDotMain}
        events={this.sendEvents('just_set_events')}
        classOverRide="insurance-container-grey"
        classOverRideContainer="insurance-container-grey"
        showLoader={this.state.show_loader}
        title="Add additional benefit"
        smallTitle={this.state.quoteSelected.insurance_title}
        handleClick={this.handleClick}
        buttonTitle={this.state.buttonTitle}
        fullWidthButton={true}
        banner={true}
        bannerText={this.bannerText()}
        summarypage={true}
        premium={this.state.totalPremium}
        provider={this.state.quoteSelected.quote_provider}
        paymentFrequency={this.state.quoteSelected.payment_frequency_selected}
        closePopup={this.handleClose}
      >

        {this.state.riders_info && this.state.riders_info.map(this.renderList)}
        {this.renderPopUpCoverAmount()}
        {this.renderPopUpInfo()}
        {this.renderPopUpQuote()}
      </Container>
    );
  }
}

export default AddOnBenefits;
