import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig, manageDialog } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import comver_amount_icon from 'assets/life_cover_icon.png';
import {
  validateNumber, inrFormatDecimal,
  numDifferentiation, checkValidNumber
} from 'utils/validators';
import DropdownInPage from '../../../../common/ui/DropdownInPage';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';

class CoverAmount extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.sessionStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      selectedIndex: checkValidNumber(quoteData.selectedIndexCoverAmount, ''),
      coverAmountList: [{
        name: '', value: ''
      }],
      cover_amount_error: '',
      quoteData: quoteData,
      cover_amount: quoteData.cover_amount,
      coverAmountToShow: quoteData.coverAmountToShow,
      info_clicked: 'no'
    }
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location || {};
    let annual_income = params && params.annual_income ? params.annual_income : this.state.quoteData.annual_income;
    if (!annual_income) {
      this.navigate('annual-income');
      return;
    }
    this.setState({
      annual_income: annual_income,
      cover_amount: this.state.quoteData.cover_amount || ''
    })
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/recommend/cover_amount?annual_income=' + this.state.annual_income)
      this.setState({
        show_loader: false
      });
      let result = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200) {
        result.list.push({ name: 'Other' });

        let cover_amount_min_max = 'Min ' + inrFormatDecimal(result.min) + ' - Max ' + inrFormatDecimal(result.max);

        this.setState({
          coverAmountList: result.list,
          min: result.min,
          max: result.max,
          cover_amount_min_max: cover_amount_min_max
        });
        for (var i in result.list) {
          if (result.recommendation.name === result.list[i].name) {
            this.setState({
              selectedIndex: checkValidNumber(this.state.selectedIndex, i),
              recommendedIndex: i
            })
            this.setValue(this.state.selectedIndex, 'first');
          }
        }

        let inputToRender = {
          error: false,
          helperText: this.state.cover_amount_error || cover_amount_min_max,
          type: "text",
          width: "40",
          label: "Cover Amount",
          class: "Income",
          id: "income",
          name: "cover_amount",
          value: this.state.quoteData.cover_amount,
          onChange: this.handleChange('cover_amount'),
          onKeyChange: this.handleKeyChange('cover_amount'),
          cover_amount_min_max: cover_amount_min_max,
          min: result.min,
          max: result.max,
        }

        this.setState({
          inputToRender: inputToRender
        });

      } else {
        toast(result.error || result.message);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  redirectNow() {
    let quoteData = this.state.quoteData;
    quoteData.cover_amount = this.state.coverAmountList[this.state.selectedIndex].value || this.state.cover_amount;
    quoteData.selectedIndexCoverAmount = this.state.selectedIndex;
    quoteData.coverAmountList = this.state.coverAmountList;
    quoteData.coverAmountToShow = this.state.coverAmountToShow;
    quoteData.recommendedIndexCoverAmount = this.state.recommendedIndex;
    quoteData.inputToRender_cover_amount = this.state.inputToRender;
    window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('cover-period')
  }

  handleClick = async () => {

    this.sendEvents('next');
    if (this.state.coverAmountList[this.state.selectedIndex].name === 'Other') {
      if (!this.state.cover_amount) {
        let error = 'Cover Amount cannot be empty';
        this.setState({
          cover_amount_error: error,
          inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
        });
      } else if ((!validateNumber(this.state.cover_amount) || !this.state.cover_amount)) {
        let error = 'Invalid Cover Amount';
        this.setState({
          cover_amount_error: error,
          inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
        });
      } else if (this.state.cover_amount < this.state.min) {
        let error = 'Minimum Cover Amount is ' + inrFormatDecimal(this.state.min);
        this.setState({
          cover_amount_error: error,
          inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
        });
      } else if (this.state.cover_amount > this.state.max) {
        let error = 'Maximum Cover Amount is ' + inrFormatDecimal(this.state.max);
        this.setState({
          cover_amount_error: error,
          inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
        });
      } else if ((!validateNumber(this.state.cover_amount) || !this.state.cover_amount)) {
        let error = 'Invalid Cover Amount';
        this.setState({
          cover_amount_error: error,
          inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
        });
      } else {
        this.redirectNow();
      }
    } else {
      this.redirectNow();
    }

  }

  setValue(index, isFirst) {

    if (this.state.otherIndex === index) {
      return;
    } else {
      this.setState({
        otherIndex: -1
      })
    }
    let cover_amount = this.state.coverAmountList[index].name;
    let coverAmountToShow = cover_amount;
    if (this.state.coverAmountList[index].name === 'Other') {
      cover_amount = 0;
      if (isFirst) {
        cover_amount = this.state.quoteData.cover_amount;
      }

      coverAmountToShow = this.state.quoteData.coverAmountToShow;
      this.setState({
        otherIndex: index,
        inputToRender: { ...this.state.inputToRender, value: cover_amount }
      })
    }
    // eslint-disable-next-line
    index = parseInt(index);
    this.setState({
      selectedIndex: index,
      cover_amount: cover_amount,
      coverAmountToShow: coverAmountToShow,
      name: this.state.coverAmountList[index].name
    })
  }

  handleClose = () => {
    manageDialog('general-dialog', 'flex', 'enableScroll');
    this.setState({
      openPopUp: false
    });
  }

  openPopUp() {
    this.setState({
      openPopUp: true,
      info_clicked: 'yes'
    })
    manageDialog('general-dialog', 'flex', 'disableScroll');

  }

  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          style={{ borderRadius: 6 }}
          id="general-dialog"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Cover Amount
             </div>
              <div className="annual-inc-popup-title-inside">
                <span style={{ textTransform: 'capitalize' }}>{this.state.type}</span> recommendation
             </div>
              <div className="annual-inc-popup-content">
                Get a Life Cover for atleast 12-14 times of your annual income.
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

  handleChange = name => event => {
    let inputToRender = this.state.inputToRender;
    inputToRender.helperText = this.state.cover_amount_min_max;
    inputToRender.error = false;
    inputToRender.value = event.target.value.replace(/,/g, "");
    this.setState({
      [name]: event.target.value.replace(/,/g, ""),
      [name + '_error']: '',
      inputToRender: inputToRender,
      coverAmountToShow: numDifferentiation(event.target.value.replace(/,/g, "") * 1)
    });
  };

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cover_amount',
        'cover_amount': this.state.coverAmountList && checkValidNumber(this.state.selectedIndex) && this.state.coverAmountList[this.state.selectedIndex]
          ? numDifferentiation(this.state.coverAmountList[this.state.selectedIndex].value || this.state.cover_amount) : '',
        'info': this.state.info_clicked
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
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Cover Amount"
        count={true}
        total={5}
        current={3}
        handleClick={this.handleClick}
        buttonTitle="Next"
        fullWidthButton={true}
        onlyButton={true}
        closePopup={this.handleClose}
      >
        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={comver_amount_icon} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>I want my family to receive</div>
            <div style={{ display: 'flex' }}>
              <div className="annual-income-data-mid" style={{ width: 'fit-content' }}>
                ₹ {this.state.coverAmountToShow}</div>
              <div style={{ margin: '4px 0 0 8px', fontSize: 16, color: ' #4a4a4a' }}>In my absence</div>
            </div>
          </div>
          <div className="annual-income-info-button"
            style={{ color: getConfig().styles.primaryColor }}
            onClick={() => this.openPopUp()}>INFO</div>
        </div>

        <div style={{ marginTop: 60 }}>
          {this.state.inputToRender && this.state.inputToRender.helperText && <DropdownInPage
            options={this.state.coverAmountList}
            value={this.state.selectedIndex}
            onChange={this.setValue}
            recommendedIndex={this.state.recommendedIndex}
            dataType="AOB"
            keyToShow="name"
            inputKeyName="Other"
            inputToRender={this.state.inputToRender} />}
        </div>
        {this.renderPopUp()}
      </Container>
    );
  }
}

export default CoverAmount;
