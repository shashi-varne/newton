import React, { Component } from 'react';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { FormControl } from 'material-ui/Form';
import expand from 'assets/expand_icn.png';
import shrink from 'assets/shrink_icn.png';

import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import { formatAmount } from 'utils/validators';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';
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
      type: getConfig().productName,
      productName: getConfig().productName
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      let fhc_data = storageService().getObject('fhc_data');
      if (!fhc_data) {
        fhc_data = await fetchFHCData();
        storageService().setObject('fhc_data', fhc_data);
      } else {
        fhc_data = new FHC(fhc_data);
      }
      let accordianTab = '';
      for (const type of loan_types) {
        if (fhc_data[`has_${type.key}`]) {
          accordianTab = type.key;
          break;
        }
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
      toast(err);
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
    if (this.state.accordianTab === name) {
      return (
        <div className="AccordionBody">
          <ul>
            <li className="summary-li">
              Monthly EMI:
                <span><b>₹ {formatAmount(fhc_data[name])}</b></span>
            </li>
          </ul>
        </div>
      );
    }
    return '';
  }

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let accordions = loan_types.map((type, idx) => {
      if (fhc_data[`has_${type.key}`]) {
        return (
          <div className="Accordion" key={idx}>
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
        events={''}
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
        fullWidthButton={true}
        onlyButton={true}
        classOverRide={'fhc-container'}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/loan.svg`)}
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
