import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { FormControl } from 'material-ui/Form';

import { storageService } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data';
import ConfirmDialog from './../plans/confirm_dialog';
class GroupHealthPlanAddressDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            form_data: {},
            ctaWithProvider: true,
            get_lead: true
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    onload = () => {
        let lead = this.state.lead || {};
        console.log(lead);
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
        this.props.parent.props.history.push({
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
            let groupHealthPlanData = this.state.groupHealthPlanData;
            try {

                this.setState({
                    show_loader: true
                });

                let body = {
                    permanent_address: {
                        addressline: this.state.form_data.addressline,
                        addressline2: this.state.form_data.addressline2,
                        pincode: this.state.form_data.pincode 
                    }
                }

                const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/update?quote_id=' + this.state.lead.id, body);

                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    groupHealthPlanData.lead = resultData.quote_lead;
                    storageService().setObject('groupHealthPlanData', groupHealthPlanData);
                    this.navigate('nominee');
                } else {
                    this.setState({
                        show_loader: false
                    });
                    toast(resultData.error || resultData.message
                        || 'Something went wrong');
                }
            } catch (err) {
                console.log(err)
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong');
            }
        }


    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_suraksha',
            "properties": {
                "user_action": user_action,
                "screen_name": 'insurance'
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

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Address details"
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
                </FormControl>

                <ConfirmDialog parent={this} />
            </Container>
        );
    }
}

export default GroupHealthPlanAddressDetails;