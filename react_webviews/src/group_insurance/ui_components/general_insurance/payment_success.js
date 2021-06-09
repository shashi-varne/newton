import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import thumb from 'assets/thumb.svg';
import { FormControl } from 'material-ui/Form';
import Input from '../../../common/ui/Input';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import contact from 'assets/address_details_icon.svg';
import contact_myway from 'assets/address_details_icn.svg';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import {
  validateNumber, validateLengthDynamic,
} from 'utils/validators';
// validateStreetName, validateEmpty, validateConsecutiveChar, validateMinChar
import { nativeCallback } from 'utils/native_callback';
import {Imgc} from 'common/ui/Imgc';

class PaymentSuccessClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      parent: this.props.parent,
      address_details_data: {},
      pincode: '',
      addressline: '',
      landmark: '',
      city: '',
      state: '',
      leadData: {}
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);

  }

  componentWillMount() {

    let { params } = this.props.parent.props.location || {};
    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');

    if(lead_id){
      this.setState({
        lead_id: lead_id || '',
        fromHome: params && params.fromHome ? true : false,
      })
    }else{
      this.navigate('/group-insurance');
    }
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClickCurrent,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Edit'
        }

      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }

  }

  onload = async() => {

    this.setErrorData('onload');

    this.setState({
      skelton: true
    })

    let address_details_data = {
      "product_name": this.props.parent.state.product_key,
      "pincode": "",
      "landmark": "",
      "city": "",
      "state": "",
      "address_line": ""
    }
    // this.setState({
    //   address_details_data: address_details_data
    // })

    let error = '';
    let errorType = '';
    try {

      let res = await Api.get('api/insurancev2/api/insurance/bhartiaxa/lead/get/' + this.state.lead_id)

      if (res.pfwresponse.status_code === 200) {

        var leadData = res.pfwresponse.result.lead;
        if (!leadData.permanent_address) {
          leadData.permanent_address = {};
        }

        Object.keys(address_details_data).forEach((key) => {
          if (leadData.permanent_address[key]) {
            address_details_data[key] = leadData.permanent_address[key];
          }

        })

        address_details_data.addressline = leadData.permanent_address.addr_line1;
        this.setState({
          leadData: leadData,
          address_details_data: address_details_data
        })
        this.setState({
          skelton: false
        })
      } else {
        error  = res.pfwresponse.result.error || res.pfwresponse.result.message
        || true;
      }

    } catch (err) {
      this.setState({
        skelton: false,
      });
      error= true;
      errorType= "crash";
    }


    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError:'page'
      })
    }
  }

  async componentDidMount() {
    this.onload();
  }

  handlePincode = name => async (event) => {
    const pincode = event.target.value;


    let address_details_data = this.state.address_details_data;
    address_details_data[name] = pincode;
    address_details_data[name + '_error'] = '';


    if (pincode.length === 6) {
      try {
        const res = await Api.get('/api/pincode/' + pincode);

        if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
          address_details_data.city = res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name;
          address_details_data.state = res.pfwresponse.result[0].state_name
        } else {
          address_details_data.city = '';
          address_details_data.state = '';
          address_details_data[name + '_error'] = 'Please enter valid pincode';
        }

      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }

    } else {
      address_details_data.city = '';
      address_details_data.state = '';
    }

    this.setState({
      address_details_data: address_details_data
    })
  }

  handleChange = name => event => {
    if (!name) {
      name = event.target.name;
    }
    var value = event.target ? event.target.value : '';
    var address_details_data = this.state.address_details_data || {};

    address_details_data[name] = value;
    address_details_data[name + '_error'] = '';

    this.setState({
      address_details_data: address_details_data
    })
  };

  async handleClickCurrent() {

    this.setErrorData('submit');

    this.sendEvents('next');
    
    let error = '';
    let errorType = '';
    try {
      let keysMapper = {
        'addressline': 'address line',
        'pincode': 'pincode',
        'landmark': 'landmark'
      }
      let keys_to_check = ['pincode', 'addressline'];
      let address_details_data = this.state.address_details_data;

      for (var i = 0; i < keys_to_check.length; i++) {
        let key_check = keys_to_check[i];
        if (!address_details_data[key_check]) {
          address_details_data[key_check + '_error'] = 'Please enter ' + keysMapper[key_check];
        }
      }

      if (address_details_data.pincode.length !== 6 || !validateNumber(address_details_data.pincode) || address_details_data.pincode_error) {
        address_details_data['pincode_error'] = 'Please enter valid pincode';
      }


      if (!validateLengthDynamic(address_details_data.addressline, 90)) {
        address_details_data['addressline_error'] = 'Maximum length of address is 90';
      }

      // if (!validateConsecutiveChar(address_details_data.addressline)) {

      //   address_details_data['addressline_error'] = 'Address can not contain more than 3 same consecutive characters';
      // } else if (!validateLengthDynamic(address_details_data.addressline, 90)) {
      //   address_details_data['addressline_error'] = 'Maximum length of address is 90';
      // } else if (!validateMinChar(address_details_data.addressline)) {
      //   address_details_data['addressline_error'] = 'Address should contain minimum two characters';
      // }

      // if (!validateEmpty(address_details_data.landmark)) {
      //   address_details_data['landmark_error'] = 'Enter nearest landmark';
      // } else if (!validateLengthDynamic(address_details_data.landmark, 30)) {
      //   address_details_data['landmark_error'] = 'Maximum length of landmark is 30';
      // } else if (!validateStreetName(address_details_data.landmark)) {
      //   address_details_data['landmark_error'] = 'Please enter valid landmark';
      // }


      this.setState({
        address_details_data: address_details_data
      })

      let canSubmitForm = true;
      for (var key in address_details_data) {
        if (key.indexOf('error') >= 0) {
          if (address_details_data[key]) {
            canSubmitForm = false;
            break;
          }
        }
      }

      if (canSubmitForm) {
        let final_data = {
          "lead_id": this.state.lead_id,
          "permanent_address": {
            'addressline': this.state.address_details_data.addressline,
            'pincode': this.state.address_details_data.pincode,
            'landmark': this.state.address_details_data.landmark,
            'city': this.state.address_details_data.city,
            'state': this.state.address_details_data.state,
            'country': this.state.address_details_data.country,
          }
        }


        this.setState({
          show_loader: 'button'
        })
        let res2 = {};
        res2 = await Api.post('api/insurancev2/api/insurance/bhartiaxa/lead/update', final_data)
        this.setState({
          show_loader: false
        })
        if (res2.pfwresponse.status_code === 200) {
          this.navigate('summary-success')
        } else {
          error = res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || true;
        }

      }
    }
    catch (err) {
      error = true;
      errorType = "crash";
      this.setState({
        show_loader:false
      })
    }

    // set error data
    if(error) {
      this.setState({
        show_loader:false,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: true
      })
    }

  }

  navigate = (pathname) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'address_details',
        "type": this.props.parent.state.product_key,
        "address_details": {
          "pincode": this.state.address_details_data['pincode'] ? 'yes' : 'no',
          "addressline": this.state.address_details_data['dob'] ? 'yes' : 'no',
          "landmark": this.state.address_details_data['landmark'] ? 'yes' : 'no',
          "city": this.state.address_details_data['city'] ? 'yes' : 'no',
          "state": this.state.address_details_data['state'] ? 'yes' : 'no'
        }
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
        fullWidthButton={true}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        disableBack={!this.state.fromHome}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        buttonTitle='Generate Policy'
        onlyButton={true}
        handleClick={() => this.handleClickCurrent()}
        title={this.state.leadData.product_title||this.props.parent.state.headerTitle }
        classOverRideContainer="payment-success"
      >
        <div>
          <div className="payment-success-heading">
            <Imgc className="payment-success-icon" src={thumb} alt=""/>
            <div style={{marginLeft: '15px'}} >
              <div className="payment-success-title">Payment successful</div>
              <div className="payment-success-subtitle">One final step! Share your address and you are insured. </div>
            </div>
          </div>
          <div className="payment-success-divider"></div>
          <div style={{ marginTop: '30px' }}>
            <FormControl fullWidth>
              <TitleWithIcon width="15" icon={getConfig().productName !== 'fisdom' ? contact_myway : contact}
                title={'Address Details'} />
              <div className="InputField">
                <Input
                  type="number"
                  width="40"
                  label="Pincode *"
                  id="pincode"
                  name="pincode"
                  error={(this.state.address_details_data.pincode_error) ? true : false}
                  helperText={this.state.address_details_data.pincode_error}
                  value={this.state.address_details_data.pincode || ''}
                  onChange={this.handlePincode('pincode')} />
              </div>
              <div className="InputField">
                <Input
                  type="text"
                  id="addressline"
                  label="Address*"
                  name="addressline"
                  placeholder="ex: 16/1 Queens paradise"
                  error={(this.state.address_details_data.addressline_error) ? true : false}
                  helperText={this.state.address_details_data.addressline_error}
                  value={this.state.address_details_data.addressline || ''}
                  onChange={this.handleChange()} />
              </div>
              {/* <div className="InputField">
                <Input
                  type="text"
                  id="landmark"
                  label="Landmark *"
                  name="landmark"
                  error={(this.state.address_details_data.landmark_error) ? true : false}
                  helperText={this.state.address_details_data.landmark_error}
                  value={this.state.address_details_data.landmark || ''}
                  onChange={this.handleChange()} />
              </div> */}
              <div className="InputField">
                <Input
                  disabled={true}
                  id="city"
                  label="City *"
                  name="city"
                  value={this.state.address_details_data.city || ''}
                />
              </div>
              <div className="InputField">
                <Input
                  disabled={true}
                  id="state"
                  label="State *"
                  name="state"
                  value={this.state.address_details_data.state || ''}
                />
              </div>
            </FormControl>
          </div>
        </div>
      </Container>
    );
  }
}

const PaymentSuccess = (props) => (
  <PaymentSuccessClass
    {...props} />
);

export default PaymentSuccess;