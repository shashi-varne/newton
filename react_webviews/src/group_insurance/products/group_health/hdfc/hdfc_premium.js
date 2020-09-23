import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';


export default class HDFCPremium extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (

      <div className="premium-info">
        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Sum insured</div>
          <div className="pi-tile-right">
            {numDifferentiationInr(this.props.type_of_plan === 'NF' ? this.props.plan_selected_final.sum_assured * this.props.total_member :
              this.props.plan_selected_final.sum_assured)}
          </div>
        </div>
        {this.props.type_of_plan === 'NF' &&
          <div className="nf-info">
            {(`${numDifferentiationInr(this.props.plan_selected_final.sum_assured)} x ${this.props.total_member}`)}
          </div>
        }

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Cover period</div>
          <div className="pi-tile-right">{this.props.plan_selected_final.tenure} year</div>
        </div>

        <div className="generic-hr"></div>

        <div className="page-title">
          Premium details
        </div>

        {this.props.type_of_plan === 'NF' &&
          <div>
            <div className="flex-between pi-tile">
              <div className="pi-tile-left">Individual premium</div>
            </div>
            {this.props.final_dob_data.map(this.renderIndPremium)}
            <div className="generic-hr"></div>
          </div>
        }
        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Base premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.base_premium)}</div>
        </div>


        {this.props.plan_selected_final.total_discount > 0 &&
          <div className="flex-between pi-tile">
            {/* {this.props.plan_selected_final.total_discount_percentage}% */}
            <div className="pi-tile-left">Total discount</div>
            <div className="pi-tile-right">-{inrFormatDecimal(this.props.plan_selected_final.total_discount)}</div>
          </div>
        }



        <div className="generic-hr"></div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Net premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.base_premium -
            this.props.plan_selected_final.total_discount)}</div>
        </div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">GST & other taxes</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.gst_tax)}</div>
        </div>

        <div className="generic-hr"></div>

        <div className="flex-between pi-tile" style={{ fontWeight: 600 }}>
          <div className="pi-tile-left">Total payable</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.total_amount)}</div>
        </div>

        <div className="generic-hr"></div>
      </div>
    );
  }
}