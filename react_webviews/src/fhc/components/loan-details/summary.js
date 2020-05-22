import React, { Component } from 'react';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { FormControl } from 'material-ui/Form';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import Api from 'utils/api';
import personal from 'assets/personal_details_icon.svg';
import qs from 'qs';
import { numDifferentiation, formatAmount } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class LoanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      house_loan: {},
      education_loan: {},
      car_loan: {},
      provider: '',
      apiError: '',
      accordianTab: 'house_loan',
      params: qs.parse(props.history.location.search.slice(1)),
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
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

  handleClick = async () => {}

  renderAccordionBody = (name) => {

    if (this.state.provider === 'HDFC') {
      if (this.state.accordianTab === 'house_loan' && name === 'house_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              {this.state.house_loan.accident_benefit && <li>Accidental death house_loan:<span>₹ {numDifferentiation(this.state.house_loan.accident_benefit)}</span></li>}
              <li>Payout option: <span>{this.state.house_loan.payout_option}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'personal' && name === 'personal') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.personal.name}</span></li>
              <li>DOB: <span>{this.state.personal.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.personal.marital_status)}</span></li>
              <li>Birth place: <span>{this.state.personal.birth_place}</span></li>
              {this.state.personal.marital_status === 'MARRIED' &&
                <li>Spouse name: <span>{this.state.personal.spouse_name}</span></li>}
              <li>Mother name: <span>{this.state.personal.mother_name}</span></li>
              <li>Father name: <span>{this.state.personal.father_name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.personal.gender)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'contact' && name === 'contact') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Email: <span>{this.state.contact.email}</span></li>
              <li>Mobile number: <span>{this.state.contact.mobile_no}</span></li>
              {/* {this.state.contact.permanent_addr.house_no &&

                <li>
                  Permanent address:
                <div>
                    <span style={{ wordWrap: 'break-word' }}>
                      {this.getAddress(this.state.contact.permanent_addr)}
                    </span>
                  </div>
                </li>
              }
              {(this.state.contact.corr_address_same || this.state.contact.corr_addr.house_no) &&
                ((this.state.contact.corr_address_same)
                  ? <li>
                    Correspondence address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Correspondence address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.corr_addr)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'car_loan' && name === 'car_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Pan number: <span>{this.state.car_loan.pan_number}</span></li>
              <li>Education qualification: <span>{this.state.car_loan.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.car_loan.occupation_detail)}</span></li>
              {this.state.car_loan.occupation_detail !== 'SELF-EMPLOYED' &&
                <li>Occupation category: <span>{this.capitalize(this.state.car_loan.occupation_category)}</span></li>}
              <li>Annual income: <span>₹ {formatAmount(this.state.car_loan.annual_income)}</span></li>
              <li>Criminal proceedings: <span>{(this.state.car_loan.is_criminal) ? 'Yes' : 'No'}</span></li>
              <li>Politically exposed: <span>{(this.state.car_loan.is_politically_exposed) ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'nominee' && name === 'nominee') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.nominee.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.nominee.gender)}</span></li>
              <li>DOB: <span>{this.state.nominee.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.nominee.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.nominee.relationship)}</span></li>
              {/* {(this.state.nominee.nominee_address_same || this.state.contact.nominee_address.house_no) &&
                ((this.state.nominee.nominee_address_same)
                  ? <li>
                    Address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Address:
                  <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.nominee.nominee_address)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'education_loan' && name === 'education_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.education_loan.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.education_loan.gender)}</span></li>
              <li>DOB: <span>{this.state.education_loan.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.education_loan.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.education_loan.relationship)}</span></li>
              {/* {(this.state.education_loan.education_loan_address_same || this.state.contact.education_loan_address.house_no) &&
                ((this.state.education_loan.education_loan_address_same)
                  ? <li>
                    Address:
                    <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.contact.permanent_addr)}
                      </span>
                    </div>
                  </li>
                  : <li>
                    Address:
                    <div>
                      <span style={{ wordWrap: 'break-word' }}>
                        {this.getAddress(this.state.education_loan.education_loan_address)}
                      </span>
                    </div>
                  </li>)
              } */}
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'premium' && name === 'premium') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Base premium: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.base_premium)}</span></li>
              <li>Add on house_loan: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.riders_base_premium)}</span></li>
              <li>GST & taxes: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.total_tax)}</span></li>
              <li style={{ borderTop: '1px dashed #b8b8b8' }}>Total payable: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.premium)}</span></li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    } else {
      if (this.state.accordianTab === 'house_loan' && name === 'house_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              {this.state.house_loan.accident_benefit && <li>Accidental death house_loan:<span>₹ {numDifferentiation(this.state.house_loan.accident_benefit)}</span></li>}
              <li>Payout option: <span>{this.state.house_loan.payout_option}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'car_loan' && name === 'car_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Education qualification: <span>{this.state.car_loan.education_qualification}</span></li>
              <li>Occupation detail: <span>{this.capitalize(this.state.car_loan.occupation_detail)}</span></li>
              {/* <li>Occupation category: <span>{this.capitalize(this.state.car_loan.occupation_category)}</span></li> */}
              <li>Annual income: <span>₹ {formatAmount(this.state.car_loan.annual_income)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'education_loan' && name === 'education_loan') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Name: <span>{this.state.education_loan.name}</span></li>
              <li>Gender: <span>{this.capitalize(this.state.education_loan.gender)}</span></li>
              <li>DOB: <span>{this.state.education_loan.dob}</span></li>
              <li>Marital status: <span>{this.capitalize(this.state.education_loan.marital_status)}</span></li>
              <li>Relationship: <span>{this.capitalize(this.state.education_loan.relationship)}</span></li>
            </ul>
          </div>
        );
      } else if (this.state.accordianTab === 'premium' && name === 'premium') {
        return (
          <div className="AccordionBody">
            <ul>
              <li>Base premium: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.base_premium)}</span></li>
              <li>Add on house_loan: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.riders_base_premium)}</span></li>
              <li>GST & taxes: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.total_tax)}</span></li>
              <li style={{ borderTop: '1px dashed #b8b8b8' }}>Total payable: <span style={{ float: 'right' }}>₹ {formatAmount(this.state.premiumData.premium)}</span></li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    }
  }

  capitalize = (string) => {
    if (!string) {
      return;
    }
    return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase(); })
  }

  navigate = (pathname) => {

    if (pathname === 'edit-personal') {
      this.sendEvents('next', '', 'personal');
    } else if (pathname === 'edit-contact') {
      this.sendEvents('next', '', 'contact');
    } else if (pathname === 'edit-car_loan') {
      this.sendEvents('next', '', 'car_loan');
    } else if (pathname === 'edit-nominee') {
      this.sendEvents('next', '', 'nominee');
    } else if (pathname === 'edit-education_loan') {
      this.sendEvents('next', '', 'education_loan');
    }

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action, screen_name, which_one_edit) {

    which_one_edit = which_one_edit || '';
    let eventObj = {
      "event_name": 'loan_details ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_summary',
        'car_loan_details_edit': which_one_edit === 'car_loan' ? 'yes' : 'no',
        'house_loan_details_edit': which_one_edit === 'house_loan' ? 'yes' : 'no',
        'education_loan_details_edit': which_one_edit === 'education_loan' ? 'yes' : 'no',
        'time_spent': this.state.time_spent
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
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        smallTitle={this.state.provider}
        count={false}
        total={5}
        current={3}
        banner={false}
        bannerText={''}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={'Loan liability Summary'} />
          <div style={{ marginBottom: 30 }}>
            <div className="accordion-container">
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('house_loan')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'house_loan') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>House Loan detail</span>
                  </div>
                </div>
                {this.renderAccordionBody('house_loan')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('car_loan')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'car_loan') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Car Loan detail</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-car_loan')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('car_loan')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('education_loan')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'education_loan') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Education Loan detail</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-education_loan')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('education_loan')}
              </div>
            </div>
          </div>
        </FormControl>
      </Container >
    );
  }
}


export default LoanSummary;
