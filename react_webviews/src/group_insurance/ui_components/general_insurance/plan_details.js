import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read from 'assets/ic_read.svg';
import ic_claim_assist from 'assets/ic_claim_assist.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

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
    };

    this.renderPlans = this.renderPlans.bind(this);
    this.handleClickCurrent = this.handleClickCurrent.bind(this);

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
    this.setState({ 
      selectedIndex: index 
    });
  }

  renderBenefits(props, index) {
    return (
      <div key ={index} className="plan-details-item">
        <img className="plan-details-icon" src={props.icon} alt="" />
        <div>
        <div className="plan-details-text">{props.disc}</div>
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

  handleClickCurrent() {
    var premium_details = {
      "premium": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].premium,
      "cover_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].sum_assured,
      "tax_amount": this.props.parent.state.plan_data.premium_details[this.state.selectedIndex].tax_amount
    }
    this.props.parent.handleClick(premium_details);
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Get this Plan'
        onlyButton={true}
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
          <div className="accident-plan-list">
            {this.props.parent && this.props.parent.state.plan_data &&
              this.props.parent.state.plan_data.premium_details &&
              this.props.parent.state.plan_data.premium_details.map(this.renderPlans)}
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
          <img className="accident-plan-claim-icon" src={ic_claim_assist} alt="" />
          <div>
            <div className="accident-plan-claim-title">Claim assistance</div>
            <div className="accident-plan-claim-subtitle">Call Bharti AXA on toll free 1800-103-2292</div>
          </div>
        </div>
        <div className="accident-plan-read">
          <img className="accident-plan-read-icon" src={ic_read} alt="" />
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