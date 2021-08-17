import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import qs from 'qs';
import Grid from 'material-ui/Grid';
import toast from '../../../../common/ui/Toast';

import Container from '../../../common/Container';
import Input from '../../../../common/ui/Input';
import TitleWithIcon from '../../../../common/ui/TitleWithIcon';
import contact from 'assets/contact_details_icon.svg';
import contact_myway from 'assets/contact_details_icn.svg';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateNumber, validateStreetName, validateLengthDynamic, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { getConfig, getBasePath } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class ContactDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      pincode: '',
      pincode_error: '',
      addressline: '',
      addressline_error: '',
      street: '',
      street_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      checked: true,
      nominee_checked: true,
      a_checked: true,
      cpincode: '',
      cpincode_error: '',
      caddressline: '',
      caddressline_error: '',
      cstreet: '',
      cstreet_error: '',
      clandmark: '',
      clandmark_error: '',
      ccity: '',
      cstate: '',
      nominee_pincode: '',
      nominee_pincode_error: '',
      nominee_addressline: '',
      nominee_addressline_error: '',
      nominee_street: '',
      nominee_street_error: '',
      nominee_landmark: '',
      nominee_landmark_error: '',
      nominee_city: '',
      nominee_state: '',
      a_pincode: '',
      a_pincode_error: '',
      a_addressline: '',
      a_addressline_error: '',
      a_street: '',
      a_street_error: '',
      a_landmark: '',
      a_landmark_error: '',
      a_city: '',
      a_state: '',
      image: '',
      error: '',
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
  }



  calculateAge = (birthday) => {
    if (!birthday) {
      return;
    }
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }


  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'contact,nominee,appointee'
      })
      let { permanent_addr, corr_addr, nominee_address, nominee,
        appointee_address, nominee_address_same, appointee_address_same, corr_address_same } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;
      if (!nominee_address) {
        nominee_address = {};
      }

      if (!appointee_address) {
        appointee_address = {};
      }
      let nominee_age = nominee.dob && this.calculateAge(nominee.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));
      this.setState({
        show_loader: false,
        nominee_age: nominee_age,
        pincode: permanent_addr.pincode || '',
        addressline: permanent_addr.addressline || '',
        street: permanent_addr.street || '',
        landmark: permanent_addr.landmark || '',
        city: permanent_addr.city || '',
        state: permanent_addr.state || '',
        checked: corr_address_same === true ? true : (Object.keys(corr_addr).length === 0) ? true : false,
        cpincode: corr_addr.pincode || '',
        caddressline: corr_addr.addressline || '',
        cstreet: corr_addr.street || '',
        clandmark: corr_addr.landmark || '',
        ccity: corr_addr.city || '',
        cstate: corr_addr.state || '',
        nominee_checked: nominee_address_same === true ? true : (Object.keys(nominee_address || []).length === 0) ? true : false,
        nominee_pincode: nominee_address.pincode || '',
        nominee_addressline: nominee_address.addressline || '',
        nominee_street: nominee_address.street || '',
        nominee_landmark: nominee_address.landmark || '',
        nominee_city: nominee_address.city || '',
        nominee_state: nominee_address.state || '',
        a_checked: appointee_address_same === true ? true : (Object.keys(appointee_address || []).length === 0) ? true : false,
        a_pincode: appointee_address.pincode || '',
        a_addressline: appointee_address.addressline || '',
        a_street: appointee_address.street || '',
        a_landmark: appointee_address.landmark || '',
        a_city: appointee_address.city || '',
        a_state: appointee_address.state || '',
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
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else if (event.target.name === 'nominee_checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else if (event.target.name === 'a_checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
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
          if (name === 'pincode') {
            this.setState({
              city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              state: res.pfwresponse.result[0].state_name
            });
          } else if (name === 'nominee_pincode') {
            this.setState({
              nominee_city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              nominee_state: res.pfwresponse.result[0].state_name
            });
          } else if (name === 'a_pincode') {
            this.setState({
              a_city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              a_state: res.pfwresponse.result[0].state_name
            });
          } else {
            this.setState({
              ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
              cstate: res.pfwresponse.result[0].state_name
            });
          }
        } else {
          if (name === 'pincode') {
            this.setState({
              city: '',
              state: '',
              [name + '_error']: 'Please enter valid pincode'
            });
          } else if (name === 'nominee_pincode') {
            this.setState({
              nominee_city: '',
              nominee_state: '',
              [name + '_error']: 'Please enter valid pincode'
            });
          } else if (name === 'a_pincode') {
            this.setState({
              a_city: '',
              a_state: '',
              [name + '_error']: 'Please enter valid pincode'
            });
          } else {
            this.setState({
              ccity: '',
              cstate: '',
              [name + '_error']: 'Please enter valid pincode'
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams 
    });
  }

  handleClick = async () => {
    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode) || this.state.pincode_error) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.addressline)) {
      this.setState({
        addressline_error: 'Enter your address'
      });
    } else if (!validateConsecutiveChar(this.state.addressline)) {
      this.setState({
        addressline_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLengthDynamic(this.state.addressline, 30)) {
      this.setState({
        addressline_error: 'Maximum length of address is 30'
      });
    } else if (!validateMinChar(this.state.addressline)) {
      this.setState({
        addressline_error: 'Address should contain minimum two characters'
      });
    } else if (!validateEmpty(this.state.landmark)) {
      this.setState({
        landmark_error: 'Enter nearest landmark'
      });
    } else if (!validateLengthDynamic(this.state.landmark, 30)) {
      this.setState({
        landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!validateStreetName(this.state.landmark)) {
      this.setState({
        landmark_error: 'Please enter valid landmark'
      });
    } else if (!this.state.checked && (this.state.cpincode.length !== 6 ||
      !validateNumber(this.state.cpincode || this.state.cpincode_error))) {
      this.setState({
        cpincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.caddressline)) {
      this.setState({
        caddressline_error: 'Enter your address'
      });
    } else if (!this.state.checked && !validateLengthDynamic(this.state.caddressline, 30)) {
      this.setState({
        caddressline_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.caddressline)) {
      this.setState({
        caddressline_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateMinChar(this.state.caddressline)) {
      this.setState({
        caddressline_error: 'Address should contain minimum two characters'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Enter nearest landmark'
      });
    } else if (!this.state.checked && !validateLengthDynamic(this.state.clandmark, 30)) {
      this.setState({
        clandmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!this.state.checked && !validateStreetName(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Please enter valid landmark'
      });
    } else if (!this.state.nominee_checked && (this.state.nominee_pincode.length !== 6 || !validateNumber(this.state.nominee_pincode
      || this.state.nominee_pincode_error))) {
      // nominee start

      this.setState({
        nominee_pincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.nominee_checked && !validateEmpty(this.state.nominee_addressline)) {
      this.setState({
        nominee_addressline_error: 'Enter your address'
      });
    } else if (!this.state.nominee_checked && !validateLengthDynamic(this.state.nominee_addressline, 30)) {
      this.setState({
        nominee_addressline_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.nominee_checked && !validateConsecutiveChar(this.state.nominee_addressline)) {
      this.setState({
        nominee_addressline_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.nominee_checked && !validateMinChar(this.state.nominee_addressline)) {
      this.setState({
        nominee_addressline_error: 'Address should contain minimum two characters'
      });
    } else if (!this.state.nominee_checked && !validateEmpty(this.state.nominee_landmark)) {
      this.setState({
        nominee_landmark_error: 'Enter nearest landmark'
      });
    } else if (!this.state.nominee_checked && !validateLengthDynamic(this.state.nominee_landmark, 30)) {
      this.setState({
        nominee_landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!this.state.nominee_checked && !validateStreetName(this.state.nominee_landmark)) {
      this.setState({
        nominee_landmark_error: 'Please enter valid landmark'
      });
    } else if (!this.state.a_checked &&
      (this.state.a_pincode.length !== 6 || !validateNumber(this.state.a_pincode)
        || this.state.a_pincode_error)
    ) {
      // appointe start

      this.setState({
        a_pincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.a_checked && !validateEmpty(this.state.a_addressline)) {
      this.setState({
        a_addressline_error: 'Enter your address'
      });
    } else if (!this.state.a_checked && !validateLengthDynamic(this.state.a_addressline, 30)) {
      this.setState({
        a_addressline_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.a_checked && !validateConsecutiveChar(this.state.a_addressline)) {
      this.setState({
        a_addressline_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.a_checked && !validateMinChar(this.state.a_addressline)) {
      this.setState({
        a_addressline_error: 'Address should contain minimum two characters'
      });
    } else if (!this.state.a_checked && !validateEmpty(this.state.a_landmark)) {
      this.setState({
        a_landmark_error: 'Enter nearest landmark'
      });
    } else if (!this.state.a_checked && !validateLengthDynamic(this.state.a_landmark, 30)) {
      this.setState({
        a_landmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!this.state.a_checked && !validateStreetName(this.state.a_landmark)) {
      this.setState({
        a_landmark_error: 'Please enter valid landmark'
      });
    } else {
      try {
        this.setState({ show_loader: true });
        let permanent_address, address = {};

        permanent_address = {
          'pincode': this.state.pincode,
          'addressline': this.state.addressline,
          'landmark': this.state.landmark
        };

        if (this.state.checked) {
          address['insurance_app_id'] = this.state.params.insurance_id;
          address['p_addr'] = permanent_address;
          address['c_addr_same'] = 'Y';
        } else {
          address['insurance_app_id'] = this.state.params.insurance_id;
          address['p_addr'] = permanent_address;
          address['c_addr'] = {
            'pincode': this.state.cpincode,
            'addressline': this.state.caddressline,
            'landmark': this.state.clandmark
          }
        }

        if (this.state.nominee_checked) {
          address['n_addr_same'] = 'Y';
        } else {
          address['nominee_address'] = {
            'pincode': this.state.nominee_pincode,
            'addressline': this.state.nominee_addressline,
            'landmark': this.state.nominee_landmark
          };
        }

        if (this.state.a_checked) {
          address['a_addr_same'] = 'Y';
        } else {
          address['a_address'] = {
            'pincode': this.state.a_pincode,
            'addressline': this.state.a_addressline,
            'landmark': this.state.a_landmark
          };
        }

        const res = await Api.post('/api/insurance/profile', address);

        if (res.pfwresponse.status_code === 200) {
          const result = await Api.post('/api/insurance/profile/submit', {
            insurance_app_id: this.state.params.insurance_id
          });
          if (result.pfwresponse.status_code === 200) {
            let basepath = getBasePath();
            let current_url = basepath + '/group-insurance/term/journey' + getConfig().searchParams;
            nativeCallback({
              action: 'take_control', message: {
                back_url: current_url,
                show_top_bar: false,
                top_bar_title: result.pfwresponse.result.insurance_app.provider,
                back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process"
              }
            });

            nativeCallback({
              action: 'resume_provider',
              message: { resume_link: result.pfwresponse.result.insurance_app.resume_link, provider: this.state.provider }
            });
            this.setState({ show_loader: false });
            // if (this.props.edit) {
            //     this.navigate('summary');
            // } else {
            //   if (this.state.provider === 'HDFC') {
            //     this.navigate('journey');
            //   } else {
            //     this.navigate('professional');
            //   }
            // }
          } else {
            this.setState({
              show_loader: false, openDialog: false,
              apiError: result.pfwresponse.result.error
            });
          }





        } else {
          this.setState({ show_loader: false });
          for (let error of res.pfwresponse.result.errors) {
            if (error.field === 'p_addr') {
              this.setState({ openDialog: true, apiError: 'error in permanent address : ' + error.message });
              break;
            } else if (error.field === 'c_addr') {
              this.setState({ openDialog: true, apiError: 'error in correspondence address : ' + error.message });
              break;
            } else if (error.field === 'nominee_address') {
              this.setState({ openDialog: true, apiError: 'error in nominee address : ' + error.message });
              break;
            } else if (error.field === 'appointee_address') {
              this.setState({ openDialog: true, apiError: 'error in appointee address : ' + error.message });
              break;
            } else {
              this.setState({ openDialog: true, apiError: error.message });
            }
            this.setState({
              [error.field + '_error']: error.message
            });
          }
          // for (let error of res.pfwresponse.result.errors) {
          //   if (error.field === 'c_addr_same' || error.field === 'nominee' || error.field === 'n_addr_same' ||
          //     error.field === 'appointee' || error.field === 'a_addr_same') {
          //     this.setState({ openDialog: true, apiError: error.message });
          //   }

          //   this.setState({
          //     [error.field + '_error']: error.message
          //   });
          // }
        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        console.log(err);
        toast('Something went wrong');
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        We will courier your policy paper at <b>your residence</b> too.
      </span>
    );
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
        "screen_name": 'contact_details_two',
        "provider": this.state.provider,
        "pin_permanent": this.state.pincode ? 'yes' : 'no',
        "add_permanent": this.state.addressline ? 'yes' : 'no',
        "city_permanent": this.state.city ? 'yes' : 'no',
        "state_permanent": this.state.state ? 'yes' : 'no',
        "address_same_option_correspondence": (this.state.checked) ? 'yes' : 'no',
        "pin_correspondence": this.state.cpincode ? 'yes' : 'no',
        "add_correspondence": this.state.caddressline ? 'yes' : 'no',
        "city_correspondence": this.state.ccity ? 'yes' : 'no',
        "state_correspondence": this.state.cstate ? 'yes' : 'no',
        "address_same_option_nominee": (this.state.nominee_checked) ? 'yes' : 'no',
        "pin_nominee": this.state.nominee_pincode ? 'yes' : 'no',
        "add_nominee": this.state.nominee_addressline ? 'yes' : 'no',
        "city_nominee": this.state.nominee_city ? 'yes' : 'no',
        "state_nominee": this.state.nominee_state ? 'yes' : 'no',
        "address_same_option_appointee": (this.state.a_checked) ? 'yes' : 'no',
        "pin_address_same_option_appointee": this.state.a_pincode ? 'yes' : 'no',
        "add_address_same_option_appointee": this.state.a_addressline ? 'yes' : 'no',
        "city_address_same_option_appointee": this.state.a_city ? 'yes' : 'no',
        "state_address_same_option_appointee": this.state.a_state ? 'yes' : 'no',
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
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Continue to HDFC"
        logo={this.state.image}
        type={this.state.type}
      >
        {/* Permanent Address Block */}
        {/* <div className="SectionHead">Permanent address</div> */}
        <FormControl fullWidth>
          <TitleWithIcon width="20" icon={this.state.type !== 'fisdom' ? contact_myway : contact}
            title={(this.props.edit) ? 'Edit Permanent Address' : 'Permanent Address'} />
          <div className="InputField">
            <Input
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
            <Input
              error={(this.state.addressline_error) ? true : false}
              helperText={this.state.addressline_error}
              type="text"
              id="addressline"
              label="Address*"
              name="addressline"
              placeholder="ex: 16/1 Queens paradise"
              value={this.state.addressline}
              onChange={this.handleChange()} />
          </div>
          {/* <div className="InputField">
            <Input
              error={(this.state.street_error) ? true : false}
              helperText={this.state.street_error || "Street, Locality"}
              type="text"
              id="street"
              label="Address line 2 *"
              name="street"
              placeholder="ex: Curve Road, Shivaji Nagar"
              value={this.state.street}
              onChange={this.handleChange()} />
          </div> */}
          <div className="InputField">
            <Input
              error={(this.state.landmark_error) ? true : false}
              helperText={this.state.landmark_error}
              type="text"
              id="landmark"
              label="Landmark *"
              name="landmark"
              value={this.state.landmark}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="city"
              label="City *"
              value={this.state.city}
              name="city"
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="state"
              label="State *"
              value={this.state.state}
              name="state"
              onChange={this.handleChange()} />
          </div>
        </FormControl>

        {/* Correspondence Address Block */}
        {/* <div className="SectionHead">Correspondence address</div> */}
        <div className="CheckBlock2">
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.checked}
                color="default"
                value="checked"
                name="checked"
                onChange={this.handleChange()}
                className="Checkbox" />
            </Grid>
            <Grid item xs={10}>
              <span className="SameAddress">Correspondence address same as permanent address</span>
            </Grid>
          </Grid>
        </div>

        {/* Correspondence Address */}
        {
          !this.state.checked &&
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={(this.state.cpincode_error) ? true : false}
                helperText={this.state.cpincode_error}
                type="number"
                icon={location}
                width="40"
                label="Pincode *"
                id="cpincode"
                name="cpincode"
                value={this.state.cpincode}
                onChange={this.handlePincode('cpincode')} />
            </div>
            <div className="InputField">
              <Input
                error={(this.state.caddressline_error) ? true : false}
                helperText={this.state.caddressline_error}
                type="text"
                id="caddressline"
                label="Address*"
                placeholder="ex: 16/1 Queens paradise"
                value={this.state.caddressline}
                name="caddressline"
                onChange={this.handleChange()} />
            </div>
            {/* <div className="InputField">
              <Input
                error={(this.state.cstreet_error) ? true : false}
                helperText={this.state.cstreet_error || "Street, Locality"}
                type="text"
                id="cstreet"
                placeholder="ex: Curve Road, Shivaji Nagar"
                label="Address line 2 *"
                value={this.state.cstreet}
                name="cstreet"
                onChange={this.handleChange()} />
            </div> */}
            <div className="InputField">
              <Input
                error={(this.state.clandmark_error) ? true : false}
                helperText={this.state.clandmark_error}
                type="text"
                id="clandmark"
                label="Landmark *"
                name="clandmark"
                value={this.state.clandmark}
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="ccity"
                label="City *"
                value={this.state.ccity}
                name="ccity"
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="cstate"
                label="State *"
                value={this.state.cstate}
                name="cstate"
                onChange={this.handleChange()} />
            </div>
          </FormControl>
        }

        {/* nominee */}

        {/* nominee Address Block */}
        <div className="CheckBlock2">
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.nominee_checked}
                color="default"
                value="nominee_checked"
                name="nominee_checked"
                onChange={this.handleChange('nominee_checked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={10}>
              <span className="SameAddress">Nominee’s address is same as my address</span>
            </Grid>
          </Grid>
        </div>

        {/* nominee Address */}
        {
          !this.state.nominee_checked &&
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={(this.state.nominee_pincode_error) ? true : false}
                helperText={this.state.nominee_pincode_error}
                type="number"
                icon={location}
                width="40"
                label="Pincode *"
                id="nominee_pincode"
                name="nominee_pincode" addressline
                value={this.state.nominee_pincode}
                onChange={this.handlePincode('nominee_pincode')} />
            </div>
            <div className="InputField">
              <Input
                error={(this.state.nominee_addressline_error) ? true : false}
                helperText={this.state.nominee_addressline_error}
                type="text"
                id="nominee_addressline"
                label="Address*"
                placeholder="ex: 16/1 Queens paradise"
                value={this.state.nominee_addressline}
                name="nominee_addressline"
                onChange={this.handleChange('nominee_addressline')} />
            </div>
            {/* <div className="InputField">
              <Input
                error={(this.state.nominee_street_error) ? true : false}
                helperText={this.state.nominee_street_error || "Street, Locality"}
                type="text"
                id="nominee_street"
                label="Address line 2 *"
                placeholder="ex: Curve Road, Shivaji Nagar"
                value={this.state.nominee_street}
                name="nominee_street"
                onChange={this.handleChange('nominee_street')} />
            </div> */}
            <div className="InputField">
              <Input
                error={(this.state.nominee_landmark_error) ? true : false}
                helperText={this.state.nominee_landmark_error}
                type="text"
                id="nominee_landmark"
                label="Landmark *"
                value={this.state.nominee_landmark}
                name="nominee_landmark"
                onChange={this.handleChange('nominee_landmark')} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="nominee_city"
                label="City *"
                value={this.state.nominee_city}
                name="nominee_city"
                onChange={this.handleChange('nominee_city')} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="nominee_state"
                label="State *"
                value={this.state.nominee_state}
                name="nominee_state"
                onChange={this.handleChange('nominee_state')} />
            </div>
          </FormControl>
        }

        {/* appointee */}

        {/* appointee Address Block */}
        {this.state.nominee_age <= 18 && <div className="CheckBlock2">
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={1} className="TextCenter">
              <Checkbox
                defaultChecked
                checked={this.state.a_checked}
                color="default"
                value="a_checked"
                name="a_checked"
                onChange={this.handleChange('a_checked')}
                className="Checkbox" />
            </Grid>
            <Grid item xs={10}>
              <span className="SameAddress">Apointnee’s address is same as my address</span>
            </Grid>
          </Grid>
        </div>}

        {/* appointe Address */}
        {
          !this.state.a_checked && this.state.nominee_age <= 18 &&
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={(this.state.a_pincode_error) ? true : false}
                helperText={this.state.a_pincode_error}
                type="number"
                icon={location}
                width="40"
                label="Pincode *"
                id="a_pincode"
                name="a_pincode" addressline
                value={this.state.a_pincode}
                onChange={this.handlePincode('a_pincode')} />
            </div>
            <div className="InputField">
              <Input
                error={(this.state.a_addressline_error) ? true : false}
                helperText={this.state.a_addressline_error}
                type="text"
                id="a_addressline"
                label="Address*"
                placeholder="ex: 16/1 Queens paradise"
                value={this.state.a_addressline}
                name="a_addressline"
                onChange={this.handleChange('a_addressline')} />
            </div>
            {/* <div className="InputField">
              <Input
                error={(this.state.a_street_error) ? true : false}
                helperText={this.state.a_street_error}
                type="text"
                id="a_street"
                label="Address line 2 *"
                placeholder="ex: Curve Road, Shivaji Nagar"
                value={this.state.a_street}
                name="a_street"
                onChange={this.handleChange('a_street')} />
            </div> */}
            <div className="InputField">
              <Input
                error={(this.state.a_landmark_error) ? true : false}
                helperText={this.state.a_landmark_error}
                type="text"
                id="a_landmark"
                label="Landmark *"
                value={this.state.a_landmark}
                name="a_landmark"
                onChange={this.handleChange('a_landmark')} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="a_city"
                label="City *"
                value={this.state.a_city}
                name="a_city"
                onChange={this.handleChange('a_city')} />
            </div>
            <div className="InputField">
              <Input
                disabled={true}
                id="a_state"
                label="State *"
                value={this.state.a_state}
                name="a_state"
                onChange={this.handleChange('a_state')} />
            </div>
          </FormControl>
        }

        {this.renderDialog()}
      </Container>
    );
  }
}

export default ContactDetails2;
