import React, { Component } from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../../common/ui/Input';
import { yesNoOptions } from '../../../constants';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';

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
            checked: false
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
                "product": 'religare care',
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

        if (pincode.length > 6) {
            return;
        }

        let form_data = this.state.form_data;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';

        if (pincode.length === 6) {
            const res = await Api.get((`/api/ins_service/api/insurance/hdfcergo/pincode/validate?pincode=${pincode}`));
            let resultData = res.pfwresponse.result[0] || '';

            let { city, state, country } = form_data;
            let pincode_error = '';
            if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
                if (resultData.dmi_city_name === 'NA') {
                    city = resultData.district_name || resultData.division_name || resultData.taluk;
                } else {
                    city = resultData.dmi_city_name;
                }
                state = resultData.state_name;
                country = resultData.country_name;
            } else {
                city = '';
                state = '';
                pincode_error = 'Invalid pincode';
            }
            
            if (name === 'pincode') {
                form_data.city = city;
                form_data.state = state;
                form_data.pincode_error = pincode_error;
            } else {
                form_data.pr_city = city;
                form_data.pr_state = state;
                form_data.pr_pincode_error = pincode_error;
            }

        }

        this.setState({
            form_data: form_data
        })
    }

    handleChangeRadio = name => event => {

        let form_data = this.state.form_data || {};

        let optionsMapper = {
            'checked': yesNoOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data:form_data
        })

        if(form_data.checked==='YES'){
            let data={
                addressline:this.state.form_data.addressline,
                addressline2:this.state.form_data.addressline2,
                pincode:this.state.form_data.pincode,
                city:this.state.form_data.city,
                state:this.state.form_data.state,

                pr_addressline:this.state.form_data.addressline,
                pr_addressline2:this.state.form_data.addressline2,
                pr_pincode:this.state.form_data.pincode,
                pr_city:this.state.form_data.city,
                pr_state:this.state.form_data.state
            }
            this.setState({
                form_data:data,
                checked:!this.state.checked
            })
        }
        else{
            this.setState({
                checked:false
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

                    <div className="InputField">
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

                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="city"
                            label="City"
                            name="city"
                            value={this.state.form_data.city || ''}
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
                    </div>

                    <div className="InputField" style={{ marginBottom: '0px !important' }}>

                        <div className="checkbox-text">Is permanent address same as current address?

                        <div className="InputField">
                                <RadioWithoutIcon
                                    width="40"
                                    class="Address:"
                                    defaultChecked
                                    checked={this.state.checked}
                                    options={yesNoOptions}
                                    id="address"
                                    name="checked"
                                    error={(this.state.form_data.address_error) ? true : false}
                                    helperText={this.state.form_data.address_error}
                                    value={this.state.form_data.address || ''}
                                    onChange={this.handleChangeRadio('checked')} />
                            </div>
                            <div className="permanet-address">
                                Permanent Address 
                            </div>
                        </div>
                        </div>

                        {!this.state.checked &&
                        <div>
                            
                        <div className="InputField">
                        <Input
                            type="text"
                            id="pr_addressline"
                            label="Address line 1"
                            name="pr_addressline"
                            placeholder="ex: 16/1 Queens paradise"
                            disabled={this.state.checked}
                            error={(this.state.form_data.addressline_error) ? true : false}
                            helperText={this.state.form_data.addressline_error}
                            value={this.state.form_data.pr_addressline|| ''}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            type="text"
                            id="pr_addressline2"
                            label="Address line 2"
                            name="pr_addressline2"
                            placeholder="ex: 16/1 Queens paradise"
                            disabled={this.state.checked}
                            error={(this.state.form_data.addressline2_error) ? true : false}
                            helperText={this.state.form_data.addressline2_error}
                            value={this.state.form_data.pr_addressline2 ||''}
                            onChange={this.handleChange()} />
                    </div>

                            <div className="InputField">
                                <Input
                                    type="number"
                                    width="40"
                                    label="Pincode"
                                    id="pr_pincode"
                                    name="pr_pincode"
                                    maxLength="6"
                                    disabled={this.state.checked}
                                    error={(this.state.form_data.pincode_error) ? true : false}
                                    helperText={this.state.form_data.pincode_error}
                                    value={this.state.form_data.pr_pincode || ''}
                                    onChange={this.handlePincode('pr_pincode')} />
                            </div>

                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="pr_city"
                                    label="City"
                                    name="pr_city"
                                    value={this.state.form_data_permanent.city || ''}
                                />
                            </div>
                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="pr_state"
                                    label="State"
                                    name="pr_state"
                                    value={this.state.form_data.pr_state || ''}
                                />
                            </div>
                            </div>
                        }

                </FormControl>
            </Container>
        );
    }
}

export default AddressDetails;
