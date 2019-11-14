import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import congratulations from 'assets/congratulations_illustration.svg';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';

const product_config = {
  'PERSONAL_ACCIDENT' : {
    'top_title1' : 'You’re insured against any unfortunate accidental events with',
    'top_title2' : 'Bharti AXA General Insurance.'
  },
  'HOSPICASH' : {
    'top_title1' : 'You have successfully insured yourself against Hospital expenses with',
    'top_title2' : 'Bharti AXA General Insurance.'
  },
  'SMART_WALLET' : {
    'top_title1' : 'Your Bank cards & Mobile wallets are insured with',
    'top_title2' : 'Bharti AXA General Insurance.'
  }
}

class PlanSuccessClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accordianTab: 'policy',
      lead_data: {

      },
      show_loader: true,
      accordians_data: []
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);
    this.renderAccordions = this.renderAccordions.bind(this);

  }

  componentWillMount() {

    let lead_id = window.localStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      lead_id: lead_id || ''
    })

  }

  async componentDidMount() {

    try {

      let res = await Api.get('ins_service/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {


        let lead_data = res.pfwresponse.result.lead;
        console.log(lead_data);

        let accordians_data = [
          {
            'key': 'policy',
            'name': 'Policy Info'
          },
          {
            'key': 'personal',
            'name': 'Personal'
          },
          {
            'key': 'nominee',
            'name': 'Nominee'
          },
          {
            'key': 'address',
            'name': 'Address'
          }
        ]

        if (lead_data.nominee) {
          let obj = {
            'key': 'nominee',
            'name': 'Nominee'
          };

          accordians_data.splice(1, 0, obj);
        }

        this.setState({
          lead_data: lead_data,
          accordians_data: accordians_data
        })
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }




  }

  async handleClickCurrent() {


  }

  navigate = (pathname) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  toggleAccordian = (accordianTab) => {
    if (this.state.accordianTab === accordianTab) {
      this.setState({
        accordianTab: ''
      });
      return;
    }
    this.setState({
      accordianTab: accordianTab
    });
  }

  getAddress = (addr) => {
    return (
      <div>
        {addr.address_line + ', ' +
          addr.landmark + ', ' +
          addr.pincode + ', ' +
          addr.city + ', ' +
          this.capitalize(addr.state) + ', ' +
          this.capitalize(addr.country)
        }
      </div>
    );
  }

  capitalize = (string) => {
    if (!string) {
      return;
    }
    return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase(); })
  }

  renderAccordionBody = (name) => {

    if (name === 'policy') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Policy: <span>{this.state.lead_data.policy.product_title}</span></li>
            <li>Issuer: <span>{this.state.lead_data.policy.issuer}</span></li>
            <li>COI: <span>{this.state.lead_data.policy.master_policy_number}</span></li>
            <li>Sum Assured: <span>{this.state.lead_data.cover_amount}</span></li>
            <li>Cover period: <span>{this.state.lead_data.product_coverage}</span></li>

            {/* <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Policy</span>: Personal accident</li>
            <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Issuer</span>: Bharti AXA General Insurances</li>
            <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">COI</span>: CXGHNPOPL456</li>
            <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Sum Assured</span>: 2 lacs</li>
            <li className="AccordionBodyItem"><span className="AccordionBodyItemBold">Cover period</span>: 1 yr (20 Oct 2019 - 19 Oct 2020)</li> */}
          </ul>
        </div>
      );
    } else if (name === 'personal') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.lead_data.name}</span></li>
            <li>DOB: <span>{this.state.lead_data.dob}</span></li>
            <li>Mobile: <span>{this.state.lead_data.mobile_no}</span></li>
            <li>Email: <span>{this.state.lead_data.email}</span></li>
            <li>Marital status: <span>{this.capitalize(this.state.lead_data.marital_status)}</span></li>
            <li>Gender: <span>{this.capitalize(this.state.lead_data.gender)}</span></li>
          </ul>
        </div>
      );
    } else if (name === 'nominee') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.lead_data.name}</span></li>
            <li>Relationship: <span>{this.capitalize(this.state.lead_data.relationship)}</span></li>
          </ul>
        </div>
      );
    } else if (name === 'address') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>
              Permanent address:
                <div>
                <span style={{ wordWrap: 'break-word' }}>
                  {this.getAddress(this.state.lead_data.permanent_address)}
                </span>
              </div>
            </li>
          </ul>
        </div>
      );
    } else {
      return null;
    }

  }

  renderAccordions(props, index) {
    return (
      <div key={index} className="plan-summary-accordion">
        <div className="accordion-container">
          <div className="Accordion">
            <div className="AccordionTitle" onClick={() => this.toggleAccordian(props.key)}>
              <div className="AccordionList">
                <span className="AccordionList1">
                  <img className="AccordionListIcon" src={(this.state.accordianTab === props.key) ? shrink : expand} alt="" width="20" />
                </span>
                <span>{props.name}</span>
              </div>
            </div>
            {this.state.accordianTab === props.key && this.renderAccordionBody(props.key)}
          </div>
        </div>
      </div>
    )
  }

  getProductKey() {
    if (this.props.parent) {
      return this.props.parent.state.product_key;
    }

    return '';
  }

  render() {
    console.log(this.props)
    return (
      <Container
        title="Success"
        classOverRideContainer="plan-success"
        showLoader={this.state.show_loader}
      >
        <div className="plan-success-heading">
          <div className="plan-success-heading-icon"><img src={congratulations} alt="" /></div>
          <div className="plan-success-heading-title">Congratulations!</div>
          <div className="plan-success-heading-subtitle">{product_config[this.getProductKey()].top_title1} <span className="plan-success-heading-subtitle-bold">
            {product_config[this.getProductKey()].top_title2}</span>
          </div>
        </div>

        {this.state.accordians_data.map(this.renderAccordions)}
      </Container>
    );
  }
}

const PlanSuccess = (props) => (
  <PlanSuccessClass
    {...props} />
);

export default PlanSuccess;