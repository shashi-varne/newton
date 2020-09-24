import React, { Component } from 'react';
import { inrFormatDecimal, numDifferentiationInr } from '../../../../utils/validators';

export default class ReligarePremium extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedAddOns: [],
    };
  }

  componentDidMount() {
    const { add_ons_data = [] } = this.props.groupHealthPlanData;
    if (add_ons_data.length) {
      const selectedAddOns = add_ons_data.filter(addOn => addOn.checked);
      this.setState({ selectedAddOns: selectedAddOns || [] });
    }
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

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">Base premium</div>
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.base_premium_showable)}</div>
        </div>

        {/* TODO: move inline styles to stylesheet */}
        {this.state.selectedAddOns && this.state.selectedAddOns.length !==0 &&
          <div className="premium-addons" style={{
            margin: '30px 0 25px'
          }}>
            <div className="premium-addon-title" style={{
              fontSize: '13px',
              fontWeight: '600',
              lineHeight: '15px',
              marginBottom: '-10px',
            }}>Add on</div>
            {this.state.selectedAddOns.map((addOn, index) => 
              <div key={index} className="flex-between pi-tile" style={{ marginBottom: '-5px' }}>
                <div className="pi-tile-left">{addOn.title}</div>
                <div className="pi-tile-right">{inrFormatDecimal(addOn.selected_premium  || addOn.default_premium)}</div>
              </div>
            )}
          </div>
        }


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
          <div className="pi-tile-right">{inrFormatDecimal(this.props.plan_selected_final.net_premium)}</div>
        </div>

        <div className="flex-between pi-tile">
          <div className="pi-tile-left">GST</div>
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