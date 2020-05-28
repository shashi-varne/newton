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

class InsuranceSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      life_insurance: {},
      education_Insurance: {},
      medical_insurance: {},
      provider: '',
      apiError: '',
      edit_allowed: true,
      accordianTab: 'life_insurance',
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
    if (this.state.accordianTab === 'life_insurance' && name === 'life_insurance') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Annual Premium
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
            <li className="summary-li">
              Coverage
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'medical_insurance' && name === 'medical_insurance') {
      return (
        <div className="AccordionBody">
          <ul>
            <li class="summary-li">
              Annual Premium
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
            <li class="summary-li">
              Coverage
              <span><b>₹ {formatAmount(750000)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'education_insurance' && name === 'education_insurance') {
      return (
        <div className="AccordionBody">
          <ul>
            <li class="summary-li">Monthly EMI: </li>
            <li class="summary-li">
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

    if (pathname === 'edit-insurance1') {
      this.sendEvents('next', '', 'life-insurance');
    } else if (pathname === 'edit-insurance2') {
      this.sendEvents('next', '', 'medical-insurance');
    }

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action, screen_name, which_one_edit) {

    which_one_edit = which_one_edit || '';
    let eventObj = {
      "event_name": 'insurance_details ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance_summary',
        'medical_insurance_details_edit': which_one_edit === 'medical_insurance' ? 'yes' : 'no',
        'life_insurance_details_edit': which_one_edit === 'life_insurance' ? 'yes' : 'no',
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
        current={4}
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
            title={'Insurance liability Summary'} />
          <div style={{ marginBottom: 30 }}>
            <div className="accordion-container">
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('life_insurance')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'life_insurance') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Life Insurance detail</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-insurance1')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('life_insurance')}
              </div>
              <div className="Accordion">
                <div className="AccordionTitle" onClick={() => this.toggleAccordian('medical_insurance')}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <span style={{ marginRight: 10 }}>
                      <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === 'medical_insurance') ? shrink : expand} alt="" width="20" />
                    </span>
                    <span>Medical Insurance detail</span>
                    {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate('edit-insurance2')}>Edit</span>}
                  </div>
                </div>
                {this.renderAccordionBody('medical_insurance')}
              </div>
            </div>
          </div>
        </FormControl>
      </Container >
    );
  }
}


export default InsuranceSummary;
