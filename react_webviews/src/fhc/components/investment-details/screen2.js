import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import Api from 'utils/api';
import { investmentOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';

class InvestmentDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      investmentOpts: [],
      investment_error: '',
      fhc_data: new FHC(),
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  initializeInvestOpts = (existingData = {}) => {
    let keyedData = existingData.reduce((keyMap, currOpt) => {
      keyMap[currOpt.type] = currOpt;
      return keyMap;
    }, {});
    let invOpts = [];
    for (const inv of investmentOptions) {
      let checked = !!keyedData[inv.type];
      invOpts.push(Object.assign({}, inv, { checked }));
    }
    return invOpts;
  }

  async componentDidMount() {
    try {
      let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
      if (!fhc_data) {
        const res = await Api.get('page/financialhealthcheck/edit/mine', {
          format: 'json',
        });
        console.log('res', res);
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      this.setState({
        show_loader: false,
        investmentOpts: this.initializeInvestOpts(fhc_data.investments),
        fhc_data,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      console.log(err);
      toast('Something went wrong. Please try again');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents(user_action) {
    const snakeCase = val => val.replace(/[-\s]/g, '_');
    const eventOpts = this.state.investmentOpts.reduce((obj, currInv) => {
      obj[snakeCase(currInv.type)] = currInv.checked ? 'yes' : 'no';
      return obj;
    }, {});
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'investment details',
        ...(eventOpts || []),
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    // this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const investmentSelected = this.state.investmentOpts.some(inv => inv.checked);
    
    if (!investmentSelected) {
      this.setState({
        investment_error: 'Please select investments from below',
      });
    } else {
      fhc_data.investments = this.state.investmentOpts.filter(inv => inv.checked);
      window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
      this.navigate('investment3');
    }
  }

  handleChange = (val, idx) => event => {
    console.log(val, event.target.checked);
    let opts = [...this.state.investmentOpts];
    opts[idx].checked = event.target.checked;
    this.setState({ investmentOpts: opts });
  }

  bannerText = () => {
    return (
      <span>
        Let's have a look at your investments
      </span>
    );
  }

  renderSelectOption = (option, idx) => {
    return (
      <div className="CheckBlock2" style={{ marginLeft: '5px' }} key={idx}>
        <Grid container spacing={16} alignItems="center" style={{ maxHeight: '60px' }}>
          <Grid item xs={1} className="TextCenter">
            <Checkbox
              defaultChecked
              checked={option.checked}
              color="default"
              value="checked"
              name="checked"
              onChange={this.handleChange(option.type, idx)}
              className="Checkbox" />
          </Grid>
          <Grid item xs={11}>
            <div className="checkbox-text">{option.name}</div>
          </Grid>
        </Grid>
      </div>
    )
  };

  render() {
    let errorMsg = this.state.investment_error ? 
      <span style={{ color: 'red', paddingLeft: '4px' }}>
        {this.state.investment_error}
      </span> : '';

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={3}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={false}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/invest.svg`)}
            title={'Investment Details'} />
          <div style={{ fontSize: '16px', color: '#4a4a4a', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', display: 'block', marginBottom: '20px'}}>Great! It's good to have investments for future.</span>
            Where you have put your money? Select from the assets below
          </div>
          { errorMsg }
          <div className="InputField" style={{ marginBottom: '0px !important' }}>
            { 
              this.state.investmentOpts.map((option, idx) => this.renderSelectOption(option, idx))
            }
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default InvestmentDetails2;
