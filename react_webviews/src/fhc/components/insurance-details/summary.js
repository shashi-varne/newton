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
import { formatAmount } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import FHC from '../../FHCClass';
import toast from '../../../common/ui/Toast';

const insurance_types = [{
  key: 'life_insurance',
  label: 'Life Insurance',
  editPath: 'edit-insurance1',
}, {
  key: 'medical_insurance',
  label: 'Medical Insurance',
  editPath: 'edit-insurance2',
}];
class InsuranceSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fhc_data: new FHC(),
      edit_allowed: true,
      accordianTab: 'life_insurance',
      params: qs.parse(props.history.location.search.slice(1)),
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
  }

  async componentDidMount() {
    try {
      let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
      if (!fhc_data) {
        const res = await Api.get('page/financialhealthcheck/edit/mine', {
          format: 'json',
        });
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      let accordianTab = '';
      if (fhc_data.life_insurance.is_present) {
        accordianTab = 'life_insurance';
      } else if (fhc_data.medical_insurance.is_present) {
        accordianTab = 'medical_insurance';
      }
      this.setState({
        show_loader: false,
        accordianTab,
        fhc_data,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleClick = async () => {
    this.navigate('investment1');
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

  renderAccordionBody = (name) => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (this.state.accordianTab === 'life_insurance' && name === 'life_insurance') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Annual Premium
              <span><b>₹ {formatAmount(fhc_data.life_insurance.annual_premuim)}</b></span>
            </li>
            <li className="summary-li">
              Coverage
              <span><b>₹ {formatAmount(fhc_data.life_insurance.cover_value)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'medical_insurance' && name === 'medical_insurance') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Annual Premium
              <span><b>₹ {formatAmount(fhc_data.medical_insurance.annual_premuim)}</b></span>
            </li>
            <li className="summary-li">
              Coverage
              <span><b>₹ {formatAmount(fhc_data.medical_insurance.cover_value)}</b></span>
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let accordions = insurance_types.map(type => {
      if (fhc_data[type.key].is_present) {
        return (
          <div className="Accordion">
            <div className="AccordionTitle" onClick={() => this.toggleAccordian(type.key)}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <span style={{ marginRight: 10 }}>
                  <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === type.key) ? shrink : expand} alt="" width="20" />
                </span>
                <span>{type.label} detail</span>
                {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().secondary, fontSize: 13 }} onClick={() => this.navigate(type.editPath)}>Edit</span>}
              </div>
            </div>
            {this.renderAccordionBody(type.key)}
          </div>
        )
      }
      return '';
    });
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
            {
              accordions
            }
            </div>
          </div>
        </FormControl>
      </Container >
    );
  }
}


export default InsuranceSummary;
