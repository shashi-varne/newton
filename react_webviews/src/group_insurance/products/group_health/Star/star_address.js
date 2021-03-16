import React, { Component } from 'react';
import Container from '../../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
import DropDownNew2 from '../../../../common/ui/DropDownNew2'
import { isEmpty , validateLengthDynamic } from '../../../../utils/validators';
import DotDotLoader from '../../../../common/ui/DotDotLoader';

class StarAddress extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: getConfig().productName,
      form_data: {},
      ctaWithProvider: true,
      get_lead: true,
      next_state: 'nominee',
      screen_name: 'star_address_screen',
      cityList: [],
      areaList: [],
    };
    this.initialize = initialize.bind(this);
    this.updateLead = updateLead.bind(this);
    this.addressRef = React.createRef();
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {

    if (this.props.edit) {
      this.setState({
        next_state: `/group-insurance/group-health/${this.state.provider}/final-summary`
      });
    }

    const { lead = {} } = this.state;
    lead.permanent_address = lead.address_details.permanent_address || {};
    let form_data = lead.address_details.permanent_address || {};

    form_data.city = lead.address_details.permanent_address.city;
    form_data.area_id = lead.address_details.permanent_address.area_id;
    form_data.pincode = lead.address_details.permanent_address.pincode || '';
    this.setState({
      form_data,
      bottomButtonData: {
        ...this.state.bottomButtonData,
        handleClick: this.handleClick,
      },
    }, () => {
      this.handlePincode(form_data);
    });
  }

  fetchAreaList = async(form_data, setOnload) => {

    if(!form_data) {
      form_data  = this.state.form_data;
    }

    this.setState({
      areaList: [],
      form_data,
      isLoadingArea: true,
    }, async () => {
      try {
        const { pincode, city_id } = form_data;
        const res = await Api.get(`api/insurancev2/api/insurance/proposal/star/area_options?pincode=${pincode}&city_id=${city_id}`);

        if (res.pfwresponse.status_code === 200 && !isEmpty(res.pfwresponse.result)) {
          const areaList = this.formatAreaOpts(res.pfwresponse.result.areas);

          this.setState({ areaList });

          if(setOnload) {
            let data = areaList.filter(area => area.name === form_data.area);
            
            if(data.length > 0) {
              form_data.area = data[0].name;
              form_data.area_id = data[0].value;
              form_data.area_id_error = '';
            };

          } 
          this.setState({form_data});
          
        }
      } catch(err) {
        console.log(err);
        toast(err);

        return form_data
      }
      this.setState({ isLoadingArea: false });
    });
  }

  handleChange = name => event => {
    if (!name) {
      name = event.target.name;
    }
    var value = event.target ? event.target.value : event;
    let form_data = this.state.form_data || {};

    if(this.state.provider === 'STAR' && (name.includes('addr_line1') || name.includes('addr_line2'))){
      value = event.target ? event.target.value.substr(0, 240) : event;
    }

    if (name === 'city_id') {
      form_data.city_id = value;
      form_data.city_id_error = '';
      form_data.area_id = '';
      form_data.area_id_error = '';
      form_data.city = this.state.cityList.find(city => city.value === value).name;
      this.fetchAreaList(form_data);
    } else if (name === 'area_id') {
      form_data.area_id = value;
      form_data.area_id_error = '';
      form_data.area = this.state.areaList.find(area => area.value === value).name;
      this.setState({ form_data });
    } else {
      form_data[name] = value;
      form_data[name + '_error'] = '';
      this.setState({ form_data });
    }
  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  };


  handleClose = () => {
    this.setState({
      openConfirmDialog: false
    });

  }
  handleClick2 = () => {
    this.setState({
      openConfirmDialog: true,
    })
  }

  handleClick = async () => {

    let { form_data } = this.state;

    this.sendEvents('next');
    const keysMapper = {
      'addr_line1': 'Address line 1',
      'addr_line2': 'Address line 2',
      'pincode': 'pincode',
      'city_id': 'city',
      'area_id': 'area',
      'state': 'state',
    };

    
    const keys_to_check = [
      'addr_line1',
      'addr_line2',
      'pincode',
      'city_id',
      'area_id',
      'state',
    ];

    let canSubmitForm = true;

    for(var key in form_data){
      if(key === 'addressline' || key ==="addressline2" || key ==="p_addressline" || key === "p_addressline2"){
          if(validateLengthDynamic(form_data[key], 4)){
              form_data[key+'_error'] = "Please enter at least 4 characters";
              canSubmitForm = false;
          }
      }
    }

    for (let key_check of keys_to_check) {
      let first_error = 'Please enter ';
      if (!form_data[key_check]) {
        form_data[key_check + '_error'] = first_error + keysMapper[key_check];
        canSubmitForm = false;
        break;
      }
    }

    this.setState({ form_data });


    if (canSubmitForm) {
      const data_to_send = [...keys_to_check, 'city', 'area'].reduce((acc, key) => {
        acc[key] = `${form_data[key]}`;
        return acc;
      }, {});
      

      data_to_send['country'] = 'INDIA'
      const body = {
        "address_details": {                   
          "permanent_address": data_to_send,
          "correspondence_addr_same": 'y'
        }
      }

      this.updateLead(body);
    }
  };


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_insurance',
      "properties": {
        "user_action": user_action,
        "product": this.state.providerConfig.provider_api,
        "flow": this.state.insured_account_type || '',
        "screen_name": 'address details',
        'from_edit': this.props.edit ? 'yes' : 'no',
        'address_entered': this.state.form_data.addr_line1 ? 'yes' : 'no',
        'address2_entered': this.state.form_data.addr_line2 ? 'yes' : 'no',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  formatCityOpts(opts = []) {
    return opts.map(opt => {
      return {
        name: opt.city_name,
        value: opt.city_id,
      }
    })
  }

  formatAreaOpts(opts = []) {
    return opts.map(opt => {
      return {
        name: opt.areaName,
        value: opt.areaID,
      }
    })
  }

  handlePincode = async () => {
    let form_data = this.state.form_data;
    const { pincode } = form_data;

    if (!pincode) return;

    if (pincode.length === 6) {
      try {
        this.setState({ isLoadingCity: true });
        const res = await Api.get((`api/insurancev2/api/insurance/proposal/star/city_options?pincode=${pincode}`));

        if (res.pfwresponse.status_code === 200 && !isEmpty(res.pfwresponse.result)) {
          const cityList = this.formatCityOpts(res.pfwresponse.result.cities);
          form_data.state = res.pfwresponse.result.state;
          let data = cityList.filter(city => city.name === form_data.city);
          if(data.length > 0) {
            form_data.city = data[0].name;
            form_data.city_id = data[0].value;
            form_data.city_id_error = '';

            // fetch area
            if(form_data.area) {
              this.fetchAreaList(form_data, true);
            }
          }

          form_data.pincode_error = '';

          this.setState({ cityList });
        } else {
          form_data.state = '';
          form_data.city = '';
          form_data.city_id = '';
          form_data.pincode_error = res.pfwresponse.result.error || 'Please enter valid pincode';
        }
      } catch (err) {
        this.setState({
          show_loader: false,
        });
        toast('Something went wrong');
      }

    } else {
      form_data.state = '';
    }

    this.setState({
      form_data: form_data,
      isLoadingCity: false,
    });
  };

  render() {

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        skelton={this.state.skelton}
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title={this.setEditTitle("Address details")}
        buttonTitle="CONTINUE"
        withProvider={true}
        handleClick2={this.handleClick2}
        buttonData={this.state.bottomButtonData}
        handleClick={() => this.handleClick()}
      >

        <div className="common-top-page-subtitle">
          Policy document will be delivered to this address
        </div>

        <FormControl fullWidth>
          <div className="InputField">
            <Input
              type="text"
              id="addr_line1"
              label="Address line 1"
              name="addr_line1"
              placeholder="ex: 16/1 Queens paradise"
              error={(this.state.form_data.addr_line1_error) ? true : false}
              helperText={this.state.form_data.addr_line1_error}
              value={this.state.form_data.addr_line1 || ''}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              type="text"
              id="addr_line2"
              label="Address line 2"
              name="addr_line2"
              placeholder="ex: 16/1 Queens paradise"
              error={(this.state.form_data.addr_line2_error) ? true : false}
              helperText={this.state.form_data.addr_line2_error}
              value={this.state.form_data.addr_line2 || ''}
              onChange={this.handleChange()} />
          </div>
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                type="number"
                width="40"
                label="Pincode"
                name="pincode"
                disabled={true}
                error={(this.state.pincode_error) ? true : false}
                helperText={this.state.pincode_error}
                value={this.state.form_data.pincode || ''}
              />
            </div>
          </FormControl>
          <div className="InputField">
            <DropDownNew2
              width="40"
              dataType="AOB"
              options={this.state.cityList}
              id="city"
              label="City"
              name="city"
              disabled={!this.state.cityList.length}
              error={this.state.form_data.city_id_error ? true : false}
              helperText={
                this.state.isLoadingCity ? 
                  <DotDotLoader className="insurance-dot-loader" /> :
                  this.state.form_data.city_id_error
              }
              value={this.state.form_data.city_id || ''}
              onChange={this.handleChange('city_id')}
            />
          </div>
          <div className="InputField">
            <DropDownNew2
              width="40"
              dataType="AOB"
              options={this.state.areaList || [{name: 'null' , value: 'null'}]}
              id="area"
              label="Area"
              name="area"
              disabled={!this.state.areaList.length}
              error={this.state.form_data.area_id_error ? true : false}
              helperText={
                this.state.isLoadingArea ?
                  <DotDotLoader className="insurance-dot-loader" /> :
                  this.state.form_data.area_id_error
              }
              value={this.state.form_data.area_id || ''}
              onChange={this.handleChange('area_id')}
            />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="state"
              label="State"
              name="state"
              value={this.state.form_data.state || ''}
            />
          </div>
        </FormControl>

        <ConfirmDialog parent={this} />
      </Container>
    );
  }
}

export default StarAddress;