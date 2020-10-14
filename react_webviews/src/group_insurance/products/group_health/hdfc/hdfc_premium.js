import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';
import { childeNameMapper } from '../../../constants';


export default class HDFCPremium extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIndPremium = (props, index) => {
    return (
      <div key={index} className="nf-info flex-between" style={{ margin: '0 0 6px 0' }}>
        <div style={{ textTransform: 'capitalize' }}>{childeNameMapper(props.key)}</div>
        <div>{inrFormatDecimal(this.props.properties.base_premium / this.props.properties.total_members)}</div>
      </div>
    )
  }

  render() {
    return (

      <div className="premium-info">
        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Sum insured</div>
          <div className="pi-tile-right">
            {numDifferentiationInr(this.props.properties.type_of_plan === 'NF' ? this.props.properties.sum_assured * this.props.properties.total_members :
              this.props.properties.sum_assured)}
          </div>
        </div>
         {this.props.properties.type_of_plan === 'NF' &&
          <div className="nf-info">
            {(`${numDifferentiationInr(this.props.properties.sum_assured)} x ${this.props.properties.total_members}`)}
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

        {this.props.properties.type_of_plan === 'NF' &&
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
            {/* {this.props.properties.total_discount_percentage}% */}
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
          <div className="pi-tile-left">GST & other taxes</div>
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