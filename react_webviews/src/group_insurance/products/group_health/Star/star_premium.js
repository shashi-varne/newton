import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';


export default class StarPremium extends Component {
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
            {numDifferentiationInr(this.props.properties.type_of_plan === 'NF' ? this.props.properties.sum_assured * this.props.total_members :
              this.props.properties.sum_assured)}
          </div>
        </div>
        {this.props.type_of_plan === 'NF' &&
          <div className="nf-info">
            {(`${numDifferentiationInr(this.props.properties.sum_assured)} x ${this.props.total_members}`)}
          </div>
        }

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Cover period</div>
      <div className="pi-tile-right">{this.props.properties.tenure} year{this.props.properties.tenure>'1' && <span>s</span>}</div>
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
            {this.props.properties.members.map(this.renderIndPremium)}
            <div className="generic-hr"></div>
          </div>
        }
        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Base premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.properties.base_premium)}</div>
        </div>


        {this.props.properties.discount_amount > 0 &&
          <div className="flex-between pi-tile">
            <div className="pi-tile-left">Total discount</div>
            <div className="pi-tile-right">{inrFormatDecimal(this.props.properties.discount_amount)}</div>
          </div>
        }



        <div className="generic-hr"></div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Net premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.properties.net_premium)}</div>
        </div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">GST</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.properties.gst_tax)}</div>
        </div>

        <div className="generic-hr"></div>

        <div className="flex-between pi-tile" style={{ fontWeight: 600 }}>
          <div className="pi-tile-left">Total payable</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.properties.total_amount)}</div>
        </div>

        <div className="generic-hr"></div>
      </div>
    );
  }
}