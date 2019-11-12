import React, { Component } from 'react';
import Container from '../common/Container';

class Report extends Component {
  render() {
    return (
      <Container
        noFooter={true}
        title="Insurance report"
        classOverRideContainer="report"
      >
        <div className="card">
          <div className="report-color-state">POLICY ISSUED</div>
          <div className="report-ins-name">Health insurance (Indemnity)</div>
          <div className="report-cover">
            <div className="report-cover-amount"><span>Cover amount:</span> 2,00,000</div>
            <div className="report-cover-amount"><span>Premium:</span> 500/yr</div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Report;