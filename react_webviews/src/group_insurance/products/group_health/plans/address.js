import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../../common/ui/Input';
import { yesNoOptions } from '../../../constants';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';

class AddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            get_lead: true,
            next_state: 'nominee',
            form_data_permanent:{},
        }
    }

    handleChange = name => event => {

        if (!name) {
            name = event.target.name;
        }
        let value = event.target ? event.target.value : '';
        let form_data = this.state.form_data || {};

        if (name === 'mobile_number') {
            if (value.length <= 10) {
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        } else {
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }


        this.setState({
            form_data: form_data
        })

    };

    handleChangePermanent = name => event => {

        if (!name) {
            name = event.target.name;
        }
        let value = event.target ? event.target.value : '';
        let form_data = this.state.form_data_permanent|| {};

        if (name === 'mobile_number') {
            if (value.length <= 10) {
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        } else {
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }

        this.setState({
            form_data_permanent: form_data
        })
    };


    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = async () => {

        this.sendEvents('next');
        let keysMapper = {
            'addressline': 'Address line 1',
            'addressline2': 'Address line 2',
            'pincode': 'pincode' 
        }

        let keys_to_check = ['addressline', 'addressline2', 'pincode']

        let form_data = this.state.form_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }


        let canSubmitForm = true;
        
        if(!form_data.pincode_match) {
            form_data.pincode_error = 'verifying pincode';
            canSubmitForm = false;
        }

        for (var key in form_data) {
            if (key.indexOf('error') >= 0) {
                if (form_data[key]) {
                    canSubmitForm = false;
                    break;
                }
            }
        }


        this.setState({
            form_data: form_data
        })


        if (canSubmitForm) {
            let body = {
                permanent_address: {
                    addressline: this.state.form_data.addressline,
                    addressline2: this.state.form_data.addressline2,
                    pincode: this.state.form_data.pincode,
                    state: this.state.form_data.state,
                    city: this.state.form_data.city
                }
            }

            this.updateLead(body);
        }
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'address details',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'address_entered' : this.state.form_data.addressline ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    
    handlePincode = name => async (event) => {
        const pincode = event.target.value;
    
        if(pincode.length > 6){
            return;
        }
    
        let form_data = this.state.form_data;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';
        form_data.pincode_match = false;
    
        
    
        if (pincode.length === 6) {
            this.setState({
                form_data: form_data
              })
          try {
            const res = await Api.get((`/api/ins_service/api/insurance/hdfcergo/pincode/validate?pincode=${pincode}&city=${this.state.lead.city}`));
    
            if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.pincode_match) {
              form_data.state = res.pfwresponse.result.state;
              form_data.pincode_match = true;
              form_data[name + '_error'] = '';
            } else {
              form_data.state = '';
              form_data.pincode_match = false;
              form_data[name + '_error'] = res.pfwresponse.result.error || 'Please enter valid pincode';
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
          form_data: form_data,
        })
    }

    handlePincodePermanent = name => async (event) => {
        const pincode = event.target.value;
    
        if(pincode.length > 6){
            return;
        }
    
        let form_data = this.state.form_data_permanent;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';
        form_data.pincode_match = false;
    
        
    
        if (pincode.length === 6) {
            this.setState({
                form_data_permanent: form_data
              })
          try {
            const res = await Api.get((`/api/ins_service/api/insurance/hdfcergo/pincode/validate?pincode=${pincode}&city=${this.state.lead.city}`));
    
            if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.pincode_match) {
              form_data.state = res.pfwresponse.result.state;
              form_data.pincode_match = true;
              form_data[name + '_error'] = '';
            } else {
              form_data.state = '';
              form_data.pincode_match = false;
              form_data[name + '_error'] = res.pfwresponse.result.error || 'Please enter valid pincode';
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
          form_data_permanent: form_data,
        })
    }


    handleChangeRadio = name => event => {


        let form_data = this.state.form_data || {};

        let optionsMapper = {
            'address': yesNoOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

        if(form_data.address==='YES'){
            let data={
                addressline:this.state.form_data.addressline,
                addressline2:this.state.form_data.addressline2,
                pincode:this.state.form_data.pincode,
                city:this.state.form_data.city,
                state:this.state.form_data.state
            }
            this.setState({
                form_data_permanent:data
            })
        }
        else{
            let data={
                addressline:'',
                addressline2:'',
                pincode:'',
                city:'',
                state:''
            }
            this.setState({
                form_data_permanent:data
            })
        }

    };

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                className="newAddress"
                showLoader={this.state.show_loader}
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <div className="religare-address">
                <div className="address-details">
                        Address Details
                        <span className="address-subText">Policy document will be delivered to this address</span>
                        <span className="current-address">Current address</span>
                    </div>
                    </div>

                <FormControl fullWidth>
                <div className="InputField" style={{ marginBottom: '0px !important' }}>
                    
                    <div className="InputField input-religare">
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
                    <div className="InputField input-religare">
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

                    <div className="InputField input-religare">
                        <Input
                            type="number"
                            width="40"
                            label="Pincode"
                            id="pincode"
                            name="pincode"
                            maxLength="6"
                            error={(this.state.form_data.pincode_error) ? true : false}
                            helperText={this.state.form_data.pincode_error}
                            value={this.state.form_data.pincode || ''}
                            onChange={this.handlePincode('pincode')} />
                    </div>

                    <div className="InputField input-religare">
                        <Input
                            disabled={true}
                            id="city"
                            label="City"
                            name="city"
                            value={this.state.form_data.city || ''}
                        />
                    </div>
                    <div className="InputField input-religare">
                        <Input
                            disabled={true}
                            id="state"
                            label="State"
                            name="state"
                            value={this.state.form_data.state || ''}
                        />
                    </div>
                    </div>
                    <div className="InputField" style={{ marginBottom: '0px !important' }}>

                        <div className="checkbox-text">Is permanent address same as current address?

                        <div className="InputField">
                                <RadioWithoutIcon
                                    width="40"
                                    class="Gender:"
                                    options={yesNoOptions}
                                    id="gender"
                                    name="gender"
                                    error={(this.state.form_data.gender_error) ? true : false}
                                    helperText={this.state.form_data.gender_error}
                                    value={this.state.form_data.gender || ''}
                                    onChange={this.handleChangeRadio('address')} />
                            </div>

                        </div>
                        <div>
                            <div className="permanet-address">
                                Permanent Address Details
                        </div>

                        <div className="InputField input-religare">
                        <Input
                            type="text"
                            id="addresslinePermanent"
                            label="Address line 1"
                            name="addressline"
                            placeholder="ex: 16/1 Queens paradise"
                            error={(this.state.form_data.addressline_error) ? true : false}
                            helperText={this.state.form_data.addressline_error}
                            value={this.state.form_data_permanent.addressline|| ''}
                            onChange={this.handleChangePermanent()} />
                    </div>
                    <div className="InputField input-religare">
                        <Input
                            type="text"
                            id="addressline2Permanent"
                            label="Address line 2"
                            name="addressline2"
                            placeholder="ex: 16/1 Queens paradise"
                            error={(this.state.form_data.addressline2_error) ? true : false}
                            helperText={this.state.form_data.addressline2_error}
                            value={this.state.form_data_permanent.addressline2 ||''}
                            onChange={this.handleChangePermanent()} />
                    </div>

                            <div className="InputField input-religare">
                                <Input
                                    type="number"
                                    width="40"
                                    label="Pincode"
                                    id="pincodePermanent"
                                    name="pincode"
                                    maxLength="6"
                                    error={(this.state.form_data.pincode_error) ? true : false}
                                    helperText={this.state.form_data.pincode_error}
                                    value={this.state.form_data_permanent.pincode || ''}
                                    onChange={this.handlePincodePermanent('pincode')} />
                            </div>

                            <div className="InputField input-religare">
                                <Input
                                    disabled={true}
                                    id="cityPermanent"
                                    label="City"
                                    name="city"
                                    value={this.state.form_data_permanent.city || ''}
                                />
                            </div>
                            <div className="InputField input-religare">
                                <Input
                                    disabled={true}
                                    id="statePermanent"
                                    label="State"
                                    name="state"
                                    value={this.state.form_data_permanent.state || ''}
                                />
                            </div>

                        </div>
                    </div>

                </FormControl>
            </Container>
        );
    }
}

export default AddressDetails;