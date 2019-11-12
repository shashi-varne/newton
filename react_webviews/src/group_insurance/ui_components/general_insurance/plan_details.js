import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read from 'assets/ic_read.svg';
import ic_claim_assist from 'assets/ic_claim_assist.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import ic_pa_b1 from 'assets/ic_pa_b1.svg';
import ic_pa_b2 from 'assets/ic_pa_b2.svg';
import ic_pa_b3 from 'assets/ic_pa_b3.svg';
import ic_pa_b4 from 'assets/ic_pa_b4.svg';
import ic_pa_b5 from 'assets/ic_pa_b5.svg';

const Plan1 = () => {
  return (
    <div className="plan-details">
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b1} alt="" />
        <div>
          <div className="plan-details-text">Lumpsum pay out to your family in case of accidental death</div>
        </div>
      </div>
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b2} alt="" />
        <div>
          <div className="plan-details-text">Get yourself covered for permanent total or partial disablement</div>
        </div>
      </div>
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b3} alt="" />
        <div>
          <div className="plan-details-text">Protection against accidental burns</div>
        </div>
      </div>
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b4} alt="" />
        <div>
          <div className="plan-details-text">Allowances for ambulance and last rites (Select higher plans to get this benefit)</div>
        </div>
      </div>
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b5} alt="" />
        <div>
          <div className="plan-details-text">Allowances for purchase of blood (Select higher plans to get this benefit)</div>
        </div>
      </div>
    </div>
  );
}

const Plan2 = () => {
  return (
    <div className="plan-details">
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b1} alt="" />
        <div>
          <div className="plan-details-text">Lumpsum pay out to your family in case of accidental death</div>
        </div>
      </div>
      <div className="plan-details-item">
        <img className="plan-details-icon" src={ic_pa_b2} alt="" />
        <div>
          <div className="plan-details-text">Get yourself covered for permanent total or partial disablement</div>
        </div>
      </div>
    </div>
  );
}

class PlanDetails extends Component {
  state = {
    selectedPlan: 1,
    checked: false
  }

  selectPlan = (index) => {
    this.setState({ selectedPlan: index });
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Get this Plan'
        onlyButton={true}
        title="Accident"
        classOverRideContainer="accident-plan">
        <div className="accident-plan-heading-container">
          <div className="accident-plan-heading">
            <h1 className="accident-plan-title">Personal Accident</h1>
            <img src={provider} alt="" />
          </div>
          <div className="accident-plan-subtitle">
            Cover your financial losses  against accidental death and disability
          </div>
        </div>
        <div className="accident-plans">
          <div className="accident-plan-heading-title">Select a plan</div>
          <div className="accident-plan-list">
            <div className={`accident-plan-item ${(this.state.selectedPlan === 1) ? 'activePlan': ''}`} onClick={() => this.selectPlan(1)}>
              <div className="accident-plan-item1">Cover amount</div>
              <div className="accident-plan-item2">2 Lakh</div>
              <div className="accident-plan-item3"><span className="accident-plan-item4">in</span> <span className="accident-plan-item-color">₹200/year</span></div>
            </div>
            <div className={`accident-plan-item ${(this.state.selectedPlan === 2) ? 'activePlan': ''}`} onClick={() => this.selectPlan(2)}>
              <div className="accident-plan-item1">Cover amount</div>
              <div className="accident-plan-item2">2 Lakh</div>
              <div className="accident-plan-item3"><span className="accident-plan-item4">in</span> <span className="accident-plan-item-color">₹200/year</span></div>
              <div className="accident-plan-benefit">+2 Benefits</div>
              <div className="recommended">RECOMMENDED</div>
            </div>
            <div className={`accident-plan-item ${(this.state.selectedPlan === 3) ? 'activePlan': ''}`} onClick={() => this.selectPlan(3)}>
              <div className="accident-plan-item1">Cover amount</div>
              <div className="accident-plan-item2">2 Lakh</div>
              <div className="accident-plan-item3"><span className="accident-plan-item4">in</span> <span className="accident-plan-item-color">₹200/year</span></div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '40px', padding: '0 15px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Benefits that are covered</div>
          {this.state.selectedPlan === 1 && <Plan1 />}
          {this.state.selectedPlan === 2 && <Plan2 />}
          {this.state.selectedPlan === 3 && <Plan1 />}
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
        <div className="CheckBlock2 accident-plan-terms" style={{  }}>
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
              <div className="accident-plan-terms-text" style={{  }}>I accept with the <span className="accident-plan-terms-bold" style={{  }}>Terms and condition</span></div>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default PlanDetails;