import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import TitleWithIcon from '../../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import personal_myway from 'assets/personal_details_icn.svg';
import Input from '../../../../common/ui/Input';
import name from 'assets/full_name_dark_icn.png';
import dob from 'assets/dob_dark_icn.png';
import relationship from 'assets/relationship_dark_icn.png';
import marital from 'assets/marital_status_dark_icn.png';
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import Button from 'material-ui/Button';
import Api from 'utils/api';
import { maritalOptions, genderOptions, appointeeRelationshipOptionsAll } from '../../../constants';
import {
  validateAlphabets, isValidDate,
  validateConsecutiveChar, validateEmpty, validateLengthNames
} from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class AppointeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      name: '',
      name_error: '',
      dob: '',
      dob_error: '',
      marital_status: '',
      marital_status_error: '',
      gender: '',
      gender_error: '',
      relationship: '',
      relationship_error: '',
      checked: true,
      pincode: '',
      pincode_error: '',
      house_no: '',
      house_no_error: '',
      street: '',
      street_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      image: '',
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      appointeeRelationshipOptions: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'appointee'
      })
      const { appointee, appointee_address } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: appointee.name || '',
        age: (appointee.dob) ? this.calculateAge(appointee.dob.replace(/\\-/g, '/').split('/').reverse().join('/')) : '',
        dob: (appointee.dob) ? appointee.dob.replace(/\\-/g, '/').split('/').join('/') : '',
        marital_status: appointee.marital_status || '',
        relationship: appointee.relationship || '',
        checked: (Object.keys(appointee_address).length === 0) ? true : false,
        pincode: appointee_address.pincode || '',
        house_no: appointee_address.house_no || '',
        gender: appointee.gender || '',
        street: appointee_address.street || '',
        landmark: appointee_address.landmark || '',
        city: appointee_address.city || '',
        state: appointee_address.state || '',
        country: appointee_address.country || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan
      });

      this.setRelationshipOptions(appointee.gender);
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else if (name === 'relationship') {
      this.setState({
        [name]: event,
        [name + '_error']: ''
      });
    } else if (name === 'dob') {
      let errorDate = '';

      if (event.target.value.length > 10) {
        return;
      }

      var input = document.getElementById('dob');

      input.onkeyup = function (event) {
        var key = event.keyCode || event.charCode;
        var thisVal;

        let slash = 0;
        for (var i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] === '/') {
            slash += 1;
          }
        }

        if (slash <= 1 && key !== 8 && key !== 46) {
          var strokes = event.target.value.length;

          if (strokes === 2 || strokes === 5) {
            thisVal = event.target.value;
            thisVal += '/';
            event.target.value = thisVal;
          }
          // if someone deletes the first slash and then types a number this handles it
          if (strokes >= 3 && strokes < 5) {
            thisVal = event.target.value;
            if (thisVal.charAt(2) !== '/') {
              var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
              event.target.value = txt1;
            }
          }
          // if someone deletes the second slash and then types a number this handles it
          if (strokes >= 6) {
            thisVal = event.target.value;

            if (thisVal.charAt(5) !== '/') {
              var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
              event.target.value = txt2;
            }
          }
        };

      }

      this.setState({
        [name]: event.target.value,
        age: this.calculateAge(event.target.value.replace(/\\-/g, '/').split('/').reverse().join('/')),
        [event.target.name + '_error']: errorDate
      })

    } else {
      this.setState({
        [name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  setRelationshipOptions(appointee_gender) {
    let options = [];
    if (appointee_gender && appointee_gender.toLowerCase() === 'male') {
      options = appointeeRelationshipOptionsAll['male'];
    } else if (appointee_gender && appointee_gender.toLowerCase() === 'female') {
      options = appointeeRelationshipOptionsAll['female'];
    } else {
      options = appointeeRelationshipOptionsAll['male'];
    }
    this.setState({
      appointeeRelationshipOptions: options
    })

  }

  handleGenderRadioValue = name => index => {
    this.setState({
      [name]: genderOptions[index]['value'],
      [name + '_error']: ''
    });

    this.setRelationshipOptions(genderOptions[index]['value']);
  };

  handleMaritalRadioValue = name => index => {
    this.setState({
      [name]: maritalOptions[index]['value'],
      [name + '_error']: ''
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    if (pincode.length === 6) {
      try {
        const res = await Api.get('/api/pincode/' + pincode);

        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
          this.setState({
            city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            state: res.pfwresponse.result[0].state_name
          });
        } else {
          this.setState({
            city: '',
            state: ''
          });
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  calculateAge = (birthday) => {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  navigate = (pathname, disableBack) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&resume=' + this.state.params.resume,
      params: {
        disableBack: disableBack
      }
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    let age = this.calculateAge(this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/'));
    if (this.state.name.split(" ").filter(e => e).length < 2) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.name)) {
      this.setState({
        name_error: 'Enter valid full name'
      });
    } else if (validateLengthNames(this.state.name, 'name', this.state.provider).isError) {
      this.setState({
        name_error: validateLengthNames(this.state.name, 'name', this.state.provider).error_msg
      });
    } else if (!validateConsecutiveChar(this.state.name)) {
      this.setState({
        name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateAlphabets(this.state.name)) {
      this.setState({
        name_error: 'Name can contain only alphabets'
      });
    } else if (!this.state.gender) {
      this.setState({
        gender_error: 'Mandatory'
      });

    } else if (!this.state.dob) {
      this.setState({
        dob_error: 'Please select date'
      });
    } else if (new Date(this.state.dob) > new Date() || !isValidDate(this.state.dob)) {
      this.setState({
        dob_error: 'Please select valid date'
      });
    } else if (age < 18) {
      this.setState({
        dob_error: 'Minimum age should be 18 years'
      });
    } else if (!this.state.marital_status) {
      this.setState({
        marital_status_error: 'Mandatory'
      });
    } else if (!this.state.relationship) {
      this.setState({
        relationship_error: 'Please select relationship'
      });
    } else {
      try {
        this.setState({ show_loader: true });
        let data = {
          appointee: {}
        };
        const formattedDob = this.state.dob.replace(/\\-/g, '/').split('-').reverse().join('/');

        data['insurance_app_id'] = this.state.params.insurance_id;
        data['appointee']['name'] = this.state.name;
        data['appointee']['dob'] = formattedDob;
        data['appointee']['marital_status'] = this.state.marital_status;
        data['appointee']['relationship'] = this.state.relationship;
        data['appointee']['gender'] = this.state.gender;

        const res = await Api.post('/api/insurance/profile', data);

        if (res.pfwresponse.status_code === 200) {

          this.setState({ show_loader: false });
          if (this.props.edit) {
            if (this.state.params.resume === "yes") {
              this.navigate('resume', true);
            } else {
              this.navigate('summary', true);
            }
          } else {
            if (this.state.provider === 'IPRU') {
              this.navigate('pincode');
            } else {
              this.navigate('summary', true);
            }
          }
        } else {
          this.setState({ show_loader: false });
          for (let error of res.pfwresponse.result.errors) {
            if (error.field === 'appointee_address' || error.field === 'appointee' || error.field === 'a_addr_same') {
              this.setState({ openDialog: true, apiError: error.message });
            }
            this.setState({
              [error.field + '_error']: error.message
            });
          }
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Incase <b>Nominee</b> is minor, <b>Appointee</b> will get the benefits.
      </span>
    );
  }

  handleFocus = () => event => {
    let currentDate = new Date().toISOString().slice(0, 10);
    document.getElementById("dob").valueAsDate = null;
    document.getElementById("dob").max = currentDate;
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'appointee_details',
        "provider": this.state.provider,
        "appointee_name": this.state.name ? 'yes' : 'no',
        "appointee_dob": this.state.dob ? 'yes' : 'no',
        "appointee_marital": this.state.marital_status ? 'yes' : 'no',
        "appointee_relation": this.state.relationship ? 'yes' : 'no',
        "appointee_gender": this.state.gender ? 'yes' : 'no',
        "from_edit": (this.state.edit) ? 'yes' : 'no',
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
        title="Application Form"
        smallTitle={this.state.provider}
        count={true}
        total={this.state.provider === 'IPRU' ? 5 : 4}
        current={4}
        state={this.state}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle={(this.props.edit) ? "Save & Continue" : "Save & Continue"}
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? personal_myway : personal}
            title={(this.props.edit) ? 'Edit Appointee Details' : 'Appointee Details'} />
          <div className="InputField">
            <Input
              error={(this.state.name_error) ? true : false}
              helperText={this.state.name_error}
              type="text"
              icon={name}
              width="40"
              label="Full Name *"
              class="FullName"
              id="full-name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange('name')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.gender_error) ? true : false}
              helperText={this.state.gender_error}
              icon={marital}
              width="40"
              label="Gender"
              class="MaritalStatus"
              options={genderOptions}
              id="marital-status"
              value={this.state.gender}
              onChange={this.handleGenderRadioValue('gender')} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.dob_error) ? true : false}
              helperText={this.state.dob_error}
              type="text"
              icon={dob}
              width="40"
              label="Date of birth *"
              class="DOB"
              id="dob"
              name="dob"
              value={this.state.dob}
              placeholder="DD/MM/YYYY"
              maxLength="10"
              // onFocus={this.handleFocus()}
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <RadioWithoutIcon
              error={(this.state.marital_status_error) ? true : false}
              helperText={this.state.marital_status_error}
              icon={marital}
              width="40"
              label="Marital Status"
              class="MaritalStatus"
              options={maritalOptions}
              id="marital-status"
              name="marital_status"
              value={this.state.marital_status}
              onChange={this.handleMaritalRadioValue('marital_status')} />
          </div>
          <div className="InputField">
            <DropdownWithoutIcon
              error={(this.state.relationship_error) ? true : false}
              helperText={this.state.relationship_error}
              icon={relationship}
              width="40"
              options={this.state.appointeeRelationshipOptions}
              id="relationship"
              name="relationship"
              label="Relationship"
              value={this.state.relationship}
              onClick={() => this.checkAppointeeGender()}
              onChange={this.handleChange('relationship')} />
          </div>
        </FormControl>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default AppointeeDetails;
