import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import Api from 'utils/api';
import { yesOrNoOptions, investmentOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class InvestmentDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      investmentOpts: this.createInvestOpts(),
      investment: '',
      investment_error: '',
      image: '',
      provider: '',
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  createInvestOpts = () => {
    let opts = [...investmentOptions];
    opts.forEach(opt => opt.checked = false);
    return opts;
  }

  async componentDidMount() {
    try {
      const res = await Api.get('page/financialhealthcheck/edit/mine?format=json');
      const { email, mobile_no } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        email: email || '',
        mobile_no: mobile_no || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan
      });
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
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan_details_one',
        "provider": this.state.provider,
        "investment": this.state.investment,
        "from_edit": (this.state.edit) ? 'yes' : 'no'
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
    if (!this.state.investment) {
      this.setState({
        investment_error: 'Please select an option',
      });
    } else {
      console.log('ALL VALID - SCREEN 1 - Investment');
      if (this.state.investment === 'yes') {
        this.navigate('/fhc/investment2');
      } else {
        //skip to screen 3 if user selects 'No' for investments
        this.navigate('/fhc/investment4');
      }
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
              onChange={this.handleChange(option.value, idx)}
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
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={3}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={'Investment Details'} />
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
