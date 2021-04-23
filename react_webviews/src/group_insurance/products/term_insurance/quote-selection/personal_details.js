import React, { Component } from 'react';
import qs from 'qs';
import { FormControl } from 'material-ui/Form';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback, openPdfCall } from 'utils/native_callback';
import Input from '../../../../common/ui/Input';

import male_icon from 'assets/male_icon.svg';
import female_icon from 'assets/female_icon.svg';
import text_error_icon from 'assets/text_error_icon.svg';
import completed_step from 'assets/completed_step.svg';
import { isValidDate } from 'utils/validators';
import TermsAndConditions from '../../../../common/ui/tnc';

class PersonalDetailsIntro extends Component {
  constructor(props) {
    var quoteData = window.sessionStorage.getItem('quoteData') ? JSON.parse(window.sessionStorage.getItem('quoteData')) : {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      dob_error: '',
      gender_error: '',
      dob: '',
      gender: '',
      quoteData: quoteData,
      tnc: window.sessionStorage.getItem('term_ins_tnc'),
      checked: true
    }
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/kyc/v2/mine')
      let dob = res.pfwresponse.result.kyc.pan.meta_data.dob;
      let gender = res.pfwresponse.result.kyc.identification.meta_data.gender;
      this.setState({
        show_loader: false,
        dob: this.state.quoteData && this.state.quoteData.dob ? this.state.quoteData.dob : dob || '',
        gender: this.state.quoteData.gender ? this.state.quoteData.gender : gender ? gender.toLowerCase() : ''
      });
    } catch (err) {
      console.log(err)
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


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    if (!this.state.dob) {
      this.setState({
        dob_error: 'Please enter date'
      });
    } else if (new Date(this.state.dob) > new Date() || !isValidDate(this.state.dob)) {
      this.setState({
        dob_error: 'Please enter valid date'
      });
    } else if (this.state.age > 65 || this.state.age < 18) {
      this.setState({
        dob_error: 'Valid age is between 18 and 65'
      });
    } else if (!this.state.gender) {
      this.setState({
        gender_error: 'Please select an option'
      })
    } else if (!this.state.dob) {
      this.setState({
        dob_error: 'Please enter DOB'
      })
    } else {
      let quoteData = this.state.quoteData;
      quoteData.dob = this.state.dob;
      quoteData.gender = this.state.gender;
      window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
      this.navigate('annual-income')
    }

  }

  handleGender(value) {
    this.setState({
      gender: value,
      gender_error: ''
    })
  }

  bannerText = () => {
    return (
      <span>
        To recommend right insurance, we need your  <b>personal details</b> and
        <b> insurance requirements.</b>
      </span>
    );
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'basic_details',
        'DOB_entered': this.state.dob ? 'yes' : 'no',
        'gender_click': this.state.gender ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  openInBrowser() {

    this.sendEvents('tnc_clicked');
    if (!getConfig().Web) {
        this.setState({
            show_loader: true
        })
    } 

    let data = {
        url: this.state.tnc,
        header_title: 'Terms & Conditions',
        icon : 'close'
    };

    openPdfCall(data);
}

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Personal Details"
        count={true}
        total={5}
        current={1}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        buttonTitle="Next"
        fullWidthButton={true}
        onlyButton={true}
        hide_header={this.state.show_loader}
      >
        <FormControl fullWidth>
          <div className="InputField">
            <Input
              error={(this.state.dob_error) ? true : false}
              helperText={this.state.dob_error || 'Valid age is between 18 and 65'}
              type="text"
              width="40"
              label="Date of birth (DD/MM/YYY)"
              class="DOB"
              id="dob"
              name="dob"
              max={currentDate}
              value={this.state.dob || ''}
              placeholder="DD/MM/YYYY"
              maxLength="10"
              onChange={this.handleChange('dob')} />
          </div>
          <div className="InputField">
            <label style={{ fontSize: 14, color: '#a2a2a2' }}>Gender</label>
            <div >
              <img className="per-det-img"
                style={{ border: (this.state.gender === 'male' ? '1px solid ' + getConfig().styles.primaryColor : "") }} src={male_icon}
                onClick={() => this.handleGender('male')} alt="Insurance" />
              {this.state.gender === 'male' && <img className="selected-gender" src={completed_step} alt="Insurance" />}

              <img className="per-det-img"
                style={{
                  marginLeft: this.state.gender === 'female' ? 20 : 10,
                  border: (this.state.gender === 'female' ? '1px solid ' + getConfig().styles.primaryColor : "")
                }} src={female_icon}
                onClick={() => this.handleGender('female')} alt="Insurance" />
              {this.state.gender === 'female' && <img className="selected-gender" src={completed_step} alt="Insurance" />}
            </div>
            {this.state.gender_error && <div style={{ marginTop: 10 }}>
              <img style={{ width: 10 }} src={text_error_icon} alt="Insurance" />
              <span style={{ fontSize: 12, color: '#d0021b', marginLeft: 3 }}>{this.state.gender_error}</span>
            </div>}
          </div>
        </FormControl>
        {this.state.tnc && <TermsAndConditions parent={this} />}
      </Container>
    );
  }
}

export default PersonalDetailsIntro;
