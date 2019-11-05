import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import InputWithIcon from '../../../../common/ui/InputWithIcon';
import name from '../../../../assets/name_present_employer_dark_icn.png';
import location from '../../../../assets/location_dark_icn.png';
import Api from '../../../../utils/api';
import { validateAlphabets, validateNumber, validateStreetName, validateLength, validate2ConsecutiveDigits, validateConsecutiveChar, validateEmpty } from '../../../../utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class ProfessionalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      employer_name: '',
      employer_name_error: '',
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
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'professional'
      })
      const { employer_name, employer_address } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        employer_name: employer_name || '',
        pincode: employer_address.pincode || '',
        house_no: employer_address.house_no || '',
        street: employer_address.street || '',
        landmark: employer_address.landmark || '',
        city: employer_address.city || '',
        state: employer_address.state || '',
        image: image,
        provider: provider,
        cover_plan: cover_plan
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&resume=' + this.state.params.resume
    });
  }

  handleClick = async () => {
    if (!validateEmpty(this.state.employer_name)) {
      this.setState({
        employer_name_error: 'Enter full name e.g Fisdom Pvt Limited'
      });
    } else if (this.state.employer_name.split(" ").filter(e => e).length < 2) {
      this.setState({
        employer_name_error: 'Enter valid full name'
      });
    } else if (!validateAlphabets(this.state.employer_name)) {
      this.setState({
        employer_name_error: 'Name can contain only alphabets'
      });
    } else if (!validateLength(this.state.employer_name)) {
      this.setState({
        employer_name_error: 'Maximum length of name is 30 characters'
      });
    } else if (!validateConsecutiveChar(this.state.employer_name)) {
      this.setState({
        employer_name_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.house_no)) {
      this.setState({
        house_no_error: 'Enter your unit number and building name'
      });
    } else if (!validateConsecutiveChar(this.state.house_no)) {
      this.setState({
        house_no_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLength(this.state.house_no)) {
      this.setState({
        house_no_error: 'Maximum length of address is 30'
      });
    } else if (!validate2ConsecutiveDigits(this.state.house_no)) {
      this.setState({
        house_no_error: 'Unit number should contain two digits'
      });
    } else if (!validateEmpty(this.state.street)) {
      this.setState({
        street_error: 'Enter your street and locality'
      });
    } else if (!validateConsecutiveChar(this.state.street)) {
      this.setState({
        street_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLength(this.state.street)) {
      this.setState({
        street_error: 'Maximum length of address is 30'
      });
    } else if (!validateEmpty(this.state.landmark)) {
      this.setState({
        landmark_error: 'Enter nearest landmark'
      });
    } else if (!validateLength(this.state.landmark)) {
      this.setState({
        landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!validateStreetName(this.state.landmark)) {
      this.setState({
        landmark_error: 'Please enter valid landmark'
      });
    } else {
      try {
        this.setState({ show_loader: true });
        let data = {};

        data['insurance_app_id'] = this.state.params.insurance_id;
        data['employer_name'] = this.state.employer_name;
        data['employer_address'] = {
          'pincode': this.state.pincode,
          'house_no': this.state.house_no,
          'street': this.state.street,
          'landmark': this.state.landmark
        }

        const res = await Api.post('/api/insurance/profile', data);

        if (res.pfwresponse.status_code === 200) {

          let eventObj = {
            "event_name": "employer_save",
            "properties": {
              "provider": this.state.provider,
              "employer": this.state.employer_name,
              "address": this.state.addressline,
              "state": this.state.state,
              "city": this.state.city,
              "political": (this.state.is_politically_exposed) ? 1 : 0,
              "criminal": (this.state.is_criminal) ? 1 : 0,
              "from_edit": (this.state.edit) ? 1 : 0
            }
          };

          nativeCallback({ events: eventObj });

          this.setState({ show_loader: false });
          if (this.props.edit) {
            if (this.state.params.resume === "yes") {
              this.navigate('/insurance/resume');
            } else {
              this.navigate('/insurance/summary');
            }
          } else {
            this.navigate('/insurance/nominee');
          }
        } else {
          this.setState({ show_loader: false });
          for (let error of res.pfwresponse.result.errors) {
            if (error.field === 'employer_address') {
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
        "screen_name": 'Intro'
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
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save & Continue"
        logo={this.state.image}
      >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.employer_name_error) ? true : false}
              helperText={this.state.employer_name_error || "Enter full name e.g Fisdom Pvt Limited"}
              type="text"
              icon={name}
              width="40"
              label="Name of present employer *"
              class="Name"
              id="name"
              name="employer_name"
              value={this.state.employer_name}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.pincode_error) ? true : false}
              helperText={this.state.pincode_error}
              type="number"
              icon={location}
              width="40"
              label="Pincode *"
              id="pincode"
              name="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.house_no_error) ? true : false}
              helperText={this.state.house_no_error || "Unit No, Society"}
              type="text"
              id="house_no"
              name="house_no"
              placeholder="ex: 16/1 Queens paradise"
              label="Address line 1 (with unit number)*"
              value={this.state.house_no}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.street_error) ? true : false}
              helperText={this.state.street_error || "Street, Locality"}
              type="text"
              id="street"
              name="street"
              placeholder="ex: Curve Road, Shivaji Nagar"
              label="Address line 2 *"
              value={this.state.street}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.landmark_error) ? true : false}
              helperText={this.state.landmark_error}
              type="text"
              id="landmark"
              label="Landmark *"
              name="landmark"
              value={this.state.landmark}
              onChange={this.handleChange('landmark')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="city"
              label="City *"
              name="city"
              value={this.state.city}
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="state"
              label="State *"
              name="state"
              value={this.state.state}
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default ProfessionalDetails2;
