import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';

export default class ReligarePremium extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddOns: [],
    };
  }

  render() {
    return (

      <div className="premium-info">
        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Sum insured</div>
          <div className="pi-tile-right">
            {numDifferentiationInr(this.props.type_of_plan === 'NF' ? this.props.sum_assured * this.props.total_members :
              this.props.sum_assured)}
          </div>
        </div>

        {this.props.type_of_plan === 'NF' && this.props.account_type !== 'self' &&
          <div className="nf-info">
            {(`${numDifferentiationInr(this.props.sum_assured)} x ${this.props.total_members}`)}
          </div>
        }
       

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Cover period</div>
      <div className="pi-tile-right">{this.props.tenure} year{this.props.tenure>'1' && <span>s</span>}</div>
        </div>

        <div className="generic-hr"></div>

        <div className="page-title">
          Premium details
        </div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Base premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.base_premium)}</div>
        </div>

        {this.props.add_ons && this.props.add_ons.length !==0 &&
          <div className="premium-addons" style={{margin: '30px 0 25px'}}>
            <div className="premium-addon-title" style={{
              fontSize: '13px',
              fontWeight: '600',
              lineHeight: '15px',
              marginBottom: '-10px',
            }}>Add on</div>
            {this.props.add_ons.map((addOn, index) => 
              <div key={index} className="flex-between pi-tile" style={{ marginBottom: '-5px' }}>
                <div className="pi-tile-left">{addOn.title}</div>
                <div className="pi-tile-right">{inrFormatDecimal(addOn.price  || addOn.default_premium)}</div>
              </div>
            )}
          </div>
        }


        {this.props.total_discount > 0 &&
          <div className="flex-between pi-tile">
            {/* {this.props.total_discount_percentage}% */}
            <div className="pi-tile-left">Total discount</div>
            <div className="pi-tile-right">{inrFormatDecimal(this.props.total_discount)}</div>
          </div>
        }



        <div className="generic-hr"></div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Net premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.net_premium)}</div>
        </div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">GST</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.gst_tax)}</div>
        </div>

        <div className="generic-hr"></div>

        <div className="flex-between pi-tile" style={{ fontWeight: 600 }}>
          <div className="pi-tile-left">Total payable</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.total_amount)}</div>
        </div>

        <div className="generic-hr"></div>
      </div>
    );
  }
}