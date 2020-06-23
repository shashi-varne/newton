import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers, genderOptions } from '../../../constants';
import { calculateAge, toFeet, capitalizeFirstLetter } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import DropdownInModal from '../../../../common/ui/DropdownInModal';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
class GroupHealthPlanPersonalDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      header_title: 'Personal details',
      form_data: {},
      ctaWithProvider: true,
      show_loader:true,
      get_lead: true
    }
    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
  }

  onload = () => {
    let lead = this.state.lead || {};
    let member_base = lead.member_base;
    let member_key = this.props.match.params.member_key;

    let header_title = `${capitalizeFirstLetter(member_key)}'s details`;
    let header_subtitle = '';

    if (member_key === 'self') {
      header_title = 'Personal details';
      header_subtitle = 'Provide details for application, your details are safe with us';
    }

    let next_state = `/group-insurance/group-health/${this.state.provider}/contact`;
    let backend_key = '';
    for (var i = 0; i < member_base.length; i++) {
      let key = member_base[i].key;

      if (member_key === key) {
        backend_key = member_base[i].backend_key;
        if (i !== member_base.length - 1) {
          next_state = member_base[i + 1].key;
          break;
        }
      }

    }

    let form_data = lead[backend_key] || {};

    form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';
    let age = calculateAge(form_data.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));


    let height_options = [];

    for (var j = 30; j < 1000; j++) {
      let data = {
        name: `${j}cm (${toFeet(j)})`,
        value: j
      };
      height_options.push(data);
    }

    let selectedIndex = '';
    if(form_data.height) {
      height_options.forEach(function(x, index) {
        // eslint-disable-next-line
          if (x.value === parseInt(form_data.height)) {
            selectedIndex = index;
          }
      });
    }

    form_data.selectedIndex = selectedIndex;

    this.setState({
      providerData: health_providers[this.state.provider],
      next_state: next_state,
      member_key: member_key,
      form_data: form_data,
      age: age,
      lead: lead,
      backend_key: backend_key,
      height_options: height_options,
      show_loader: false,
      header_title: header_title,
      header_subtitle: header_subtitle,
      selectedIndex: selectedIndex
    })
  }

  async componentDidUpdate(prevState) {
    if (this.state.member_key && this.state.member_key !== this.props.match.params.member_key) {
      this.onload();
    }
  }

  componentWillMount() {
    this.initialize();
  }


  handleChange = name => event => {

    let form_data = this.state.form_data;

    if (!name) {
      name = event.target.name;
    }

    if (name === 'height') {
      this.setState({
        selectedIndex: event
      }, () => {
        form_data[name] = this.state.height_options[this.state.selectedIndex].value;
        form_data[name + '_error'] = '';
      });



    } else {
      form_data[name] = event.target.value;
      form_data[name + '_error'] = '';
    }

    this.setState({
      form_data: form_data
    })

  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {

    let keys_to_check = ['name', 'dob', 'height', 'weight']

    if(this.state.member_key === 'self') {
      keys_to_check.push('gender');
    }
    let form_data = this.state.form_data;
    for (var i = 0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      let first_error = key_check === 'gender' || key_check === 'height' ? 'Please select ' :
        'Please enter ';
      if (!form_data[key_check]) {
        form_data[key_check + '_error'] = first_error + key_check;
      }
    }

    if (this.state.form_data.name.split(" ").filter(e => e).length < 2) {
        form_data.name_error = 'Enter valid full name';
    } 

    let canSubmitForm = true;
    for (var key in form_data) {
      if (key.indexOf('error') >= 0) {
        if (form_data[key]) {
          canSubmitForm = false;
          break;
        }
      }
    }

    this.setState({
      form_data: form_data
    })


    if (canSubmitForm) {
      let body = {
        [this.state.backend_key]: {
          "name": this.state.form_data.name,
          "dob": this.state.form_data.dob,
          "gender": this.state.form_data.gender,
          "height": this.state.form_data.height,
          "weight": this.state.form_data.weight,
          // "relation": this.state.member_key
        }
      }

      this.updateLead(body);
    }
  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_suraksha',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  handleClose = () => {
    this.setState({
      openConfirmDialog: false
    });

  }
  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true,
    })
  }


  handleChangeRadio = name => event => {


    var form_data = this.state.form_data || {};

    let optionsMapper = {
      'gender': genderOptions
    }
    form_data[name] = optionsMapper[name][event].value;
    form_data[name + '_error'] = '';

    this.setState({
      form_data: form_data
    })

  };

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.state.header_title}
        withProvider={true}
                handleClick2={this.handleClick2}
                buttonData={this.state.bottomButtonData}
        buttonTitle="CONTINUE"
        handleClick={() => this.handleClick()}
      >

        {this.state.header_subtitle &&
          <div className="common-top-page-subtitle">
            {this.state.header_subtitle}
          </div>}
        <div className="InputField">
          <Input
            type="text"
            width="40"
            label="Full name"
            class="Name"
            id="name"
            name="name"
            error={(this.state.form_data.name_error) ? true : false}
            helperText={this.state.form_data.name_error}
            value={this.state.form_data.name || ''}
            onChange={this.handleChange()} />
        </div>
        <div className="InputField">
          <Input
            disabled={true}
            type="text"
            width="40"
            label="Date of birth (DD/MM/YYYY)"
            class="DOB"
            id="dob"
            name="dob"
            max={currentDate}
            error={(this.state.form_data.dob_error) ? true : false}
            helperText={this.state.form_data.dob_error}
            value={this.state.form_data.dob || ''}
            placeholder="DD/MM/YYYY"
            maxLength="10"
            onChange={this.handleChange()} />
        </div>

        {this.state.member_key === 'self' &&
          <div className="InputField">
            <RadioWithoutIcon
              width="40"
              label="Gender"
              class="Gender:"
              options={genderOptions}
              id="gender"
              name="gender"
              error={(this.state.form_data.gender_error) ? true : false}
              helperText={this.state.form_data.gender_error}
              value={this.state.form_data.gender || ''}
              onChange={this.handleChangeRadio('gender')} />
          </div>}
        <div>
          <DropdownInModal
            options={this.state.height_options}
            header_title="Select Height (cm)"
            cta_title="SAVE"
            selectedIndex={this.state.selectedIndex}
            value={this.state.form_data.height}
            error={(this.state.form_data.height_error) ? true : false}
            helperText={this.state.form_data.height_error}
            width="40"
            label="Height (cm)"
            class="Education"
            id="height"
            name="height"
            onChange={this.handleChange('height')}
          />
        </div>
        <div className="InputField">
          <Input
            type="number"
            width="40"
            label="Weight (Kg)"
            class="Name"
            id="name"
            name="weight"
            error={(this.state.form_data.weight_error) ? true : false}
            helperText={this.state.form_data.weight_error}
            value={this.state.form_data.weight || ''}
            onChange={this.handleChange()} />
        </div>
        <ConfirmDialog parent={this} />
      </Container>
    );
  }
}

export default GroupHealthPlanPersonalDetails;