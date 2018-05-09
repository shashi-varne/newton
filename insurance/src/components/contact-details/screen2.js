import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import qs from 'qs';
import Grid from 'material-ui/Grid';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import location from '../../assets/location_dark_icn.png';
import Api from '../../utils/api';
import { validateNumber, validateStreetName, validateLength, validateConsecutiveChar, validateEmpty } from '../../utils/validators';

class ContactDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      pincode: '',
      pincode_error: '',
      addressline: '',
      addressline_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      checked: true,
      cpincode: '',
      cpincode_error: '',
      caddress: '',
      caddress_error: '',
      clandmark: '',
      clandmark_error: '',
      ccity: '',
      cstate: '',
      image: '',
      error: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'contact'
    }).then(res => {
      const { permanent_addr, corr_addr } = res.pfwresponse.result.profile;
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        pincode: permanent_addr.pincode || '',
        addressline: permanent_addr.addressline || '',
        landmark: permanent_addr.landmark || '',
        city: permanent_addr.city || '',
        state: permanent_addr.state || '',
        checked: (Object.keys(corr_addr).length === 0) ? true : false,
        cpincode: corr_addr.pincode || '',
        caddress: corr_addr.addressline || '',
        clandmark: corr_addr.landmark || '',
        ccity: corr_addr.city || '',
        cstate: corr_addr.state || '',
        image: image
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
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume
    });
  }

  handleClick = async () => {
    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.addressline)) {
      this.setState({
        addressline_error: 'Address should begin with house number'
      });
    } else if (this.state.addressline.split(" ").length < 3) {
      this.setState({
        addressline_error: 'Address line should have at least 3 words'
      });
    } else if (!validateConsecutiveChar(this.state.addressline)) {
      this.setState({
        addressline_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!validateEmpty(this.state.landmark)) {
      this.setState({
        clandmark_error: 'Please enter valid landmark'
      });
    } else if (!validateLength(this.state.landmark)) {
      this.setState({
        clandmark_error: 'Maximum length of landmark is 30'
      });
    } else if (!validateStreetName(this.state.landmark)) {
      this.setState({
        clandmark_error: 'Please enter valid landmark'
      });
    } else if (!this.state.checked && (this.state.cpincode.length !== 6 || !validateNumber(this.state.cpincode))) {
      this.setState({
        cpincode_error: 'Please enter valid pincode'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.caddress)) {
      this.setState({
        addressline_error: 'Address should begin with house number'
      });
    } else if (!this.state.checked && !validateLength(this.state.caddress)) {
      this.setState({
        addressline_error: 'Maximum length of name is 30 characters'
      });
    } else if (!this.state.checked && this.state.caddress.split(" ").length < 3) {
      this.setState({
        addressline_error: 'Address line should have at least 3 words'
      });
    } else if (!this.state.checked && !validateConsecutiveChar(this.state.caddress)) {
      this.setState({
        addressline_error: 'Name can not contain more than 3 same consecutive characters'
      });
    } else if (!this.state.checked && !validateEmpty(this.state.clandmark)) {
      this.setState({
        clandmark_error: 'Please enter valid landmark'
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
        'addressline': this.state.addressline,
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
            'addressline': this.state.caddress,
            'landmark': this.state.clandmark
          }
      }

      const res = await Api.post('/api/insurance/profile', address);

      if (res.pfwresponse.status_code === 200) {
        this.setState({show_loader: false});
        if (this.props.edit) {
          if (this.state.params.resume === true) {
            this.navigate('/resume');
          } else {
            this.navigate('/summary');
          }
        } else {
          this.navigate('/nominee');
        }
      } else {
        this.setState({show_loader: false});
        for (let error of res.pfwresponse.result.errors) {
          if (error.field === 'p_addr' || error.field === 'c_addr') {
            alert(error.message);
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
                  error={(this.state.addressline_error) ? true : false}
                  helperText={this.state.addressline_error || "Valid address - House No, Society, Locality"}
                  type="text"
                  id="address"
                  label="Permanent address *"
                  name="addressline"
                  value={this.state.addressline}
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
                error={(this.state.caddress_error) ? true : false}
                helperText={this.state.caddress_error}
                type="text"
                id="caddress"
                label="Permanent address *"
                value={this.state.caddress}
                name="caddress"
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
      </Container>
    );
  }
}

export default ContactDetails2;
