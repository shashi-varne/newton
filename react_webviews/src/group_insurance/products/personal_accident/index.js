import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import ic_read from 'assets/ic_read.svg';
import ic_claim_assist from 'assets/ic_claim_assist.svg';
import { Plan1, Plan2 } from './plan-details';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class Accident extends Component {
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
            <div className={(this.state.selectedPlan == 1) ? 'activePlan': ''} onClick={() => this.selectPlan(1)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
            </div>
            <div className={(this.state.selectedPlan == 2) ? 'activePlan': ''} onClick={() => this.selectPlan(2)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
              <div style={{ color: '#6e54b7', fontSize: '10px', marginTop: '10px' }}>+2 Benefits</div>
            </div>
            <div className={(this.state.selectedPlan == 3) ? 'activePlan': ''} onClick={() => this.selectPlan(3)} style={{ background: '#fff', borderRadius: '5px', padding: '15px', minWidth: '100px', boxShadow: '0px 2px 6px 0px rgba(102,120,121,0.25)', marginRight: '15px' }}>
              <div style={{ color: '#6f6f6f', fontSize: '10px', lineHeight: '16px', marginBottom: '5px' }}>Cover amount</div>
              <div style={{ color: '#160d2e', fontSize: '14px' }}>2 Lakh</div>
              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}><span style={{ color: '#6f6f6f', fontSize: '10px', marginRight: '5px' }}>in</span> <span style={{ color: '#4f2da7' }}>₹200/year</span></div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '40px', padding: '0 15px' }}>
          <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Benefits that are covered</div>
          {this.state.selectedPlan == 1 && <Plan1 />}
          {this.state.selectedPlan == 2 && <Plan2 />}
          {this.state.selectedPlan == 3 && <Plan1 />}
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
        <div className="CheckBlock2" style={{ padding: '0 15px',margin: '10px 0' }}>
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