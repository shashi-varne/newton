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

const loan_types = [{
  key: 'house_loan',
  label: 'House Loan',
  editPath: 'edit-loan1',
}, {
  key: 'car_loan',
  label: 'Car Loan',
  editPath: 'edit-loan3',
}, {
  key: 'education_loan',
  label: 'Education Loan',
  editPath: 'edit-loan4',
}];

class LoanSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit_allowed: true,
      fhc_data: new FHC(),
      accordianTab: 'house_loan',
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
      this.setState({
        show_loader: false,
        fhc_data,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (this.state.accordianTab === 'house_loan' && name === 'house_loan') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Monthly EMI: 
              <span><b>₹ {formatAmount(fhc_data.house_loan)}</b></span>
            </li>
          </ul>
        </div>
      );
    } else if (this.state.accordianTab === 'car_loan' && name === 'car_loan') {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Monthly EMI: 
              <span><b>₹ {formatAmount(fhc_data.car_loan)}</b></span>
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
              <span><b>₹ {formatAmount(fhc_data.education_loan)}</b></span>
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
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let accordions = loan_types.map(type => {
      if (fhc_data[`has_${type.key}`]) {
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
        count={false}
        total={5}
        current={3}
        banner={false}
        bannerText={''}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={'Loan liability Summary'} />
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


export default LoanSummary;
