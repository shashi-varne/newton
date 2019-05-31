import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import selected_option from 'assets/selected_option.png';
import annual_income_icon from 'assets/income_icon.png';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';

import DropdownInPage from '../../../common/ui/DropdownInPage';

class AnnualIncome extends Component {

  constructor(props) {
    var quoteData = JSON.parse(window.localStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      selectedIndex: quoteData.selectedIndexIncome || '',
      annual_income: '',
      incomeList: [
        {
          name: '', value: ''
        }
      ],
      openPopUp: false,
      quoteData: quoteData
    }
    this.renderList = this.renderList.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    console.log(this.state.quoteData);
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
    let quoteData = this.state.quoteData;
    quoteData.annual_income = this.state.incomeList[this.state.selectedIndex].name;
    quoteData.selectedIndexIncome = this.state.selectedIndex;
    quoteData.incomeList = this.state.incomeList;
    window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('cover-amount', quoteData.annual_income);
  }

  setValue(index) {
    console.log("returned index : " + index)
    this.setState({
      selectedIndex: index,
      annual_income: this.state.incomeList[index].value
    })
  }

  handleClose = () => {
    this.setState({
      openPopUp: false
    });
  }

  openPopUp() {
    this.setState({
      openPopUp: true
    })
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

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.setValue(index)}
        className={'ins-row-scroll' + (this.state.selectedIndex === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedIndex !== index &&
          <div> {props.value}</div>}
        {this.state.selectedIndex === index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '88%', color: '#4f2da7', fontWeight: 500 }}>{props.value}</div>
            <img width="20" src={selected_option} alt="Insurance" />
          </div>}
      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Annual Income"
        count={true}
        total={5}
        current={2}
        handleClick={this.handleClick}
        buttonTitle="Next"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >
        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={annual_income_icon} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>My current annual income is</div>

            {this.state.incomeList[this.state.quoteData.selectedIndexIncome] && <div className="annual-income-data-mid" style={{ width: '35%' }} >₹ {this.state.annual_income ||
              this.state.incomeList[this.state.quoteData.selectedIndexIncome].value || ''}</div>}
            {!this.state.incomeList[this.state.quoteData.selectedIndexIncome] &&
              <div className="annual-income-data-mid" style={{ width: '35%' }} >₹ {this.state.annual_income || ''}</div>}

            <div style={{ color: '#878787', fontSize: 12 }}>Select an option from below</div>
          </div>
          <div className="annual-income-info-button"
            style={{ color: getConfig().primary }}
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
