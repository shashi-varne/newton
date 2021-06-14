import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import congratulations_fisdom from 'assets/ils_covid_success_fisdom.svg';
import congratulations_myway from 'assets/ils_covid_success_myway.svg';
import {
  inrFormatDecimal, storageService
} from '../../../utils/validators';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {Imgc} from 'common/ui/Imgc';

const product_config = {
  'PERSONAL_ACCIDENT': {
    'top_title1': 'You’re insured against any unfortunate accidental events with',
    'top_title2': 'Bharti AXA General Insurance.'
  },
  'HOSPICASH': {
    'top_title1': 'You have successfully insured yourself against Hospital expenses with',
    'top_title2': 'Bharti AXA General Insurance.'
  },
  'SMART_WALLET': {
    'top_title1': 'Your Bank cards & Mobile wallets are insured with',
    'top_title2': 'Bharti AXA General Insurance.'
  },
  'DENGUE': {
    'top_title1': 'You have successfully insured yourself against vector borne diseases with',
    'top_title2': 'Bharti AXA General Insurance.'
  },
  'CORONA': {
    'top_title1': 'You’re insured against coronavirus with',
    'top_title2': 'Bharti AXA General Insurance.'
  }
}

class PlanSuccessClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accordianTab: 'policy',
      lead_data: {
        nominee: {}
      },
      accordians_data: [],
      type: getConfig().productName
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);
    this.renderAccordions = this.renderAccordions.bind(this);

  }

  componentWillMount() {

    this.setState({
      congratulations_icon: this.state.type !== 'fisdom' ? congratulations_myway : congratulations_fisdom
    })

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    this.setState({
      lead_id: lead_id || ''
    })

  }

  openInBrowser(url) {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: url
      }
    });
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  onload = async() => {
    this.setErrorData('onload');
    this.setState({
      skelton: true
    })

    let error = '';
    let errorType = '';
    try {

      let res = await Api.get('api/insurancev2/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)

      
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          skelton: false
        })
        let lead_data = res.pfwresponse.result.lead;

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
            'key': 'address',
            'name': 'Address'
          }
        ]

        if (Object.keys(lead_data.nominee).length !== 0) {
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
        error = res.pfwresponse.result.error || res.pfwresponse.result.message
        || true;
      }


    } catch (err) {
      this.setState({
        skelton: false,
      });
      error= true;
      errorType= 'crash';
    }


    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:'page'
      })
    }
  }

  async componentDidMount() {
    this.onload();
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
        {addr.addr_line1 + ', ' +
          // addr.landmark + ', ' +
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
            <li>Sum assured: <span>{inrFormatDecimal(this.state.lead_data.cover_amount || 0)}</span></li>
            <li>Cover period: <span>{this.state.lead_data.product_coverage} yr 
            ({this.state.lead_data.policy.policy_start_date} - {this.state.lead_data.policy.policy_end_date})</span></li>
            
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
            {this.state.lead_data.product_name !== "SMART_WALLET" && 
            <li>Marital status: <span>
              {this.capitalize(this.state.lead_data.marital_status)}</span></li>
            }
            <li>Gender: <span>{this.capitalize(this.state.lead_data.gender)}</span></li>
          </ul>
        </div>
      );
    } else if (name === 'nominee') {
      return (
        <div className="AccordionBody">
          <ul>
            <li>Name: <span>{this.state.lead_data.nominee.name}</span></li>
            <li>Relationship: <span>{this.capitalize(this.state.lead_data.nominee.relation)}</span></li>
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
    if(props.name === 'Nominee' && this.state.lead_data && !this.state.lead_data.nominee_details){
      return;
    }
    return (
      <div key={index} className="plan-summary-accordion">
        <div className="accordion-container">
          <div className="Accordion">
            <div className="AccordionTitle" onClick={() => this.toggleAccordian(props.key)}>
                <div className="AccordionList">
                <span className="AccordionList1">
                  <Imgc className="AccordionListIcon" src={(this.state.accordianTab === props.key) ? shrink : expand} alt="" width="20" />
                </span>
                <span className="AccordianTitleValue">{props.name}</span>
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

  handleClickOne() {
    this.sendEvents('download_policy');
    this.openInBrowser(this.state.lead_data.policy.coi_blob_key);
  }

  handleClickTwo() {
    this.sendEvents('check_details');
    storageService().setObject('backToInsuranceLanding', true);
    let path = '/group-insurance/common/reportdetails/' + this.state.lead_data.bhariaxa_policy_id;
    this.navigate(path);
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'policy',
        "type": this.props.parent.state.product_key
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        twoButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        events={this.sendEvents('just_set_events')}
        buttonOneTitle="Download Policy"
        buttonTwoTitle="Check details"
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClickOne={() => this.handleClickOne()}
        handleClickTwo={() => this.handleClickTwo()}
        title="Success"
        disableBack={true}
        classOverRideContainer="plan-success"
        skelton={this.state.skelton}
      >
        <div className="plan-success-heading">
          <div className="plan-success-heading-icon"><Imgc className="plan-success-heading-img" src={this.state.congratulations_icon} alt="" /></div>
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