import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import congratulations from 'assets/congratulations_illustration.svg';

class PlanSuccess extends Component {
  state = {
    accordianTab: 'benefits'
  }

  renderAccordionBody = (name) => {
    return (
      <div className="AccordionBody">
        <ul>
          <li style={{ color: '#878787', fontSize: '14px', fontWeight: '400' }}><span style={{ fontWeight: '500' }}>Policy</span>: Personal accident</li>
          <li style={{ color: '#878787', fontSize: '14px', fontWeight: '400' }}><span style={{ fontWeight: '500' }}>Issuer</span>: Bharti AXA General Insurances</li>
          <li style={{ color: '#878787', fontSize: '14px', fontWeight: '400' }}><span style={{ fontWeight: '500' }}>COI</span>: CXGHNPOPL456</li>
          <li style={{ color: '#878787', fontSize: '14px', fontWeight: '400' }}><span style={{ fontWeight: '500' }}>Sum Assured</span>: 2 lacs</li>
          <li style={{ color: '#878787', fontSize: '14px', fontWeight: '400' }}><span style={{ fontWeight: '500' }}>Cover period</span>: 1 yr (20 Oct 2019 - 19 Oct 2020)</li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <Container
        title="Success"
        classOverRideContainer="plan-success"
      >
        <div style={{ margin: '30px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}><img src={congratulations} alt="" /></div>
          <div style={{ color: '#4a4a4a', fontSize: '16px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>Congratulations!</div>
          <div style={{ color: '#878787', fontSize: '14px', lineHeight: '22px' }}>Your Bank cards & Mobile wallets are insured with <div style={{ fontWeight: '500' }}>Bharti AXA General Insurance.</div>
          </div>
        </div>
        <div style={{ marginTop: 10, marginBottom: 30 }}>
          <div className="accordion-container">
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => console.log('Clicked')}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                  <span style={{ marginRight: 10 }}>
                    <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'benefits') ? shrink : expand} alt="" width="20" />
                  </span>
                  <span>Benefits</span>
                </div>
              </div>
              {this.renderAccordionBody('benefits')}
            </div>
            <div className="accordion-container">
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => console.log('Clicked')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'benefits') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Benefits</span>
                  </div>
                </div>
                {this.renderAccordionBody('benefits')}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default PlanSuccess;