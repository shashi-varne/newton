import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig, manageDialog } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import selected_option from 'assets/selected_option.png';
import annual_income_icon from 'assets/income_icon.png';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';

import { checkValidNumber } from 'utils/validators';
import DropdownInPage from '../../../../common/ui/DropdownInPage';

class AnnualIncome extends Component {

  constructor(props) {
    var quoteData = JSON.parse(window.sessionStorage.getItem('quoteData') || {});
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      selectedIndex: checkValidNumber(quoteData.selectedIndexIncome, ''),
      annual_income: '',
      incomeList: [
        {
          name: '', value: ''
        }
      ],
      openPopUp: false,
      annual_income_error: false,
      quoteData: quoteData,
      info_clicked: 'no'
    }
    this.renderList = this.renderList.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/recommend/income')

      let result = res.pfwresponse.result;
      this.setState({
        show_loader: false,
        incomeList: result.list,
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
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

    this.sendEvents('next');
    if (!this.state.selectedIndex && this.state.selectedIndex !== 0) {
      this.setState({
        annual_income_error: true
      });
      return;
    }
    let quoteData = this.state.quoteData;
    quoteData.annual_income = this.state.incomeList[this.state.selectedIndex].name;
    quoteData.selectedIndexIncome = this.state.selectedIndex;
    quoteData.incomeList = this.state.incomeList;
    window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('cover-amount', quoteData.annual_income);
  }

  setValue(index) {
    this.setState({
      selectedIndex: index,
      annual_income: this.state.incomeList[index].value,
      annual_income_error: false
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

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.setValue(index)}
        className={'ins-row-scroll' + (this.state.selectedIndex === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedIndex !== index &&
          <div> {props.value}</div>}
        {this.state.selectedIndex === index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '88%', color: getConfig().styles.primaryColor, fontWeight: 500 }}>{props.value}</div>
            <img width="20" src={selected_option} alt="Insurance" />
          </div>}
      </div>
    )
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'annual_income',
        'income_click': this.state.incomeList && checkValidNumber(this.state.selectedIndex) && this.state.incomeList[this.state.selectedIndex]
          ? this.state.incomeList[this.state.selectedIndex].name : '',
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
        smallTitle="Annual Income"
        count={true}
        total={5}
        current={2}
        handleClick={this.handleClick}
        buttonTitle="Next"
        fullWidthButton={true}
        onlyButton={true}
        closePopup={this.handleClose}
      >
        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={annual_income_icon} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>My current annual income is</div>

            {this.state.incomeList[this.state.quoteData.selectedIndexIncome] && <div className="annual-income-data-mid" style={{ width: 'fit-content', minWidth: 20 }} >₹ {this.state.annual_income ||
              this.state.incomeList[this.state.quoteData.selectedIndexIncome].value || ''}</div>}
            {!this.state.incomeList[this.state.quoteData.selectedIndexIncome] &&
              <div className="annual-income-data-mid" style={{ width: 'fit-content', minWidth: 20 }} >₹ {this.state.annual_income || ''}</div>}

            {this.state.selectedIndex >= 0 &&
              <div style={{ color: this.state.annual_income_error ? 'red' : '#878787', fontSize: 12 }}>Select an option from below</div>}
          </div>
          <div className="annual-income-info-button"
            style={{ color: getConfig().styles.primaryColor }}
            onClick={() => this.openPopUp()}>INFO</div>
        </div>

        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.incomeList}
            value={this.state.selectedIndex}
            onChange={this.setValue}
            dataType="AOB"
            keyToShow="value" />
        </div>
        {this.renderPopUp()}
      </Container>
    );
  }
}

export default AnnualIncome;
