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
      edit_allowed: true,
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

  handleClick = async () => {
    this.navigate('insurance1');
  }

  renderAccordionBody = (name) => {
    if (this.state.accordianTab === 'house_loan' && name === 'house_loan') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Monthly EMI: 
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'car_loan' && name === 'car_loan') {
      return (
        <div className="AccordionBody">
          <ul>
            <li class="summary-li">
              Monthly EMI: 
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'education_loan' && name === 'education_loan') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Monthly EMI:
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
          </ul>
        </div>
      );
    }
  }

  capitalize = (string) => {
    if (!string) {
      return;
    }
    return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase(); })
  }

  navigate = (pathname) => {

    if (pathname === 'edit-loan1') {
      this.sendEvents('next', '', 'house-loan');
    } else if (pathname === 'edit-loan3') {
      this.sendEvents('next', '', 'car-loan');
    } else if (pathname === 'edit-loan4') {
      this.sendEvents('next', '', 'education-loan');
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
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-loan1')}>Edit</span>}
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
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-loan3')}>Edit</span>}
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
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-loan4')}>Edit</span>}
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
