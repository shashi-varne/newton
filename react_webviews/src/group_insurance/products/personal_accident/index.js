import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read from 'assets/ic_read.svg';
import ic_claim_assist from 'assets/ic_claim_assist.svg';
import { Plan1, Plan2 } from './plan-details';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class Accident extends Component {
  state = {
    selectedPlan: 1,
    checked: false
  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    let { params } = this.props.location;
    this.setState({
      premium_details: params ? params.premium_details : {},
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {
    try {
      const res = await Api.get('ins_service/api/insurance/bhartiaxa/get/quote?product_name=personal_accident')

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var resultData = res.pfwresponse.result;
        console.log(resultData);

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

    var product_benefits = [
      {
        'disc': 'Lumpsum payout to your family in case of Accidental Death',
        'key' : 'lumpsum_payout',
        'icon': ''
      },
      {
        'disc': 'Coverage against Permanent Total or Partial Disablement',
        'key' : 'disablement_coverage',
        'icon': ''
      },
      {
        'disc': 'Protection against accidental burns',
        'key' : 'accidental_burns_protection',
        'icon': ''
      },
      {
        'disc': 'Allowances for ambulance and last rites (for plan 2 & 3 only)',
        'key' : 'last_rites',
        'icon': ''
      },
      {
        'disc': 'Allowances for purchase of blood (for plan 2 & 3 only)',
        'key' : 'blood_allowence',
        'icon': ''
      }
    ]

    var plan_data = {
      'name': 'Personal Accident',
      'key': 'personal_accident',
      'logo': '',
      'premium_details': [
        {
          "sum_assured": 200000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection'],
          "premium": "250",
          "tax_amount": "",
          "plus_benefit": ''
        },
        {
          "sum_assured": 500000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "500",
          "plus_benefit": ''
        },
        {
          "sum_assured": 1000000,
          "product_benefits_included": ['lumpsum_payout', 'disablement_coverage', 
          'accidental_burns_protection', 'last_rites', 'blood_allowence'],
          "premium": "990",
          "plus_benefit": ''
        }
      ]
    }

    plan_data.premium_details.forEach(function (premium, index) {
      
      plan_data.premium_details[index].product_benefits = []
      product_benefits.forEach(function (benefit, index2) {
        if(premium.product_benefits_included.indexOf(benefit.key) === -1) {
          benefit.isDisabled = true;
        }

        plan_data.premium_details[index].product_benefits.push(benefit)
      });
    });

    console.log(plan_data)

    this.setState({
      plan_data: plan_data
    })
  }

  navigate = (pathname, search,premium_details) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  selectPlan = (index) => {
    this.setState({ selectedPlan: index });
  
  }

  handleClick = async () => {
    var premium_details = {
      "premium": this.state.plan_data.premium_details[this.state.selectedPlan].premium,
      "cover_amount": this.state.plan_data.premium_details[this.state.selectedPlan].cover_amount,
      "tax_amount": this.state.plan_data.premium_details[this.state.selectedPlan].tax_amount
    }

    let res2 = {};
      if (this.state.lead_id) {
        premium_details.lead_id = this.state.lead_id;
        res2 = await Api.post('api/insurance/bhartiaxa/lead/update', premium_details)
      } else {
        res2 = await Api.post('api/insurance/bhartiaxa/lead/create', premium_details)
      }
      

      if (res2.pfwresponse.status_code === 200) {

        if(!this.state.lead_id) {
          var id = res2.pfwresponse.result.lead.id;
          window.localStorage.setItem('group_insurance_lead_id_selected', id || '');
        }
        this.navigate('form','', premium_details);
      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }

   
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Get this Plan'
        onlyButton={true}
        handleClick={this.handleClick}
        title="Accident"
        classOverRideContainer="accident-plan">
        <div style={{ marginTop: '10px', marginBottom: '30px', padding: '0 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h1 style={{ color: '#160d2e', fontSize: '20px', lineHeight: '28px', fontWeight: '500' }}>Personal Accident</h1>
            <img src={provider} alt="" />
          </div>
          <div style={{ color: '#24154c', fontSize: '14px', lineHeight: '22px' }}>
            Cover your financial losses  against accidental death and disability
          </div>
        </div>
        <div style={{ background: '#f4f3f6', paddingTop: '20px', paddingBottom: '20px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', padding: '0 15px' }}>Select a plan</div>
          <div style={{ display: 'flex', marginTop: '20px', flexDirection: 'row', boxSizig: 'border-box', overflowX: 'auto', paddingBottom: '15px', paddingLeft: '15px' }}>
            <div className={(this.state.selectedPlan === 1) ? 'activePlan' : ''} onClick={() => this.selectPlan(1)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
            </div>
            <div className={(this.state.selectedPlan === 2) ? 'activePlan' : ''} onClick={() => this.selectPlan(2)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
              <div style={{ color: '#6e54b7', fontSize: '10px', marginTop: '10px' }}>+2 Benefits</div>
            </div>
            <div className={(this.state.selectedPlan === 3) ? 'activePlan' : ''} onClick={() => this.selectPlan(3)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '40px', padding: '0 15px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Benefits that are covered</div>
          {this.state.selectedPlan === 1 && <Plan1 />}
          {this.state.selectedPlan === 2 && <Plan2 />}
          {this.state.selectedPlan === 3 && <Plan1 />}
        </div>
        <div style={{ margin: '40px 0', display: 'flex', alignItems: 'flex-start', padding: '0 15px' }}>
          <img src={ic_claim_assist} alt="" style={{ marginRight: '10px' }} />
          <div>
            <div style={{ color: '#160d2e', fontSize: '14px', marginBottom: '10px', fontWeight: '500' }}>Claim assistance</div>
            <div style={{ color: '#6d7278', fontSize: '14px' }}>Call Bharti AXA on toll free 1800-103-2292</div>
          </div>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
          <img src={ic_read} alt="" style={{ marginRight: '10px' }} />
          <div style={{ color: '#4f2da7', fontSize: '14px' }}>Read Detailed Document</div>
        </div>
        <div className="CheckBlock2" style={{ padding: '0 15px', margin: '10px 0' }}>
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
              <div style={{ color: '#24154c', fontSize: '14px' }}>I accept with the <span style={{ color: '#4f2da7', fontWeight: '500' }}>Terms and condition</span></div>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default Accident;