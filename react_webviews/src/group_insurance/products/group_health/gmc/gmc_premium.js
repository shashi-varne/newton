import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';


export default class ReligarePremium extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

      <div className="premium-info">
        <div className="flex-between pi-tile premium-summary-bottom">
          <div className="pi-tile-left">Sum insured</div>
          <div className="pi-tile-right">
            {numDifferentiationInr(this.props.sum_assured)}
          </div>
        </div>

        <div className="flex-between pi-tile premium-summary-bottom">
          <div className="pi-tile-left">Cover period</div>
        <div className="pi-tile-right">{this.props.tenure} year</div>
        </div>

        <div className="flex-between pi-tile premium-summary-bottom" style={{marginBottom: '32px'}}>
          <div className="pi-tile-left">Payment frequency</div>
        <div className="pi-tile-right">{this.props.payment_frequency.toLowerCase()}</div>
        </div>
        
        <div className="generic-hr"></div>

        <div className="page-title">
          Premium details
        </div>

        <div className="flex-between pi-tile premium-summary-bottom">
          <div className="pi-tile-left">Base premium</div>
        <div className="pi-tile-right">{inrFormatDecimal(this.props.base_premium)}</div>
        </div>
        
        <div className="flex-between pi-tile premium-summary-bottom" style={{marginBottom: '21px'}}>
          <div className="pi-tile-left">GST</div>
        <div className="pi-tile-right">{inrFormatDecimal(this.props.gst_tax)}</div>
        </div>

        <div className="generic-hr"></div>
        <div className="flex-between pi-tile" style={{ fontWeight: 600 }}>
          <div className="pi-tile-left">Total payable per year</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.total_amount)}</div>
        </div>
        <div className="generic-hr"></div>
        
      </div>
    );
  }
}