import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read_fisdom from 'assets/ic_read_fisdom.svg';
import ic_read_myway from 'assets/ic_read_myway.svg';
import ic_claim_assist_fisdom from 'assets/ic_claim_assist_fisdom.svg';
import ic_claim_assist_myway from 'assets/ic_claim_assist_myway.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import instant_fisdom from 'assets/instant_fisdom.svg';
import instant_myway from 'assets/instant_myway.svg';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { insuranceProductTitleMapper } from '../../constants';
import {
  inrFormatDecimal
} from 'utils/validators';

const coverAmountMapper = {
  'PERSONAL_ACCIDENT': {
    1000000: 0,
    500000: 1,
    200000: 2,
  },
  'HOSPICASH': {
    500: 2,
    1500: 1,
    5000: 0
  },
  'SMART_WALLET': {
    40000: 2,
    100000: 1,
    150000: 0
  }
}

let styles = {};

class PlanDetailsClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      checked: true,
      show_loader: true,
      parent: this.props.parent || {
        'plan_data': {

        }
      },
      type: getConfig().productName,
      color: getConfig().primary,
      quoteData: {},
      premiudmDtailsStored: window.localStorage.getItem('group_insurance_plan_final_data') ? 
      JSON.parse(window.localStorage.getItem('group_insurance_plan_final_data')) : ''
    };

    this.renderPlans = this.renderPlans.bind(this);
    this.openInBrowser = this.openInBrowser.bind(this);
    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentWillMount() {
    let instant_icon = this.state.type !== 'fisdom' ? instant_myway : instant_fisdom;
    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected') || '';
    this.setState({
      lead_id: lead_id || '',
      instant_icon: instant_icon
    })

  }

  openInBrowser(url, type) {
    if (!url) {
      return;
    }
    this.sendEvents(type);
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  setPremiumData(premium_details, leadData) {
    if(!leadData || Object.keys(leadData).length === 0) {
      this.setState({
        selectedIndex: 0
      })
      return;
    }
    Object.keys(premium_details).forEach((key) => {
      premium_details[key] = leadData[key]
    })

    let selectedIndex = coverAmountMapper[this.props.parent.state.product_key][premium_details.cover_amount];
    this.setState({
      selectedIndex: selectedIndex
    })
  }

  async componentDidMount() {
    this.setState({
      ic_claim_assist: this.state.type !== 'fisdom' ? ic_claim_assist_myway : ic_claim_assist_fisdom,
      ic_read: this.state.type !== 'fisdom' ? ic_read_myway : ic_read_fisdom
    })

    let premium_details = {
      "product_name": this.props.parent.state.product_key,
      cover_amount: '',
      premium: '',
      tax_amount: ''
    };

    styles.color = {
      color: this.state.color
    }

    try {

      const resQuote = await Api.get('api/ins_service/api/insurance/bhartiaxa/get/quote?product_name=' +
        this.props.parent.state.product_key)

      if (resQuote && resQuote.pfwresponse.status_code === 200) {

        let quoteData = resQuote.pfwresponse.result;
        this.setState({
          quoteData: quoteData
        })

      } else {
        toast(resQuote.pfwresponse.result.error || resQuote.pfwresponse.result.message
          || 'Something went wrong');
      }

      if (this.state.lead_id) {
        let res = await Api.get('api/ins_service/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)

       
        if (res.pfwresponse.status_code === 200) {

          var leadData = res.pfwresponse.result.lead;
          this.setPremiumData(premium_details, leadData);
          this.setState({
            leadData: leadData,
            show_loader: false
          })

        } else {
          this.setState({
            show_loader: false
          })
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message
            || 'Something went wrong');
        }
      } else {
        
        let data = {};
        if(this.state.premiudmDtailsStored) {
          data = this.state.premiudmDtailsStored[this.props.parent.state.product_key] || {};
        }
        this.setPremiumData(premium_details, data || {});

        this.setState({
          show_loader: false
        })
      }

    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

    this.setState({
      premium_details: premium_details
    })

  }




  componentDidUpdate(prevState) {

    if (this.state.parent !== this.props.parent) {
      this.setState({
        parent: this.props.parent || {}
      })
    }

  }

  selectPlan = (index) => {
    this.setState({
      selectedIndex: index
    });
  }

  renderBenefits = (props, index) => {
    return (
      <div key={index} className={`plan-details-item ${(props.isDisabled) ? 'disabled' : ''}`}
       >
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div>
          <div className="plan-details-text">{props.disc}</div>
          {((props.isDisabled && props.disc2) || 
          (this.props.parent.state.product_key === 'HOSPICASH' && props.disc2)) 
          &&<div style={{color: '#6F6F6F', margin:'7px 0 0 0', fontSize:10}}>
             {props.disc2}</div>}
        </div>
      </div>
    )
  }

  renderPlans(props, index) {
    if (this.state.selectedIndex === index) {
      styles.activeplan = {
        border: `2px solid ${this.state.color}`
      }
    } else {
      styles.activeplan = {
        border: `2px solid #fff`
      }
    }

    return (
      <div key={index}
        style={styles.activeplan}
        className={`accident-plan-item`}
        onClick={() => this.selectPlan(index)}>
        <div className="accident-plan-item1">Cover amount</div>
        <div className="accident-plan-item2">{inrFormatDecimal(props.sum_assured)}
        {this.props.parent.state.product_key === 'HOSPICASH' && <span>/day</span>}
        </div>
        <div className="accident-plan-item3">
          <span className="accident-plan-item4">in</span>
          <span className="accident-plan-item-color" style={{color: getConfig().primary,fontWeight:'bold'}}>₹ {props.premium}/year</span></div>
        {props.plus_benefit &&
          <div className="accident-plan-benefit" style={styles.color}>+{props.plus_benefit} Benefits</div>
        }
        {this.state.parent.state.recommendedInedx === index &&
          <div className="recommended">RECOMMENDED</div>
        }
      </div>
    )
  }

  navigate = (pathname, search, premium_details) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  async handleClickCurrent() {
    this.sendEvents('next');
    var final_data = {
      "premium": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].premium,
      "cover_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].sum_assured,
      "tax_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].tax_amount
    }
    final_data.product_name = this.props.parent.state.product_key;

    let group_insurance_plan_final_data = this.state.group_insurance_plan_final_data || {};
    group_insurance_plan_final_data[final_data.product_name] = final_data;
    window.localStorage.setItem('group_insurance_plan_final_data', 
    JSON.stringify(group_insurance_plan_final_data));

    this.setState({
      show_loader: true
    })

    try {

      let res2 = {};
      if (this.state.lead_id) {
        final_data.lead_id = this.state.lead_id;
        res2 = await Api.post('api/ins_service/api/insurance/bhartiaxa/lead/update', final_data)
       

        if (res2.pfwresponse.status_code === 200) {
          this.navigate('form', '', final_data);
        } else {
          this.setState({
            show_loader: false
          })
          toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
            || 'Something went wrong');
        }
      } else {
        this.navigate('form', '', final_data);
      }
    } catch (err) {
      toast('Something went wrong');
    }




  }

  sendEvents(user_action) {
    let selectedIndex =  this.state.selectedIndex || 0;
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": this.props.parent.state.product_key,
        "cover_amount": this.props.parent.state.plan_data.premium_details[selectedIndex] ?
         this.props.parent.state.plan_data.premium_details[selectedIndex].sum_assured: '',
        "premium": this.props.parent.state.plan_data.premium_details[selectedIndex] ?
        this.props.parent.state.plan_data.premium_details[selectedIndex].premium: '',
        "cover_period": 1,
        "tnc_checked": "yes"
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
        fullWidthButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        buttonTitle='Get this Plan'
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClickCurrent()}
        title={insuranceProductTitleMapper[this.props.parent ? this.props.parent.state.product_key : '']}
        classOverRideContainer="accident-plan">
        <div className="accident-plan-heading-container">
          <div className="accident-plan-heading">
            <h1 className="accident-plan-title">{this.props.parent.state.plan_data.product_name}</h1>
            <img src={provider} alt="" />
          </div>
          <div className="accident-plan-subtitle">
            {this.props.parent.state.plan_data.product_tag_line}
          </div>
        </div>
        <div className="accident-plans">
          <div style={{display: 'flex',justifyContent: 'flex-end', margin:' 0 0px 0 0'}}>
            <div style={{fontSize: '14px', lineHeight: '24px', color: '#4a4a4a',
                display: 'flex',width: 'fit-content', background: '#ede9f5',padding: '0px 10px 0 10px' }}>
              <img style={{margin: '0px 5px 0 0'}} src={this.state.instant_icon} alt="" />
              instant policy issuance
              </div>
          </div>
          <div style={{paddingTop: 20}} className="accident-plan-heading-title">Select a plan</div>
          <div className="accident-plan-list-container">
            <div className="accident-plan-list">
              {this.props.parent && this.props.parent.state.plan_data &&
                this.props.parent.state.plan_data.premium_details &&
                this.props.parent.state.plan_data.premium_details.map(this.renderPlans)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '0 15px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Benefits that are covered</div>


          <div className="plan-details">

          </div>

          {this.props.parent && this.props.parent.state.plan_data &&
            this.props.parent.state.plan_data.premium_details &&
            this.props.parent.state.plan_data.premium_details[this.state.selectedIndex || 0].product_benefits.map(this.renderBenefits)}
        </div>

        <div className="accident-plan-claim">
          <img className="accident-plan-claim-icon" src={this.state.ic_claim_assist} alt="" />
          <div>
            <div className="accident-plan-claim-title">Claim assistance</div>
            <div className="accident-plan-claim-subtitle">Call Bharti AXA on toll free 1800-103-2292</div>
          </div>
        </div>
        <div className="accident-plan-read"
          onClick={() => this.openInBrowser(this.state.quoteData.read_document, 'read_document')}>
          <img className="accident-plan-read-icon" src={this.state.ic_read} alt="" />
          <div className="accident-plan-read-text" style={styles.color}>Read Detailed Document</div>
        </div>

        <div className="CheckBlock2 accident-plan-terms" style={{}}>
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.checked}
                color="default"
                value="checked"
                name="checked"
                onChange={() => console.log('Clicked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={11}>
              <div className="accident-plan-terms-text" style={{}}>I accept <span onClick={() => this.openInBrowser(this.state.quoteData.terms_and_conditions, 'terms_and_conditions')} className="accident-plan-terms-bold" style={styles.color}>Terms and conditions</span></div>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

const PlanDetails = (props) => (
  <PlanDetailsClass
    {...props} />
);

export default PlanDetails;