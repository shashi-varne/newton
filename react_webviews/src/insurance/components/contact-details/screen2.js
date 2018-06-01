import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import qs from 'qs';
import Grid from 'material-ui/Grid';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateNumber, validateStreetName, validateLength, validate2ConsecutiveDigits, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class ContactDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
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
      checked: true,
      cpincode: '',
      cpincode_error: '',
      chouse_no: '',
      chouse_no_error: '',
      cstreet: '',
      cstreet_error: '',
      clandmark: '',
      clandmark_error: '',
      ccity: '',
      cstate: '',
      image: '',
      error: '',
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'contact'
    }).then(res => {
      const { permanent_addr, corr_addr } = res.pfwresponse.result.profile;
      const { image, provider } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        pincode: permanent_addr.pincode || '',
        house_no: permanent_addr.house_no || '',
        street: permanent_addr.street || '',
        landmark: permanent_addr.landmark || '',
        city: permanent_addr.city || '',
        state: permanent_addr.state || '',
        checked: (Object.keys(corr_addr).length === 0) ? true : false,
        cpincode: corr_addr.pincode || '',
        chouse_no: corr_addr.house_no || '',
        cstreet: corr_addr.street || '',
        clandmark: corr_addr.landmark || '',
        ccity: corr_addr.city || '',
        cstate: corr_addr.state || '',
        image: image,
        provider: provider
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name+'_error']: ''
      });
    }
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name+'_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
        if (name === 'pincode') {
          this.setState({
            city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            state: res.pfwresponse.result[0].state_name
          });
        } else {
          this.setState({
            ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            cstate: res.pfwresponse.result[0].state_name
          });
        }
      } else {
        this.setState({
          city: '',
          state: '',
          ccity: '',
          cstate: ''
        });
      }
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume+'&base_url='+this.state.params.base_url
    });
  }

  handleClick = async () => {
    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.house_no)) {
      this.setState({
        house_no_error: 'Enter your house number and society'
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
        house_no_error: 'House number should contain two digits'
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
    } else if (!this.state.checked && (this.state.cpincode.length !== 6 || !validateNumber(this.state.cpincode))) {
      this.setState({
        cpincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.chouse_no)) {
      this.setState({
        chouse_no_error: 'Enter your house number and society'
      });
    } else if (!this.state.checked && !validateLength(this.state.chouse_no)) {
      this.setState({
        chouse_no_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.chouse_no)) {
      this.setState({
        chouse_no_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validate2ConsecutiveDigits(this.state.chouse_no)) {
      this.setState({
        chouse_no_error: 'House number should contain two digits'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.cstreet)) {
      this.setState({
        cstreet_error: 'Enter your street and locality'
      });
    } else if (!this.state.checked && !validateLength(this.state.cstreet)) {
      this.setState({
        cstreet_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.cstreet)) {
      this.setState({
        cstreet_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Enter nearest landmark'
      });
    } else if (!this.state.checked && !validateLength(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!this.state.checked && !validateStreetName(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Please enter valid landmark'
      });
    } else {
      this.setState({show_loader: true});
      let permanent_address, address = {};

      permanent_address = {
        'pincode': this.state.pincode,
        'house_no': this.state.house_no,
        'street': this.state.street,
        'landmark': this.state.landmark
      };

      if (this.state.checked) {
          address['insurance_app_id'] =  this.state.params.insurance_id;
          address['p_addr'] = permanent_address;
          address['c_addr_same'] = 'Y';
      } else {
          address['insurance_app_id'] = this.state.params.insurance_id;
          address['p_addr'] = permanent_address;
          address['c_addr'] = {
            'pincode': this.state.cpincode,
            'house_no': this.state.chouse_no,
            'street': this.state.cstreet,
            'landmark': this.state.clandmark
          }
      }

      const res = await Api.post('/api/insurance/profile', address);

      if (res.pfwresponse.status_code === 200) {

        let eventObj = {
          "event_name": "contact_two_save",
          "properties": {
            "provider": this.state.provider,
            "address_same_option": (this.state.checked) ? 1 : 0,
            "pin_correspondance": this.state.cpincode,
            "add_correspondance": this.state.chouse_no,
            "city_correspondance": this.state.ccity,
            "state_correspondance": this.state.cstate,
            "pin_permanent": this.state.pincode,
            "add_permanent": this.state.house_no,
            "city_permanent": this.state.city,
            "state_permanent": this.state.state,
            "from_edit": (this.state.edit) ? 1 : 0
          }
        };

        nativeCallback({ events: eventObj });

        this.setState({show_loader: false});
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
        this.setState({show_loader: false});
        for (let error of res.pfwresponse.result.errors) {
          if (error.field === 'p_addr' || error.field === 'c_addr') {
            this.setState({ openDialog: true, apiError: error.message });
          }
          this.setState({
            [error.field+'_error']: error.message
          });
        }
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        We will courier your policy paper at <em><b>your residence</b></em> too.
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
        <DialogTitle id="alert-dialog-title">{"Oops!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Contact Details' : 'Contact Details'}
        count={true}
        total={4}
        current={2}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save Details"
        logo={this.state.image}
        >
        {/* Permanent Address Block */}
          <div className="SectionHead">Permanent address</div>
            <FormControl fullWidth>
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
                  helperText={this.state.house_no_error || "House No, Society"}
                  type="text"
                  id="house_no"
                  label="Address line 1 (with house number)*"
                  name="house_no"
                  placeholder="ex: 16/1 Queens paradise"
                  value={this.state.house_no}
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <InputWithIcon
                  error={(this.state.street_error) ? true : false}
                  helperText={this.state.street_error || "Street, Locality"}
                  type="text"
                  id="street"
                  label="Address line 2 *"
                  name="street"
                  placeholder="ex: Curve Road, Shivaji Nagar"
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
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <InputWithIcon
                  disabled={true}
                  id="city"
                  label="City *"
                  value={this.state.city}
                  name="city"
                  onChange={this.handleChange()} />
              </div>
              <div className="InputField">
                <InputWithIcon
                  disabled={true}
                  id="state"
                  label="State *"
                  value={this.state.state}
                  name="state"
                  onChange={this.handleChange()} />
              </div>
            </FormControl>

        {/* Correspondence Address Block */}
        <div className="SectionHead">Correspondence address</div>
        <div className="CheckBlock">
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={2} className="TextCenter">
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
              <InputWithIcon
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
              <InputWithIcon
                error={(this.state.chouse_no_error) ? true : false}
                helperText={this.state.chouse_no_error || "House No, Society"}
                type="text"
                id="chouse_no"
                label="Address line 1 *"
                placeholder="ex: 16/1 Queens paradise"
                value={this.state.chouse_no}
                name="chouse_no"
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <InputWithIcon
                error={(this.state.cstreet_error) ? true : false}
                helperText={this.state.cstreet_error || "Street, Locality"}
                type="text"
                id="cstreet"
                placeholder="ex: Curve Road, Shivaji Nagar"
                label="Address line 2 *"
                value={this.state.cstreet}
                name="cstreet"
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <InputWithIcon
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
              <InputWithIcon
                disabled={true}
                id="ccity"
                label="City *"
                value={this.state.ccity}
                name="ccity"
                onChange={this.handleChange()} />
            </div>
            <div className="InputField">
              <InputWithIcon
                disabled={true}
                id="cstate"
                label="State *"
                value={this.state.cstate}
                name="cstate"
                onChange={this.handleChange()} />
            </div>
          </FormControl>
        }
        {this.renderDialog()}
      </Container>
    );
  }
}

export default ContactDetails2;
