import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import name from '../../assets/name_present_employer_dark_icn.png';
import location from '../../assets/location_dark_icn.png';
import Api from '../../service/api';
import qs from 'qs';

class ProfessionalDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      employer_name: '',
      pincode: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      image: '',
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
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
        address: employer_address.addressline || '',
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200) {
        this.setState({
          city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
          state: res.pfwresponse.result[0].state_name
        });
      } else {
        alert('Error');
        console.log(res.pfwresponse.result.error);
      }
    }

  }

  handleClick = async () => {
    let data = {};

    data['insurance_app_id'] =  this.state.params.insurance_id;
    data['employer_name'] = this.state.employer_name;
    data['employer_address'] = {
      'pincode': this.state.pincode,
      'addressline': this.state.address,
      'landmark': this.state.landmark
    }

    this.setState({show_loader: true});

    const res = await Api.post('/api/insurance/profile', data);

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      this.props.history.push({
        pathname: '/summary',
        search: '?insurance_id='+this.state.params.insurance_id
      });
    } else {
      this.setState({show_loader: false});
      alert('Error');
      console.log(res.pfwresponse.result.error);
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
              type="text"
              icon={name}
              width="40"
              label="Name of present employer"
              class="Name"
              id="name"
              value={this.state.employer_name}
              onChange={this.handleChange('employer_name')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="number"
              icon={location}
              width="40"
              label="Pincode"
              id="pincode"
              value={this.state.pincode}
              onChange={this.handlePincode('pincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="address"
              label="Address of present employer"
              value={this.state.address}
              onChange={this.handleChange('address')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="landmark"
              label="Landmark"
              value={this.state.landmark}
              onChange={this.handleChange('landmark')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="city"
              label="City"
              value={this.state.city}
              onChange={this.handleChange('city')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="state"
              label="State"
              value={this.state.state}
              onChange={this.handleChange('state')} />
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default ProfessionalDetails2;
