import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read_fisdom from 'assets/ic_read_fisdom.svg';
import ic_read_myway from 'assets/ic_read_myway.svg';
import ic_claim_assist_fisdom from 'assets/ic_claim_assist_fisdom.svg';
import ic_claim_assist_myway from 'assets/ic_claim_assist_myway.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

const coverAmountMapper = {
  'PERSONAL_ACCIDENT' : {
    200000: 0,
    500000: 1,
    1000000: 2
  }
}

class PlanDetailsClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 1,
      checked: false,
      parent: this.props.parent || {
        'plan_data' : {

        }
      },
      type: getConfig().productName,
    };

    this.renderPlans = this.renderPlans.bind(this);
    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {
    this.setState({
      ic_claim_assist: this.state.type !== 'fisdom' ? ic_claim_assist_myway : ic_claim_assist_fisdom,
      ic_read: this.state.type !== 'fisdom' ? ic_read_myway : ic_read_fisdom
    })

    let premium_details = {
      "product_name":this.props.parent.state.product_key,
      cover_amount: '',
      premium: '',
      tax_amount: ''
    };

    console.log(premium_details)
    try {

      if(this.state.lead_id) {
        let res = await Api.get('ins_service/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)
       
        this.setState({
          show_loader: false
        })
        if (res.pfwresponse.status_code === 200) {

          var leadData = res.pfwresponse.result.lead;

          Object.keys(premium_details).forEach((key) => {
            premium_details[key] = leadData[key]
          })

          let selectedIndex = coverAmountMapper[this.props.parent.state.product_key][premium_details.cover_amount];

          this.setState({
            selectedIndex: selectedIndex
          })

        } else {
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message
            || 'Something went wrong');
        }
      } else {
        this.setState({
          show_loader: false
        })
      }

    } catch (err) {
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
    console.log("selecting :" + index)
    console.log(this.props.parent.state.plan_data.premium_details[index])
    this.setState({ 
      selectedIndex: index 
    });
  }

  renderBenefits = (props, index) => {
    return (
      <div key ={index} className="plan-details-item">
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div>
        <div className={`plan-details-text ${(props.isDisabled && this.state.selectedIndex === 0) ? 'disabled' : ''}`}>{props.disc}</div>
        </div>
      </div>
    )
  }

  renderPlans(props, index) {
    return (
      <div key={index}
        className={`accident-plan-item ${(this.state.selectedIndex === index) ? 'activePlan' : ''}`}
        onClick={() => this.selectPlan(index)}>
        <div className="accident-plan-item1">Cover amount</div>
        <div className="accident-plan-item2">{props.sum_assured}</div>
        <div className="accident-plan-item3">
          <span className="accident-plan-item4">in</span>
          <span className="accident-plan-item-color">₹{props.premium}/year</span></div>
        {props.plus_benefit && 
          <div className="accident-plan-benefit">+2 Benefits</div>
        }
        {this.state.parent.state.recommendedInedx === index && 
          <div className="recommended">RECOMMENDED</div>
        }
      </div>
    )
  }

  navigate = (pathname, search,premium_details) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  handleClick = async (final_data) => {
    
    this.navigate('form','', final_data);
   
  }


  async handleClickCurrent() {
    var final_data = {
      "premium": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].premium,
      "cover_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].sum_assured,
      "tax_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].tax_amount
    }

    

    final_data.product_name = this.props.parent.state.product_key;

    this.setState({
      show_loader: true
    })

    let res2 = {};
    if(this.state.lead_id) {
      final_data.lead_id = this.state.lead_id;
      res2 = await Api.post('ins_service/api/insurance/bhartiaxa/lead/update', final_data)

      if (res2.pfwresponse.status_code === 200) {
        this.navigate('form','', final_data);
      } else {
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }
    } else {
      this.navigate('form','', final_data);
    }
    

    
    
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Get this Plan'
        onlyButton={true}
        showLoader={this.state.show_loader || this.props.parent.state.show_loader}
        handleClick={()=> this.handleClickCurrent()}
        title="Accident"
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
          <div className="accident-plan-heading-title">Select a plan</div>
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
              this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].product_benefits.map(this.renderBenefits)}
        </div>

        <div className="accident-plan-claim">
          <img className="accident-plan-claim-icon" src={this.state.ic_claim_assist} alt="" />
          <div>
            <div className="accident-plan-claim-title">Claim assistance</div>
            <div className="accident-plan-claim-subtitle">Call Bharti AXA on toll free 1800-103-2292</div>
          </div>
        </div>
        <div className="accident-plan-read">
          <img className="accident-plan-read-icon" src={this.state.ic_read} alt="" />
          <div className="accident-plan-read-text">Read Detailed Document</div>
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
              <div className="accident-plan-terms-text" style={{}}>I accept with the <span className="accident-plan-terms-bold" style={{}}>Terms and condition</span></div>
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