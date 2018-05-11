import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import name from '../../assets/name_present_employer_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Api from '../../utils/api';
import { validateAlphabets, validateNumber, validateStreetName, validateLength, validateConsecutiveChar, validateEmpty } from '../../utils/validators';

class ProfessionalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      employer_name: '',
      employer_name_error: '',
      pincode: '',
      pincode_error: '',
      addressline: '',
      address_error: '',
      landmark: '',
      landmark_error: '',
      city: '',
      state: '',
      image: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'professional'
    }).then(res => {
      const { employer_name, employer_address } = res.pfwresponse.result.profile;
      const { image } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        employer_name: employer_name || '',
        pincode: employer_address.pincode || '',
        addressline: employer_address.addressline || '',
        landmark: employer_address.landmark || '',
        city: employer_address.city || '',
        state: employer_address.state || '',
        image: image
      });
    }).catch(error => {
      this.setState({show_loader: false});
      console.log(error);
    });
  }

  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name+'_error']: ''
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name+'_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200  && res.pfwresponse.result.length > 0) {
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
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id='+this.state.params.insurance_id+'&resume='+this.state.params.resume
    });
  }

  handleClick = async () => {
    if (this.state.employer_name.split(" ").filter(e => e).length < 2) {
      this.setState({
        employer_name_error: 'Enter valid full name'
      });
    } else if (!validateEmpty(this.state.employer_name)) {
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
    } else if (!validateEmpty(this.state.addressline)) {
      this.setState({
        addressline_error: 'Address should begin with house number'
      });
    } else if (!validateLength(this.state.addressline)) {
      this.setState({
        addressline_error: 'Maximum length of name is 30 characters'
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
        landmark_error: 'Please enter valid landmark'
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
      this.setState({show_loader: true});
      let data = {};

      data['insurance_app_id'] =  this.state.params.insurance_id;
      data['employer_name'] = this.state.employer_name;
      data['employer_address'] = {
        'pincode': this.state.pincode,
        'addressline': this.state.addressline,
        'landmark': this.state.landmark
      }

      const res = await Api.post('/api/insurance/profile', data);

      if (res.pfwresponse.status_code === 200) {
        this.setState({show_loader: false});
        if (this.state.params.resume === true) {
          this.navigate('/resume');
        } else {
          this.navigate('/summary');
        }
      } else {
        this.setState({show_loader: false});
        for (let error of res.pfwresponse.result.errors) {
          this.setState({
            [error.field+'_error']: error.message
          });
        }
      }
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Professional Details' : 'Professional Details'}
        count={true}
        total={4}
        current={4}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save Details"
        logo={this.state.image}
        >
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              error={(this.state.employer_name_error) ? true : false}
              helperText={this.state.employer_name_error || "Please enter full name"}
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
              error={(this.state.addressline_error) ? true : false}
              helperText={this.state.addressline_error || "Valid address - House No, Society, Locality"}
              type="text"
              id="address"
              name="addressline"
              label="Address of present employer *"
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
      </Container>
    );
  }
}

export default ProfessionalDetails2;
