import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import toast from '../../ui/Toast';
import Input from '../../ui/Input';
import Container from '../../common/Container';
import Api from 'utils/api';
// import { nativeCallback } from 'utils/native_callback';

class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      mfTab: 0,
      yearTab: 1,
      amount: 50000,
      amount_error: '',
      funds: []
    }
    this.renderFunds = this.renderFunds.bind(this);
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

  async getFunds(duration, amount, type) {
    try {
      let type_choices = ['sip', 'one_time'];
      let timeChoices = ['0m', '6m', '1y', '3y', '5y'];

      this.setState({
        show_loader: true,
      });
      let url = '/api/risk/profile/user/recommendation?duration=' + timeChoices[duration] +
        '&amount=' + amount + '&type=' + type_choices[type];
      const res = await Api.post(url);

      if (res.pfwresponse.result.funds) {
        this.setState({
          funds: res.pfwresponse.result.funds
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
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  async componentDidMount() {
    this.getFunds(this.state.yearTab, this.state.amount, this.state.mfTab)
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (field) => (event) => {

    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
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

  handleClick = async () => {

    // this.navigate('/question2');
  }

  getTabClassName(type, value) {
    if (value === this.state[type]) {
      return this.state.type !== 'fisdom' ? 'mywayColor' : 'fisdomColor'
    }
    return '';
  }

  onBlurAmount = (event) => {
    console.log('blue');
    console.log(this.state);
    this.getFunds(this.state.yearTab, this.state.amount, this.state.mfTab);

  }

  renderFunds(props, index) {
    return (
      <div key={index} className="fund-details">
        <div>
          <img style={{ border: '1px solid #ededed' }} alt="Risk Profile" src={props.amc_logo_big} width={75} />
        </div>
        <div style={{ marginLeft: 10 }}>
          <div className="fund-details-head">{props.name}</div>
          <div className="fund-details-below">Rs {props.amount}</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Fund Recommendation"
        handleClick={this.handleClick}
        classOverRide="recommendation-container"
        edit={this.props.edit}
        buttonTitle="Invest"
        type={this.state.type}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '1px 10px 10px 10px' }}>
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
          <FormControl fullWidth style={{ marginTop: '20px' }} onBlur={(event) => this.onBlurAmount()}>
            <div className="InputField">
              <Input
                error={(this.state.amount_error) ? true : false}
                helperText={this.state.amount_error}
                type="number"
                width="40"
                label="Amount"
                style={{ color: '#4a4a4a', fontSize: 14 }}
                class=""
                id="number"
                name="amount"
                value={this.state.amount}
                onChange={this.handleChange('amount')} />
            </div>
          </FormControl>
          <p style={{ color: '#4a4a4a', fontSize: 14 }}>Recommended Funds  </p>
          <div className="funds-card">
            {this.state.funds && this.state.funds.map(this.renderFunds)}
          </div>
        </div>
      </Container>
    );
  }
}

export default Recommendation;
