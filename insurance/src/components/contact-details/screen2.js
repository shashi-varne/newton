import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Container from '../../common/Container';
import InputWithIcon from '../../ui/InputWithIcon';
import location from '../../assets/location_dark_icn.png';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import Api from '../../service/api';
import qs from 'query-string';

class ContactDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      pincode: '',
      addressline: '',
      landmark: '',
      city: '',
      state: '',
      checked: true,
      cpincode: '',
      caddress: '',
      clandmark: '',
      ccity: '',
      cstate: '',
      country: 'INDIA',
      params: qs.parse(props.history.location.search)
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    this.setState({show_loader: true});
    const res = await Api.get('/api/insurance/profile/'+this.state.params.insurance_id, {
      groups: 'contact'
    });

    const { permanent_addr, corr_addr, corr_address_same } = res.pfwresponse.result.profile;

    await this.setStateAsync({
      show_loader: false,
      pincode: permanent_addr.pincode,
      addressline: permanent_addr.addressline,
      landmark: permanent_addr.landmark,
      city: permanent_addr.city,
      state: permanent_addr.state,
      checked: corr_address_same,
      cpincode: corr_addr.pincode,
      caddress: corr_addr.addressline,
      clandmark: corr_addr.landmark,
      ccity: corr_addr.city,
      cstate: corr_addr.state,
      country: corr_addr.country
    });
  }

  handleChange = name => event => {
    if (name === 'checked') {
      this.setState({
        [name]: event.target.checked
      });
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200) {
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
        alert('Error');
        console.log(res.pfwresponse.result.error);
      }
    }

  }

  handleClick = async () => {
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

    this.setState({show_loader: true});

    const res = await Api.post('/api/insurance/profile', address);

    if (res.pfwresponse.status_code === 200) {
      this.setState({show_loader: false});
      if (this.props.edit) {
        this.props.history.push({
          pathname: '/summary',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      } else {
        this.props.history.push({
          pathname: '/nominee',
          search: '?insurance_id='+this.state.params.insurance_id
        });
      }
    } else {
      this.setState({show_loader: false});
      alert('Error');
      console.log(res.pfwresponse.result.error);
    }
  }

  bannerText = () => {
    return (
      <span>
        We will courier your policy paper at <em><b>your residence</b></em> too.
      </span>
    );
  }

  renderCorrespondenceAddress = () => {
    if (!this.state.checked) {
      return (
        <FormControl fullWidth>
          <div className="InputField">
            <InputWithIcon
              type="number"
              icon={location}
              width="40"
              label="Pincode"
              id="cpincode"
              value={this.state.cpincode}
              onChange={this.handlePincode('cpincode')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="caddress"
              label="Permanent address"
              value={this.state.caddress}
              onChange={this.handleChange('caddress')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              type="text"
              id="clandmark"
              label="Landmark"
              value={this.state.clandmark}
              onChange={this.handleChange('clandmark')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="ccity"
              label="City"
              value={this.state.ccity}
              onChange={this.handleChange('ccity')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="cstate"
              label="State"
              value={this.state.cstate}
              onChange={this.handleChange('cstate')} />
          </div>
          <div className="InputField">
            <InputWithIcon
              disabled={true}
              id="country"
              label="Country"
              value={this.state.country}
              onChange={this.handleChange('country')} />
          </div>
        </FormControl>
      );
    } else {
      return null;
    }
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
        >
        <div className="SectionHead" style={{marginBottom: 15, color: 'rgb(68,68,68)', fontSize: 14, fontFamily: 'Roboto', fontWeight: 500}}>
          Permanent address
        </div>
        <FormControl fullWidth>
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
              label="Permanent address"
              value={this.state.addressline}
              onChange={this.handleChange('addressline')} />
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
        <div className="SectionHead" style={{marginBottom: 15, color: 'rgb(68,68,68)', fontSize: 14, fontFamily: 'Roboto', fontWeight: 500}}>
          Correspondence address
        </div>
        <div className="CheckBlock" style={{marginBottom: 20}}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={2}>
              <Checkbox
                defaultChecked
                color="default"
                value="checkedG"
                onChange={this.handleChange('checked')} />
            </Grid>
            <Grid item xs={10}>
              <span style={{color: 'rgb(68, 68, 68)', fontSize: 14}}>Correspondence address same as permanent address</span>
            </Grid>
          </Grid>
        </div>
        {this.renderCorrespondenceAddress()}
      </Container>
    );
  }
}

export default ContactDetails2;
