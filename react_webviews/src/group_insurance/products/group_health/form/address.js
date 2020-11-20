import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import {validateNumber, validateLengthDynamic } from 'utils/validators';
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
            checked: false,
            sameAddressCheck: false
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
            ...lead.address_details.permanent_address
        };                                            

        let correspondence_address = lead.address_details.correspondence_address || {};
        let permanent_address = lead.address_details.permanent_address || {};
 
        if (this.state.provider === 'RELIGARE') {
            form_data = {
                ...this.state.form_data,
                addr_line1: correspondence_address.addr_line1 || '',
                addr_line2: correspondence_address.addr_line2 || '',
                pincode: correspondence_address.pincode || '',
                city: correspondence_address.city || '',
                state: correspondence_address.state || '',
                country: correspondence_address.country || '',

                p_addr_line1: permanent_address.addr_line1 || '',
                p_addr_line2: permanent_address.addr_line2 || '',
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
            form_data.city = lead.address_details.permanent_address.city
            form_data.pincode = lead.address_details.permanent_address.pincode || ""
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

        if(name.includes('addr_line1')){
            value = event.target ? event.target.value.substr(0, 60) : event;
        }
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
            'addr_line1': 'Address line 1',
            'addr_line2': 'Address line 2',
            'pincode': 'pincode',
            'city': 'city',
            'p_addr_line1': 'Address line 1',
            'p_addr_line2': 'Address line 2',
            'p_pincode': 'pincode',
            'p_city': 'city'
        }

        let keys_to_check = ['addr_line1', 'addr_line2', 'pincode'];
        if (provider === 'RELIGARE') {
            if (checked) {
                form_data.p_pincode_error = '';
                form_data.p_city_error = '';
                form_data.p_addr_line1_error = '';
                form_data.p_addr_line2_error = '';
                keys_to_check = ['addr_line1', 'addr_line2', 'pincode', 'city'];
            } else {
                keys_to_check = ['addr_line1', 'addr_line2', 'pincode', 'city',
                    'p_addr_line1', 'p_addr_line2', 'p_pincode', 'p_city'];
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

        for(let key in form_data){
            if(key === 'addressline' || key ==="addressline2" || key ==="p_addressline" || key === "p_addressline2"){
                if(validateLengthDynamic(form_data[key], 4)){
                    form_data[key+'_error'] = "Please enter at least 4 characters";
                }
            }
        }
        
        if(this.state.sameAddressCheck){
            for(var form_key in form_data){
                if(form_key.includes('p_') && form_key.includes('_error')){
                    delete form_data[form_key];
                }
            }
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
                    
                    "address_details": {
                        "permanent_address": {
                            "state": form_data.state,
                            "addr_line1": form_data.addr_line1,
                            "pincode": form_data.pincode,
                            "addr_line2": form_data.addr_line2,
                            "city": form_data.city
                        },
                        "correspondence_addr_same": 'y'
                    }
                }
            }


            if (provider === 'RELIGARE') {
                body = {
                    
                    "address_details": {
                        "permanent_address": {
                            "state": form_data.state,
                            "addr_line1": form_data.addr_line1,
                            "pincode": form_data.pincode,
                            "addr_line2": form_data.addr_line2,
                            "city": form_data.city
                        },
                        "correspondence_addr_same": checked ? 'y' : 'n',
                        "correspondence_address": {
                            "state": checked ? form_data.state : form_data.p_state,
                            "addr_line1": checked ? form_data.addr_line1 : form_data.p_addr_line1,
                            "pincode":checked ? form_data.pincode : form_data.p_pincode,
                            "addr_line2":  checked ? form_data.addr_line2 : form_data.p_addr_line2,
                            "city": checked ? form_data.city : form_data.p_city
                        }
                    }
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
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'address details',
                'from_edit': this.props.edit ? 'yes' : 'no',
                'address_entered': this.state.form_data.addr_line1 ? 'yes' : 'no',
                "permanent_current_same": this.state.checked ? 'yes' : 'no',
                "permanent_address_entered": this.state.form_data.p_addr_line1 ? 'yes' : 'no',
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
        let cityName = this.state.lead.address_details.permanent_address.city
       

        if (pincode.length === 6) {
            this.setState({
                form_data: form_data,
                isLoadingCity: true
            })
            try {
                const res = await Api.get((`api/insurancev2/api/insurance/proposal/hdfc_ergo/validate_pincode?pincode=${pincode}&city=${cityName}`));

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
        const res = await Api.get((`api/insurancev2/api/insurance/proposal/religare/validate_pincode?pincode=${form_data[name]}`));
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
            [name]: event.target.checked,
            sameAddressCheck: !this.state.sameAddressCheck
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
                                    id="p_addr_line1"
                                    label="Address line 1"
                                    name="p_addr_line1"
                                    placeholder="ex: 16/1 Queens paradise"
                                    error={(this.state.form_data.p_addr_line1_error) ? true : false}
                                    helperText={this.state.form_data.p_addr_line1_error}
                                    value={this.state.form_data.p_addr_line1 || ''}
                                    onChange={this.handleChange()} />
                            </div>

                            <div className="InputField">
                                <Input
                                    type="text"
                                    disabled={this.state.checked}
                                    id="p_addr_line2"
                                    label="Address line 2"
                                    name="p_addr_line2"
                                    placeholder="ex: 16/1 Queens paradise"
                                    error={(this.state.form_data.p_addr_line2_error) ? true : false}
                                    helperText={this.state.form_data.p_addr_line2_error}
                                    value={this.state.form_data.p_addr_line2 || ''}
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