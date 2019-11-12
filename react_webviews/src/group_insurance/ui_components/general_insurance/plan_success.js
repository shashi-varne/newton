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
          <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Policy</span>: Personal accident</li>
          <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Issuer</span>: Bharti AXA General Insurances</li>
          <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">COI</span>: CXGHNPOPL456</li>
          <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Sum Assured</span>: 2 lacs</li>
          <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Cover period</span>: 1 yr (20 Oct 2019 - 19 Oct 2020)</li>
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
        <div className="plan-success-heading">
          <div className="plan-success-heading-icon"><img src={congratulations} alt="" /></div>
          <div className="plan-success-heading-title">Congratulations!</div>
          <div className="plan-success-heading-subtitle">Your Bank cards & Mobile wallets are insured with <div className="plan-success-heading-subtitle-bold">Bharti AXA General Insurance.</div>
          </div>
        </div>
        <div className="plan-summary-accordion">
          <div className="accordion-container">
            <div className="Accordion">
              <div className="AccordionTitle" onClick={() => console.log('Clicked')}>
                <div className="AccordionList">
                  <span className="AccordionList1">
                    <img className="AccordionListIcon" src={(this.state.accordianTab === 'benefits') ? shrink : expand} alt="" width="20" />
                  </span>
                  <span>Benefits</span>
                </div>
              </div>
              {this.renderAccordionBody('benefits')}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default PlanSuccess;