import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import provider from 'assets/provider.svg';

class PlanSummary extends Component {
  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Make Payment'
        onlyButton={true}
        title="Summary"
        classOverRideContainer="plan-summary"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
          <div style={{ color: '#160d2e', fontSize: '20px', lineHeight: '28px', fontWeight: '500', padding: '10px' }}>Personal Accident</div>
          <img src={provider} alt="" />
        </div>
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f8f8f8' }}>
            <div style={{ color: '#878787', fontSize: '14px' }}>Cover amount</div>
            <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500' }}>2Lacs</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#fff' }}>
            <div style={{ color: '#878787', fontSize: '14px' }}>Cover period</div>
            <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500' }}>1 year</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f8f8f8' }}>
            <div style={{ color: '#878787', fontSize: '14px' }}>Policy start date</div>
            <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500' }}>20 october 2019</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#fff' }}>
            <div style={{ color: '#878787', fontSize: '14px' }}>End date</div>
            <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500' }}>19 October 2020</div>
          </div>
        </div>
        <div style={{ background: '#fff', marginTop: '20px', padding: '15px 15px' }}>
          <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>Premium details:</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div style={{ color: '#878787', fontSize: '13px' }}>Base premium</div>
            <div style={{ color: '#878787', fontSize: '14px', fontWeight: '500' }}>₹200</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div style={{ color: '#878787', fontSize: '13px' }}>GST & taxes</div>
            <div style={{ color: '#878787', fontSize: '14px', fontWeight: '500' }}>₹36</div>
          </div>
          <div style={{ height: '2px', background: '#cecece', width: '100%' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px' }}>
            <div style={{ color: '#878787', fontSize: '14px' }}>Total payable</div>
            <div style={{ color: '#4a4a4a', fontSize: '14px', fontWeight: '500' }}>₹ 236</div>
          </div>
        </div>
      </Container>
    );
  }
}

export default PlanSummary;