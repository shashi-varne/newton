import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import {validateNumber} from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import scrollIntoView from 'scroll-into-view-if-needed';


import DropdownWithoutIcon from '../../../../common/ui/SelectWithoutIcon';
import DotDotLoader from '../../../../common/ui/DotDotLoader';

class GroupHealthPlanAddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {
                city_list: [],
                p_city_list: []
            },
            ctaWithProvider: true,
            get_lead: true,
            next_state: 'nominee',
            screen_name: 'address_screen',
            checked: false
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
            })
        }

        let lead = this.state.lead || {};
        let form_data =  {
            ...this.state.form_data,
            ...lead.permanent_address
        };

        let correspondence_address = lead.correspondence_address || {};
        let permanent_address = lead.permanent_address || {};

        if (this.state.provider === 'RELIGARE') {
            form_data = {
                ...this.state.form_data,
                addressline: correspondence_address.addressline || '',
                addressline2: correspondence_address.addressline2 || '',
                pincode: correspondence_address.pincode || '',
                city: correspondence_address.city || '',
                state: correspondence_address.state || '',
                country: correspondence_address.country || '',

                p_addressline: permanent_address.addressline || '',
                p_addressline2: permanent_address.addressline2 || '',
                p_pincode: permanent_address.pincode || '',
                p_city: permanent_address.city || '',
                p_state: permanent_address.state || '',
                p_country: permanent_address.country || '',

            };

            if(form_data.pincode) {
                this.getCityListReligare({form_data, name: 'pincode'});
            };

            if(form_data.p_pincode) {
                this.getCityListReligare({form_data, name: 'p_pincode'});
            };
        }
        
        if(this.state.provider === 'HDFCERGO') {
            form_data.city = lead.city;
        }

        if (form_data.pincode) {
            form_data.pincode_match = true;
        }

        this.setState({
            form_data: form_data,
            lead: lead,
        })


        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                handleClick: this.handleClick
            }
        })

    }

    handleChange = name => event => {

        if (!name) {
            name = event.target.name;
        }
        var value = event.target ? event.target.value : event;
        var form_data = this.state.form_data || {};

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

        if(this.state.isLoadingCity) {
            toast('Fetching data, please wait');
            return;
        }

        let { provider, form_data, checked } = this.state;

        this.sendEvents('next');
        let keysMapper = {
            'addressline': 'Address line 1',
            'addressline2': 'Address line 2',
            'pincode': 'pincode',
            'city': 'city',
            'p_addressline': 'Address line 1',
            'p_addressline2': 'Address line 2',
            'p_pincode': 'pincode',
            'p_city': 'city'
        }

        let keys_to_check = ['addressline', 'addressline2', 'pincode'];
        if (provider === 'RELIGARE') {
            if (checked) {
                form_data.p_pincode_error = '';
                form_data.p_city_error = '';
                form_data.p_addressline_error = '';
                form_data.p_addressline2_error = '';
                keys_to_check = ['addressline', 'addressline2', 'pincode', 'city'];
            } else {
                keys_to_check = ['addressline', 'addressline2', 'pincode', 'city',
                    'p_addressline', 'p_addressline2', 'p_pincode', 'p_city'];
            }

        }

        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = 'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            }
        }


        let canSubmitForm = true;

        if (provider === 'HDFCERGO' && !form_data.pincode_match) {
            form_data.pincode_error = 'verifying pincode';
            canSubmitForm = false;
        }


        if (form_data.pincode.length !== 6 || !validateNumber(form_data.pincode) || 
        form_data.pincode_error) {
            form_data['pincode_error'] = 'Please enter valid pincode';
        }

        if (provider === 'RELIGARE' && !this.state.checked && (form_data.p_pincode.length !== 6 || !validateNumber(form_data.p_pincode) || 
        form_data.p_pincode_error)) {
            form_data['p_pincode_error'] = 'Please enter valid pincode';
        }

        for (var key in form_data) {
            if (key.indexOf('error') >= 0) {
                if (form_data[key]) {
                    canSubmitForm = false;
                    toast('Please check all the errors');
                    break;
                }
            }
        }


        this.setState({
            form_data: form_data
        });

        if (canSubmitForm) {

            let body = {};
            if (provider === 'HDFCERGO') {
                body = {
                    permanent_address: {  //for ergo, in backend we are storing current in permanent_address key
                        addressline: form_data.addressline,
                        addressline2: form_data.addressline2,
                        pincode: form_data.pincode,
                        state: form_data.state,
                        city: form_data.city
                    }
                }

            }

            if (provider === 'RELIGARE') {

                body = {

                    correspondence_address: {
                        addressline: form_data.addressline,
                        addressline2: form_data.addressline2,
                        pincode: form_data.pincode,
                        state: form_data.state,
                        city: form_data.city
                    },

                    permanent_address: {
                        addressline: checked ? form_data.addressline : form_data.p_addressline,
                        addressline2: checked ? form_data.addressline2 : form_data.p_addressline2,
                        pincode: checked ? form_data.pincode : form_data.p_pincode,
                        state: checked ? form_data.state : form_data.p_state,
                        city: checked ? form_data.city : form_data.p_city
                    },

                };

            }

            this.updateLead(body);
        }
    }


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
                "permanent_current_same": this.state.checked ? 'yes' : 'no',
                "permanent_address_entered": this.state.form_data.p_addressline ? 'yes' : 'no',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

   
    handlePincodeErgo = name => async (event) => {
        const pincode = event.target.value;

        if (pincode.length > 6) {
            return;
        }

        let form_data = this.state.form_data;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';
        form_data.pincode_match = false;



        if (pincode.length === 6) {
            this.setState({
                form_data: form_data,
                isLoadingCity: true
            })
            try {
                const res = await Api.get((`/api/ins_service/api/insurance/hdfcergo/pincode/validate?pincode=${pincode}&city=${this.state.lead.city}`));

                this.setState({isLoadingCity: false});
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
            form_data: form_data
        })
    }

    formatCityOpts(opts = []) {
        return opts.map(opt => {
          return {
            name: opt.city,
            value: opt.city,
            state: opt.state
          }
        })
    }

    getCityListReligare = async ({form_data={}, name = ''}) => {


        this.setState({isLoadingCity: true});
        const res = await Api.get((`/api/ins_service/api/insurance/religare/pincode/validate?pincode=${form_data[name]}`));
        this.setState({isLoadingCity: false});
        let { country } = form_data;
        let pincode_error = '';

        let list = [];
        let resultData = res.pfwresponse.result;
        if (resultData.pincode_match) {
            list = this.formatCityOpts(resultData.city_state_list);
        } else {
            pincode_error = 'Invalid pincode';
        }

        if (name === 'pincode') {
            form_data.city_list = list;
            let data = list.filter(city => city.name === form_data.city);
          
            form_data.city = '';
            if(data.length > 0) {
                form_data.city = data[0].name;
            }
            
            form_data.state = list.length !== 0 ? list[0].state : '';
            form_data.pincode_error = pincode_error;
            form_data.country = country || 'India';
        } else {
            form_data.p_city_list = list;

            let data = list.filter(city => city.name === form_data.p_city);
          
            form_data.p_city = '';
            if(data.length > 0) {
                form_data.p_city = data[0].name;
            }

            form_data.p_state = list.length !== 0 ? list[0].state : '';
            form_data.p_pincode_error = pincode_error;
            form_data.p_country = country || 'India';
        }

        console.log(form_data);

        this.setState({
            form_data: form_data
        })
    }


    handlePincodeReligare = name => async (event) => {
        const pincode = event.target.value;

        if (pincode.length > 6) {
            return;
        }

        let form_data = this.state.form_data;
        form_data[name] = pincode;
        form_data[name + '_error'] = '';

        if(name === 'pincode') {
            form_data.city = '';
            form_data.state = '';
        } else {
            form_data.p_city = '';
            form_data.p_state = '';
        }

        this.setState({
            form_data: form_data
        })

        if (pincode.length === 6) {
           this.getCityListReligare({form_data, name});
        } 

       
    }

    setPermAddress = () => {
        if (!this.state.checked) {
            this.handleScroll();
        }
    }

    handleScroll = (value) => {
        setTimeout(function () {
            let element = document.getElementById('addressScroll');
            if (!element || element === null) {
                return;
            }

            scrollIntoView(element, {
                block: 'start',
                inline: 'nearest',
                behavior: 'smooth'
            })

        }, 50);
    }

    handleCheckBox = name => event => {
        this.setState({
            [name]: event.target.checked
        }, () => {
            this.setPermAddress();
        })

    };

    renderReligareAddress() {
        if (this.state.provider === 'RELIGARE') {
            return (

                <div>
                    <div className="InputField" style={{ marginBottom: '0px !important' }}>
                        <div className="CheckBlock2" style={{ margin: '10px 0' }}>
                            <Grid container spacing={16} alignItems="center">
                                <Grid item xs={1} className="TextCenter">
                                    <Checkbox
                                        defaultChecked
                                        checked={this.state.checked}
                                        color="default"
                                        // value={this.state.checked || false}
                                        name="checked"
                                        onChange={this.handleCheckBox('checked')}
                                        className="Checkbox" />
                                </Grid>
                                <Grid item xs={11}>
                                    <div className="checkbox-text">Is permanent address same as current address?
                                </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    {!this.state.checked &&

                        <div>
                            <div style={{ color: '#64778D', fontSize: 13, fontWeight: 300, marginBottom: '20px' }}>
                                Permanent Address
                            </div>

                            <div className="InputField">
                                <Input
                                    type="number"
                                    width="40"
                                    disabled={this.state.checked}
                                    label="Pincode"
                                    id="p_pincode"
                                    name="p_pincode"
                                    maxLength="6"
                                    error={(this.state.form_data.p_pincode_error) ? true : false}
                                    helperText={this.state.form_data.p_pincode_error}
                                    value={this.state.form_data.p_pincode || ''}
                                    onChange={this.handlePincodeReligare('p_pincode')} />
                            </div>

                            <div className="InputField">
                                <Input
                                    type="text"
                                    disabled={this.state.checked}
                                    id="p_addressline"
                                    label="Address line 1"
                                    name="p_addressline"
                                    placeholder="ex: 16/1 Queens paradise"
                                    error={(this.state.form_data.p_addressline_error) ? true : false}
                                    helperText={this.state.form_data.p_addressline_error}
                                    value={this.state.form_data.p_addressline || ''}
                                    onChange={this.handleChange()} />
                            </div>

                            <div className="InputField">
                                <Input
                                    type="text"
                                    disabled={this.state.checked}
                                    id="p_addressline2"
                                    label="Address line 2"
                                    name="p_addressline2"
                                    placeholder="ex: 16/1 Queens paradise"
                                    error={(this.state.form_data.p_addressline2_error) ? true : false}
                                    helperText={this.state.form_data.p_addressline2_error}
                                    value={this.state.form_data.p_addressline2 || ''}
                                    onChange={this.handleChange()} />
                            </div>

                            <div className="InputField">
                                <DropdownWithoutIcon
                                    width="40"
                                    dataType="AOB"
                                    options={this.state.form_data.p_city_list}
                                    id="p_city"
                                    label="City"
                                    name="p_city"
                                    disabled={!this.state.form_data.p_city_list.length}
                                    error={this.state.form_data.p_city_error ? true : false}
                                    helperText={
                                        this.state.isLoadingCity ?
                                            <DotDotLoader className="insurance-dot-loader" /> :
                                            this.state.form_data.p_city_error
                                    }
                                    value={this.state.form_data.p_city || ''}
                                    onChange={this.handleChange('p_city')}
                                />
                            </div>

                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="p_state"
                                    label="State"
                                    name="p_state"
                                    value={this.state.form_data.p_state || ''}
                                />
                            </div>
                            <div id="addressScroll" ref={this.addressRef} className="InputField">
                                <Input
                                    disabled={true}
                                    id="p_country"
                                    label="Country"
                                    name="p_country"
                                    value={this.state.form_data.p_country || ''}
                                />
                            </div>

                        </div>
                    }
                </div>
            );
        }

        return null;

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
                    {this.state.provider==='RELIGARE'?' Policy will be delivered to the current address':'Policy will be delivered to this address'}
                </div>
                {this.state.provider==='RELIGARE'&&
                <div style={{ color: '#64778D', fontSize: 13, fontWeight: 300, marginTop: '37px', marginBottom: '20px' }}>
                    Current Address
                </div>}
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
                    {this.state.provider === 'HDFCERGO' &&
                        <div>
                            <div className="InputField">
                                <Input
                                    type="number"
                                    width="40"
                                    label="Pincode *"
                                    id="pincode"
                                    name="pincode"
                                    maxLength="6"
                                    error={(this.state.form_data.pincode_error) ? true : false}
                                    helperText={
                                        this.state.isLoadingCity ?
                                            <DotDotLoader className="insurance-dot-loader" /> :
                                            this.state.form_data.pincode_error
                                    }
                                    value={this.state.form_data.pincode || ''}
                                    onChange={this.handlePincodeErgo('pincode')} />
                            </div>

                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="city"
                                    label="City *"
                                    name="city"
                                    value={this.state.form_data.city || ''}
                                />
                            </div>
                        </div>
                    }

                    {this.state.provider === 'RELIGARE' &&

                        <div>
                            <div className="InputField">
                                <Input
                                    type="number"
                                    width="40"
                                    label="Pincode *"
                                    id="pincode"
                                    name="pincode"
                                    maxLength="6"
                                    error={(this.state.form_data.pincode_error) ? true : false}
                                    helperText={this.state.form_data.pincode_error}
                                    value={this.state.form_data.pincode || ''}
                                    onChange={this.handlePincodeReligare('pincode')} />
                            </div>


                            <div className="InputField">
                                <DropdownWithoutIcon
                                    width="40"
                                    dataType="AOB"
                                    options={this.state.form_data.city_list}
                                    id="city"
                                    label="City"
                                    name="city"
                                    disabled={!this.state.form_data.city_list.length}
                                    error={this.state.form_data.city_error ? true : false}
                                    helperText={
                                        this.state.isLoadingCity ?
                                            <DotDotLoader className="insurance-dot-loader" /> :
                                            this.state.form_data.city_error
                                    }
                                    value={this.state.form_data.city || ''}
                                    onChange={this.handleChange('city')}
                                />
                            </div>
                        </div>


                    }


                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="state"
                            label="State *"
                            name="state"
                            value={this.state.form_data.state || ''}
                        />
                    </div>

                    {this.renderReligareAddress()}
                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanAddressDetails;