import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import DotDotLoader from '../../../common/ui/DotDotLoader';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import dropdown_arrow_fisdom from 'assets/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';
import DropdownInPage from '../../../common/ui/DropdownInPage';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import { validateNumber, inrFormatDecimal } from 'utils/validators';

class AddOnBenefits extends Component {

  constructor(props) {
    var quoteSelected = JSON.parse(window.localStorage.getItem('quoteSelected')) || {};
    console.log(quoteSelected);
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      openPopUp: false,
      insurance_app_id: (quoteSelected.payment_frequency_selected).toLowerCase() === 'annually' ? quoteSelected.annual_quote_id :
        quoteSelected.id,
      quoteSelected: quoteSelected,
      openPopUpCoverAmount: false,
      buttonTitle: 'Skip & Continue',
      totalAddedAmount: 0,
      totalAddedBenefits: 0,
      totalPremium: quoteSelected.quote_json.premium * 1,
      basePremium: quoteSelected.quote_json.premium * 1,
      openPopUpInfo: false
    }
    this.renderList = this.renderList.bind(this);
    this.setValue = this.setValue.bind(this);
    this.renderListCoverAmount = this.renderListCoverAmount.bind(this);
    this.handleCloseAction = this.handleCloseAction.bind(this);
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

  async getRiders(fromFilters) {
    try {
      let url = '/api/insurance/fetch/riders/' + this.state.insurance_app_id;
      if (fromFilters) {
        let selectedRiderList = this.state.selectedRiderList;

        url += '/' + [selectedRiderList.rider_type + '='] + selectedRiderList.value;
      }
      const res = await Api.get(url);
      // const res = { "pfwuser_id": 4709613628817409, "pfwresponse": { "status_code": 200, "requestapi": "", "result": { "riders_info": [{ "pay_amount": 3109.0, "error": "", "rider_type": "ci_amount", "title": "Protection against 19 critical illness", "max": 30000000, "min": 25000, "cover_amount": [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000, 3000000, 3100000, 3200000, 3300000, 3400000, 3500000, 3600000, 3700000, 3800000, 3900000, 4000000, 4100000, 4200000, 4300000, 4400000, 4500000, 4600000, 4700000, 4800000, 4900000, 5000000], "recommended": 500000 }, { "pay_amount": 2414.0, "error": "", "rider_type": "adb", "title": "Protection against accidental permanent disability", "max": 30000000, "min": 25000, "cover_amount": [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000, 3000000, 3100000, 3200000, 3300000, 3400000, 3500000, 3600000, 3700000, 3800000, 3900000, 4000000, 4100000, 4200000, 4300000, 4400000, 4500000, 4600000, 4700000, 4800000, 4900000, 5000000], "recommended": 500000 }] } }, "pfwmessage": "Success", "pfwutime": "", "pfwstatus_code": 200, "pfwtime": "2019-06-06 07:30:35.845336" };
      let result = res.pfwresponse.result;
      let riders_info = result.riders_info;

      var i = 0;
      for (i in riders_info) {
        if (this.state.quoteSelected.quote_provider !== 'Maxlife' && riders_info[i].cover_amount) {
          (riders_info[i].cover_amount).push('Other');
        }

        riders_info[i].inputToRender = this.getInputToRender(riders_info[i]);
        var j = 0;
        for (j in riders_info[i].cover_amount) {
          if (riders_info[i].cover_amount[j] === riders_info[i].recommended) {
            riders_info[i].recommendedIndex = j;
            riders_info[i].selectedIndex = j;
          }
        }
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

  async componentDidMount() {

    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom
    })
    this.getRiders()
  }


  navigate = (pathname, annual_income) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        annual_income: annual_income
      }
    });
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })

    let accident_benefit, ci_benefit = 'N', ci_amount, wop = 'N';
    let riders_info = this.state.riders_info;
    for (var i in this.state.riders_info) {
      if (riders_info[i].isAdded) {
        if (riders_info[i].rider_type === 'adb') {
          accident_benefit = riders_info[i].value || riders_info[i].recommended;
        } else if (riders_info[i].rider_type === 'ci_amount') {
          ci_amount = riders_info[i].value || riders_info[i].recommended;
          ci_benefit = 'Y';
        } else if (riders_info[i].rider_type === 'wop') {
          wop = 'Y';
        }
      }
    }
    let insuranceData = {
      tobacco_choice: this.state.quoteSelected.tobacco_choice,
      cover: this.state.quoteSelected.cover_amount,
      term: this.state.quoteSelected.term,
      payment_frequency: this.state.quoteSelected.payment_frequency || 'Monthly',
      death_benefit_option: '',
      dob: this.state.quoteSelected.dob,
      gender: this.state.quoteSelected.gender,
      annual_income: this.state.quoteSelected.annual_income,
      accident_benefit: accident_benefit || '',
      ci_benefit: ci_benefit || '',
      ci_amount: ci_amount,
      annual_quote_required: true,
      wop: wop
    };
    try {
      const res = await Api.post('/api/insurance/quote', insuranceData)
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.quotes) {
        let quotes = res.pfwresponse.result.quotes;
        for (let i in quotes)
          if (quotes[i].quote_provider === this.state.quoteSelected.quote_provider) {
            let final_id = (this.state.quoteSelected.payment_frequency_selected).toLowerCase() === 'annually' ? quotes[i].annual_quote_id :
              quotes[i].id;
            this.submitQuote(final_id);
          }
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
    try {
      const res = await Api.post('/api/insurance/quote/select', insuranceData)
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.quotes) {
        // let result = res.pfwresponse.result.quotes;
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
  }

  renderListCoverAmount() {
    if (this.state.openPopUpCoverAmount) {
      return (
        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.selectedRiderList.cover_amount}
            value={this.state.selectedRiderList.selectedIndex || 0}
            onChange={this.setValue}
            recommendedIndex={this.state.selectedRiderList.recommendedIndex || ''}
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

  async handleCloseAction() {

    console.log(this.state);
    var riders_info_current = this.state.riders_info;
    riders_info_current[this.state.selectedIndex].showDotDot = true;
    this.setState({
      riders_info: riders_info_current,
      openPopUpCoverAmount: false
    })
    try {
      let selectedRiderList = this.state.selectedRiderList;
      let url = '/api/insurance/fetch/riders/' + this.state.insurance_app_id + '?'
        + selectedRiderList['rider_type'] + '=' + selectedRiderList.value;
      console.log("send url after filter ::" + url);
      const res = await Api.get(url);

      riders_info_current[this.state.selectedIndex].showDotDot = false;
      this.setState({
        riders_info: riders_info_current
      });
      let result = res.pfwresponse.result;
      let riders_info = result.riders_info;

      var i = 0;
      let riders_info_currnet = this.state.riders_info;
      for (i in riders_info) {
        if (riders_info[i].rider_type === selectedRiderList.rider_type) {
          riders_info_currnet[i].pay_amount = riders_info[i].pay_amount;
          this.setState({
            riders_info: riders_info_currnet
          })
        }
      }

    } catch (err) {
      this.setState({
        show_loader: false
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
          id="payment"
          open={this.state.openPopUpCoverAmount}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="quote-filter-dialog-head">
              Cover Amount
            </div>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              {this.renderListCoverAmount()}
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

  handleClose = () => {
    this.setState({
      openPopUp: false,
      openPopUpCoverAmount: false,
      openPopUpInfo: false
    });
  }

  openPopUpInfo() {
    this.setState({
      openPopUpInfo: true
    })
  }

  renderPopUpInfo() {
    if (this.state.openPopUpInfo) {
      return (
        <Dialog
          style={{ borderRadius: 6 }}
          id="payment"
          open={this.state.openPopUpInfo}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Why annual Income?
             </div>
              <div className="annual-inc-popup-content">
                Our goal is to recommend the best policy for your famliy. We need your total
                annual income to determine the adequate cover amount for your family.
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

  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          style={{ borderRadius: 6 }}
          id="payment"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Why annual Income?
             </div>
              <div className="annual-inc-popup-content">
                Our goal is to recommend the best policy for your famliy. We need your total
                annual income to determine the adequate cover amount for your family.
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

  addExtraPremium(index, benefit, whatTo) {

    let totalAddedBenefits = this.state.totalAddedBenefits;
    let totalAddedAmount = this.state.totalAddedAmount;
    let riders_info = this.state.riders_info;
    let buttonTitle = 'Skip & Continue';
    if (whatTo === 'add') {
      totalAddedBenefits += 1;
      totalAddedAmount += benefit.pay_amount;
      riders_info[index].isAdded = true;
    } else {
      totalAddedBenefits -= 1;
      totalAddedAmount -= benefit.pay_amount;
      riders_info[index].isAdded = false;
    }

    if (totalAddedBenefits > 0) {
      buttonTitle = 'Buy now';
    }
    this.setState({
      totalAddedAmount: totalAddedAmount,
      totalAddedBenefits: totalAddedBenefits,
      riders_info: riders_info,
      totalPremium: this.state.basePremium + totalAddedAmount,
      buttonTitle: buttonTitle
    });

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
            style={{ color: getConfig().primary }}
            onClick={() => this.openPopUpInfo()}>INFO</div>
        </div>

        {props.cover_amount && <div className="ins-riders-tiles2" onClick={() => this.changeAmount(index)}>
          <div className="ins-riders-tiles2a">Cover Amount</div>
          <div className="ins-riders-tiles2b">
            <div className="ins-riders-tiles2c">{props.value || props.recommended}</div>
            <div className="ins-riders-tiles2d">
              <img className="ins-riders-tiles2e" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
        </div>}

        <div className="ins-riders-tiles3">
          <div className="ins-riders-tiles3a">
            <span className="ins-riders-tiles3b">Pay + </span>
            {props.showDotDot && <DotDotLoader></DotDotLoader>}
            {!props.showDotDot && <span className="ins-riders-tiles3c">{inrFormatDecimal(props.pay_amount)} Monthly</span>}
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

  render() {
    return (
      <Container
        classOverRide="insurance-container-grey"
        classOverRideContainer="insurance-container-grey"
        showLoader={this.state.show_loader}
        title="Add on Benifits"
        smallTitle={this.state.quoteSelected.insurance_title}
        handleClick={this.handleClick}
        buttonTitle={this.state.buttonTitle}
        type={this.state.type}
        fullWidthButton={true}
        banner={true}
        bannerText={this.bannerText()}
        summarypage={true}
        premium={this.state.totalPremium}
        provider={this.state.quoteSelected.quote_provider}
        paymentFrequency={this.state.quoteSelected.payment_frequency_selected}
      >

        {this.state.riders_info && this.state.riders_info.map(this.renderList)}
        {this.renderPopUp()}

        {this.renderPopUpCoverAmount()}
        {this.renderPopUpInfo()}
      </Container>
    );
  }
}

export default AddOnBenefits;
