import React, { Component } from 'react';
import Container from '../../common/Container';
import provider from 'assets/provider.svg';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';

class ReportDetails extends Component {
  state = {
    accordianTab: false
  }

  render() {
    return (
      <Container
        noFooter={true}
        title=""
        classOverRideContainer="report-detail"
      >
        <div className="card">
          <div className="report-detail-header">
            <div className="report-detail-icon">
              <img src={provider} alt="" />
            </div>
            <div>
              <div className="report-detail-ins-name">Health Insurance (Indeminity)</div>
              <div className="report-detail-status">Status: <span>Poilcy Issued</span></div>
            </div>
          </div>
          <div className="report-detail-summary">
            <div className="report-detail-summary-item"><span>Policy:</span> Health insurance</div>
            <div className="report-detail-summary-item"><span>Issuer:</span> Bharti AXA General Insurances</div>
            <div className="report-detail-summary-item"><span>Policy number:</span> CXGHNPOPL456</div>
          </div>
        </div>
        <div className="report-detail-download">
          {/* <img src={} alt="" /> */}
          <div className="report-detail-download-text">Download Policy</div>
        </div>
        <div className="Accordion">
          <div className="AccordionTitle" onClick={() => console.log('KK')}>
            <div className="AccordionList">
              <span className="AccordionList1">
                <img className="AccordionListIcon" src={(this.state.accordianTab) ? shrink : expand} alt="" width="20" />
              </span>
              <span>Benefits</span>
            </div>
          </div>
          <div>
            {/* Render body */}
          </div>
        </div>
      </Container>
    );
  }
}

export default ReportDetails;