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
import { yesNoOptions } from '../../../constants';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';

class GroupHealthPlanAddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            // ctaWithProvider: true,
            get_lead: true,
            next_state: 'nominee'
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    onload = () => {

        if(this.props.edit) {
            this.setState({
                next_state : `/group-insurance/group-health/${this.state.provider}/final-summary`
            })
        }

        let lead = this.state.lead || {};
        let form_data = lead.permanent_address || {};
        form_data.city = lead.city;

        if(form_data.pincode) {
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
        var value = event.target ? event.target.value : '';
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

        this.sendEvents('next');
        let keysMapper = {
            'addressline': 'Address line 1',
            'addressline2': 'Address line 2',
            'pincode': 'pincode' ,
            'pr_addressline': 'Address line 1',
            'pr_addressline2': 'Address line 2',
            'pr_pincode': 'pincode' 
        }

        let keys_to_check = ['addressline', 'addressline2', 'pincode','pr_addressline', 'pr_addressline2', 'pr_pincode']

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
                "product": 'health religare',
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
                checked:true
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
                            onChange={this.handlePincode('pincode')} />
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
                    <div className="InputField">
                        <Input
                            disabled={true}
                            id="state"
                            label="State *"
                            name="state"
                            value={this.state.form_data.state || ''}
                        />
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
                            error={(this.state.form_data.pr_addressline_error) ? true : false}
                            helperText={this.state.form_data.pr_addressline_error}
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
                            error={(this.state.form_data.pr_addressline2_error) ? true : false}
                            helperText={this.state.form_data.pr_addressline2_error}
                            value={this.state.form_data.pr_addressline2 ||''}
                            onChange={this.handleChange()} />
                    </div>

                            <div className="InputField">
                                <Input
                                    type="number"
                                    width="40"
                                    label="Pincode *"
                                    id="pr_pincode"
                                    name="pr_pincode"
                                    maxLength="6"
                                    disabled={this.state.checked}
                                    error={(this.state.form_data.pr_pincode_error) ? true : false}
                                    helperText={this.state.form_data.pr_pincode_error}
                                    value={this.state.form_data.pr_pincode || ''}
                                    onChange={this.handlePincode('pr_pincode')} />
                            </div>

                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="pr_city"
                                    label="City *"
                                    name="pr_city"
                                    value={this.state.form_data.pr_city || ''}
                                />
                            </div>
                            <div className="InputField">
                                <Input
                                    disabled={true}
                                    id="pr_state"
                                    label="State *"
                                    name="pr_state"
                                    value={this.state.form_data.pr_state || ''}
                                />
                            </div>
                            </div>
                        }

                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanAddressDetails;