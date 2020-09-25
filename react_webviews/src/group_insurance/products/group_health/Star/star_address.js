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
import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import { isEmpty } from '../../../../utils/validators';

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
    }
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
    lead.permanent_address = lead.permanent_address || {};
    const groupHealthPlanData = this.state.groupHealthPlanData || {};
    let form_data = lead.permanent_address || {};

    form_data.city = lead.permanent_address.city;
    form_data.pincode = groupHealthPlanData.pincode || lead.permanent_address.pincode || '';
    this.setState({
      form_data,
      bottomButtonData: {
        ...this.state.bottomButtonData,
        handleClick: this.handleClick,
      },
    }, () => {
      this.handlePincode();
    });
    console.log('IN HERE 0');
  }

  handleChange = name => event => {
    console.log('=====', name, event);
    if (!name) {
      name = event.target.name;
    }
    const value = event.target ? event.target.value : event;
    let form_data = this.state.form_data || {};

    if (name === 'city_id') {
      form_data.city_id = value;
      form_data.city_id_error = '';
      form_data.city = this.state.cityList.find(city => city.value === value).name;
      this.setState({
        areaList: [],
        form_data,
      }, async () => {
        try {
          const { pincode, city_id } = form_data;
          const res = await Api.get(`/api/ins_service/api/insurance/star/get/area?pincode=${pincode}&city_id=${city_id}`);
          if (res.pfwresponse.status_code === 200 && !isEmpty(res.pfwresponse.result)) {
            const areaList = this.formatAreaOpts(res.pfwresponse.result.areas);
            // form_data.area = areaList[0].name;
            this.setState({ areaList });
          }
        } catch(err) {
          console.log(err);
          toast(err);
        }
      });
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

    let { provider, form_data } = this.state;

    this.sendEvents('next');
    const keysMapper = {
      'addressline': 'Address line 1',
      'addressline2': 'Address line 2',
      'pincode': 'pincode',
      'city_id': 'city',
      'area_id': 'area',
      'state': 'state',
    };

    
    const keys_to_check = [
      'addressline',
      'addressline2',
      'pincode',
      'city_id',
      'area_id',
      'state',
    ];

    let canSubmitForm = true;

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
      const body = {
        permanent_address: {
          ...data_to_send,
          'district': '',
        },
      };
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
        'address_entered': this.state.form_data.addressline ? 'yes' : 'no',
        'address2_entered': this.state.form_data.addressline2 ? 'yes' : 'no',
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
        const res = await Api.get((`/api/ins_service/api/insurance/star/get/city?pincode=${pincode}`));

        if (res.pfwresponse.status_code === 200 && !isEmpty(res.pfwresponse.result)) {
          const cityList = this.formatCityOpts(res.pfwresponse.result.cities);
          form_data.state = res.pfwresponse.result.state;
          // form_data.city = cityList[0].name;
          // form_data.city_id = cityList[0].value;
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
          show_loader: false
        });
        toast('Something went wrong');
      }

    } else {
      form_data.state = '';
    }

    this.setState({
      form_data: form_data
    })
  }

  render() {

    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
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
              id="addressline"
              label="Address line 1"
              name="addressline"
              placeholder="ex: 16/1 Queens paradise"
              error={(this.state.form_data.addressline_error) ? true : false}
              helperText={this.state.form_data.addressline_error}
              value={this.state.form_data.addressline || ''}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              type="text"
              id="addressline2"
              label="Address line 2"
              name="addressline2"
              placeholder="ex: 16/1 Queens paradise"
              error={(this.state.form_data.addressline2_error) ? true : false}
              helperText={this.state.form_data.addressline2_error}
              value={this.state.form_data.addressline2 || ''}
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
            <DropdownWithoutIcon
              width="40"
              dataType="AOB"
              options={this.state.cityList}
              id="city"
              label="City"
              name="city"
              disabled={!this.state.cityList.length}
              error={this.state.form_data.city_id_error ? true : false}
              helperText={this.state.form_data.city_id_error}
              value={this.state.form_data.city_id || ''}
              onChange={this.handleChange('city_id')}
            />
          </div>
          <div className="InputField">
            <DropdownWithoutIcon
              width="40"
              dataType="AOB"
              options={this.state.areaList}
              id="area"
              label="Area"
              name="area"
              disabled={!this.state.areaList.length}
              error={this.state.form_data.area_id_error ? true : false}
              helperText={this.state.form_data.area_id_error}
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