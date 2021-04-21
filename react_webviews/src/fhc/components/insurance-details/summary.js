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
      type: getConfig().productName,
      accordianTab: 'life_insurance',
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
      toast(err);
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

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    let accordions = insurance_types.map((type, idx) => {
      if (fhc_data[type.key].is_present) {
        return (
          <div className="Accordion" key={idx}>
            <div className="AccordionTitle" onClick={() => this.toggleAccordian(type.key)}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <span style={{ marginRight: 10 }}>
                  <img style={{ position: 'relative', top: 2 }} src={(this.state.accordianTab === type.key) ? shrink : expand} alt="" width="20" />
                </span>
                <span>{type.label} detail</span>
                {this.state.edit_allowed && <span style={{ position: 'absolute', right: 0, color: getConfig().styles.secondaryColor, fontSize: 13 }} onClick={() => this.navigate(type.editPath)}>Edit</span>}
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
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/secure.svg`)}
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
