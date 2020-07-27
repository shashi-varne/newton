import React, { Component } from 'react';
import Container from '../../common/Container';

import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import Input from '../../../common/ui/Input';
import { initialize } from '../../common/functions';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Api from 'utils/api';


class AddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            get_lead: true,
            getLeadBodyKeys: ['address_info'],
            next_state: 'form-summary',
            screen_name: 'address-details'
        }
        this.initialize = initialize.bind(this);
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
            
        };


        this.setState({
            form_data: form_data,
            lead: lead,
        })

    }

    handleChange = name => event => {
      this.formHandleChange(name, event);
    };


    handleClick = async () => {

        this.sendEvents('next');
        let keys_to_check = ['residence_type', 'duration', 'address', 'pincode','p_address', 
        'p_pincode'];


        let form_data = this.state.form_data;
        console.log(form_data);

        this.formCheckUpdate(keys_to_check, form_data);
    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'contact details',
                'email': this.state.form_data.email ? 'yes' : 'no',
                'mobile_number': this.state.form_data.mobile_number ? 'yes' : 'no',
                'from_edit': this.props.edit ? 'yes' : 'no'
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
        console.log(name);
        form_data[name] = pincode;
        form_data[name + '_error'] = '';

        this.setState({
          form_data: form_data
        })

        if (pincode.length === 6) {
            const res = await Api.get('/api/pincode/' + pincode);

            let { city, state, country } = form_data;
            let pincode_error = '';
            if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
                city = res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name;
                state = res.pfwresponse.result[0].state_name;
                country = res.pfwresponse.result[0].country_name;
            } else {
                city = '';
                state = '';
                pincode_error = 'Invalid pincode';
            }

            if(name === 'pincode') {
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
                    <div style={{color: '#64778D',fontSize: 13, fontWeight: 300,margin: '0 0 6px 0'}}>
                    Current residence detail
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
                            label="No of months in current residence"
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


                    <div style={{color: '#64778D',fontSize: 13, fontWeight: 300,margin: '30px 0 6px 0'}}>
                    Permanent residence address
                    </div>
                   
                    <div className="InputField">
                        <Input
                            type="number"
                            width="40"
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
                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="p_country"
                            label="Country"
                            name="p_country"
                            value={this.state.form_data.p_country || ''}
                        />
                    </div>

                </FormControl>
            </Container>
        );
    }
}

export default AddressDetails;