import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Api from 'utils/api';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
      validateNumber
} from 'utils/validators';
class AddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            getLeadBodyKeys: ['address_info'],
            next_state: 'form-summary',
            screen_name: 'address-details',
            checked: false
        }
        this.initialize = initialize.bind(this);

        this.addressRef = React.createRef();
    }

    componentWillMount() {
        this.initialize();

        let residentialOptions = [
            'Owned',
            'Rented',
            'PG',
            'Hostel',
            'Batchlor Accomodation'
        ];

        this.setState({
            residentialOptions: residentialOptions
        })
    }

    onload = () => {

        if (this.props.edit) {
            this.setState({
                next_state: `/loan/form-summary`
            })
        }

        let lead = this.state.lead || {};

        let current_address_data = lead.current_address_data || {};
        let permanent_address_data = lead.permanent_address_data || {};

        let form_data = {
            residence_type: current_address_data.residence_type || '',
            duration: current_address_data.duration || '',
            address: current_address_data.address || '',
            pincode: current_address_data.pincode || '',
            city: current_address_data.city || '',
            state: current_address_data.state || '',
            country: current_address_data.country || '',

            p_address: permanent_address_data.address || '',
            p_pincode: permanent_address_data.pincode || '',
            p_city: permanent_address_data.city || '',
            p_state: permanent_address_data.state || '',
            p_country: permanent_address_data.country || '',
            permanent_address_same_as_current: permanent_address_data.permanent_address_same_as_current

        };


        this.setState({
            form_data: form_data,
            lead: lead,
            // checked: !!form_data.permanent_address_same_as_current
        })

    }

    setPermAddress = () => {
        if (!this.state.checked) {
            this.handleScroll();
        }
    }

    handleCheckBox = name => event => {
        this.setState({
            [name]: event.target.checked
        }, () => {
            this.setPermAddress();
        })

    };

    handleChange = name => event => {
        this.formHandleChange(name, event);
    };


    handleClick = async () => {

        this.sendEvents('next');

        let form_data = this.state.form_data;
        let keys_to_check = ['residence_type', 'duration', 'address', 'pincode', 'p_address',
            'p_pincode'];

        if (this.state.checked) {
            form_data.p_pincode_error = '';
            form_data.p_address_error = '';
            keys_to_check = ['residence_type', 'duration', 'address', 'pincode',];
        }

        if (form_data.pincode.length !== 6 || !validateNumber(form_data.pincode) || 
        form_data.pincode_error) {
            form_data['pincode_error'] = 'Please enter valid pincode';
        }

        if (!this.state.checked && (form_data.p_pincode.length !== 6 || !validateNumber(form_data.p_pincode) || 
        form_data.p_pincode_error)) {
            form_data['p_pincode_error'] = 'Please enter valid pincode';
        }

        this.formCheckUpdate(keys_to_check, form_data);
    }


    sendEvents(user_action) {
        let { form_data } = this.state
        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'address details',
                "residence_type": form_data.residence_type,
                "duration": form_data.duration,
                "permanent_pincode": !this.state.checked ? form_data.p_pincode : form_data.pincode,
                "permanent_address": !this.state.checked ? form_data.p_address : form_data.address,
                "permanent_city": !this.state.checked ? form_data.p_city : form_data.city,
                "permanent_state": !this.state.checked ? form_data.p_state : form_data.state,
                "current_pincode": form_data.pincode,
                "current_address": form_data.address,
                "current_city": form_data.city,
                "current_state": form_data.state,
                'from_edit': this.props.edit ? 'yes' : 'no',
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

        this.setState({
            form_data: form_data
        })

        if (pincode.length === 6) {
            const res = await Api.get('/relay/api/loan/pincode/get/' + pincode);
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
                form_data.country = country || 'India';
            } else {
                form_data.p_city = city;
                form_data.p_state = state;
                form_data.p_pincode_error = pincode_error;
                form_data.p_country = country || 'India';
            }

        }

        this.setState({
            form_data: form_data
        })
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

    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.setEditTitle("Residence details")}
                buttonTitle="CONTINUE"
                handleClick={() => this.handleClick()}
            >
                <FormControl fullWidth>
                    <div style={{ color: '#64778D', fontSize: 13, fontWeight: 300, margin: '0 0 6px 0' }}>
                        Current Residence Address
                    </div>
                    <div className="InputField">
                        <DropdownWithoutIcon
                            width="40"
                            options={this.state.residentialOptions}
                            id="residence_type"
                            label="Residence type"
                            error={!!this.state.form_data.residence_type_error}
                            helperText={this.state.form_data.residence_type_error}
                            value={this.state.form_data.residence_type || ''}
                            name="residence_type"
                            onChange={this.handleChange('residence_type')} />
                    </div>

                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
                            label="No. of months in residence"
                            placeholder="Minimum requirement is 6 months"
                            class="Name"
                            id="duration"
                            name="duration"
                            error={(this.state.form_data.duration_error) ? true : false}
                            helperText={this.state.form_data.duration_error}
                            value={this.state.form_data.duration || ''}
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
                            type="text"
                            id="address"
                            label="Address"
                            name="address"
                            placeholder="ex: 16/1 Queens paradise"
                            error={(this.state.form_data.address_error) ? true : false}
                            helperText={this.state.form_data.address_error}
                            value={this.state.form_data.address || ''}
                            onChange={this.handleChange()} />
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
                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="country"
                            label="Country"
                            name="country"
                            value={this.state.form_data.country || ''}
                        />
                    </div>


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
                                    <div className="checkbox-text">Permanent address is same as Current address
                                </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    {!this.state.checked &&

                        <div>
                            <div style={{ color: '#64778D', fontSize: 13, fontWeight: 300, margin: '-10px 0px 6px' }}>
                                Permanent Address Details
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
                                    onChange={this.handlePincode('p_pincode')} />
                            </div>

                            <div className="InputField">
                                <Input
                                    type="text"
                                    disabled={this.state.checked}
                                    id="address"
                                    label="Address"
                                    name="p_address"
                                    placeholder="ex: 16/1 Queens paradise"
                                    error={(this.state.form_data.p_address_error) ? true : false}
                                    helperText={this.state.form_data.p_address_error}
                                    value={this.state.form_data.p_address || ''}
                                    onChange={this.handleChange()} />
                            </div>

                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="p_city"
                                    label="City"
                                    name="p_city"
                                    value={this.state.form_data.p_city || ''}
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
                </FormControl>
            </Container>
        );
    }
}

export default AddressDetails;