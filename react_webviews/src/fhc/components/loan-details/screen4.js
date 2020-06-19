import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import Input from '../../../common/ui/Input';
import { formatAmount, inrFormatTest } from 'utils/validators';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';

import FHC from '../../FHCClass';
import { yesOrNoOptions } from '../../constants';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';

class LoanDetails4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      type: getConfig().productName
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
      this.setState({
        show_loader: false,
        fhc_data,
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast(err);
    }
  }


  handleRadioValue = name => index => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    const selectedVal = yesOrNoOptions[index]['value'];

    fhc_data[name] = selectedVal;
    fhc_data[`${name}_error`] = '';
    this.setState({ fhc_data });
  }

  handleChange = name => event => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (name === 'education_loan') {
      if (!inrFormatTest(event.target.value)) {
        return;
      }
      fhc_data.education_loan = event.target.value;
    }
    this.setState({ fhc_data });
  };

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan liability details',
        "education_loan": this.state.fhc_data.education_loan,
        "from_edit": (this.props.edit) ? 'yes' : 'no'
      }
    };
    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (!fhc_data.isValidLoanInfo('education')) {
      this.setState({ fhc_data });
    } else {
      storageService().setObject('fhc_data', fhc_data)
      if (
        fhc_data.has_house_loan ||
        fhc_data.has_car_loan ||
        fhc_data.has_education_loan
      ) {
        // Only show summary if any loan is taken
        this.navigate('loan-summary');
      } else {        
        this.navigate('insurance1');
      }
    }
  }

  render() {
    let monthlyEMIInput = null;
    let fhc_data = new FHC(this.state.fhc_data.getCopy());

    if (fhc_data.has_education_loan) {
      monthlyEMIInput = <div className="InputField">
        <Input
          error={(fhc_data.education_loan_error) ? true : false}
          helperText={fhc_data.education_loan_error}
          type="text"
          width="40"
          label="Monthly EMI"
          class="Income"
          id="monthly-emi"
          name="education_loan"
          value={formatAmount(fhc_data.education_loan || '')}
          onChange={this.handleChange('education_loan')}
          onKeyChange={this.handleKeyChange('education_loan')} />
      </div>
    }
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
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/loan.svg`)}
            title={(this.props.edit) ? 'Edit Loan Liability Details' : 'Loan Liability'} />
          <div className="InputField">
            <RadioWithoutIcon
              error={!!fhc_data.has_education_loan_error}
              helperText={fhc_data.has_education_loan_error}
              width="40"
              label="Do you have education loan?"
              class="MaritalStatus"
              options={yesOrNoOptions}
              id="education-loan"
              value={fhc_data.has_education_loan}
              onChange={this.handleRadioValue('has_education_loan')} />
          </div>
          {
            monthlyEMIInput
          }
        </FormControl>
      </Container>
    );
  }
}

export default LoanDetails4;
