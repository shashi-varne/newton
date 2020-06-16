import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers, genderOptions } from '../../../constants';
import { storageService, calculateAge, isValidDate, IsFutureDate } from 'utils/validators';
import Input from '../../../../common/ui/Input';
import Api from 'utils/api';
import toast from '../../../../common/ui/Toast';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import DropdownInModal from '../../../../common/ui/DropdownInModal';
import { initialize } from '../common_data';
class GroupHealthPlanPersonalDetailsCommon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            header_title: 'Your date of birth',
            form_data: {
                selectedIndex: 2
            },
            selectedIndex: 2,
            height_options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 20]
        }
        this.initialize = initialize.bind(this);
    }

    onload = () => {
        let member_key = this.props.parent.props.match.params.member_key;
        let final_dob_data = this.state.groupHealthPlanData.final_dob_data;

        let next_state = 'summary';
        let backend_key = '';
        for (var i = 0; i < final_dob_data.length; i++) {
            let key = final_dob_data[i].key;

            if (member_key === key) {
                backend_key = final_dob_data[i].backend_key;
                if (i === final_dob_data.length - 1) {
                    next_state = 'summary';
                } else {
                    next_state = final_dob_data[i + 1].key;
                }

                break;
            }

        }

        let lead = this.state.groupHealthPlanData.lead || {};
        console.log(this.state.groupHealthPlanData);
        let form_data = lead[backend_key] || {};

        form_data['dob'] = form_data['dob'] ? form_data['dob'].replace(/\\-/g, '/').split('-').join('/') : '';
        let age = calculateAge(form_data.dob.replace(/\\-/g, '/').split('/').reverse().join('/'));

        this.setState({
            providerData: health_providers[this.state.provider],
            next_state: next_state,
            member_key: member_key,
            form_data: form_data,
            age: age,
            lead: lead,
            backend_key: backend_key
        })
    }

    componentDidUpdate(prevState) {
        if (this.state.member_key !== this.props.parent.props.match.params.member_key) {
            this.onload();
        }
    }

    componentWillMount() {
        this.initialize();
    }


    async componentDidMount() {
        this.onload();
    }

    handleChange = name => event => {

        let form_data = this.state.form_data;

        if (!name) {
            name = event.target.name;
        }

        if (name === 'height') {
            this.setState({
                selectedIndex: event
            });

            form_data[name] = this.state.height_options[this.state.selectedIndex];
            form_data[name + '_error'] = '';
        } else if (name === 'dob') {
            let value = event.target.value;
            let errorDate = '';
            if (value.length > 10) {
                return;
            }

            var input = document.getElementById('dob');

            input.onkeyup = function (event) {
                var key = event.keyCode || event.charCode;

                var thisVal;

                let slash = 0;
                for (var i = 0; i < value.length; i++) {
                    if (value[i] === '/') {
                        slash += 1;
                    }
                }

                if (slash <= 1 && key !== 8 && key !== 46) {
                    var strokes = value.length;

                    if (strokes === 2 || strokes === 5) {
                        thisVal = value;
                        thisVal += '/';
                        value = thisVal;
                    }
                    // if someone deletes the first slash and then types a number this handles it
                    if (strokes >= 3 && strokes < 5) {
                        thisVal = value;
                        if (thisVal.charAt(2) !== '/') {
                            var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
                            value = txt1;
                        }
                    }
                    // if someone deletes the second slash and then types a number this handles it
                    if (strokes >= 6) {
                        thisVal = value;

                        if (thisVal.charAt(5) !== '/') {
                            var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
                            value = txt2;
                        }
                    }
                };



            }

            form_data[name] = value;
            form_data[name + '_error'] = errorDate;
            let age = calculateAge(value.replace(/\\-/g, '/').split('/').reverse().join('/'));
            this.setState({
                age: age
            })
        } else {
            form_data[name] = event.target.value;
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

    handleClick = async () => {

        let keys_to_check = ['name', 'dob', 'gender', 'height', 'weight']

        let form_data = this.state.form_data;
        for (var i = 0; i < keys_to_check.length; i++) {
            let key_check = keys_to_check[i];
            let first_error = key_check === 'gender' || key_check === 'height' ? 'Please select ' :
                'Please enter ';
            if (!form_data[key_check]) {
                form_data[key_check + '_error'] = first_error + key_check;
            }
        }

        let canSubmitForm = true;
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
                    [this.state.backend_key]: {
                        "name": this.state.form_data.name,
                        "dob": this.state.form_data.dob,
                        "gender": this.state.form_data.gender,
                        "height": this.state.form_data.height,
                        "weight": this.state.form_data.weight,
                        "relation": 'self'
                    }

                }

                const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/update?quote_id=' + this.state.lead.id, body);

                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    console.log(resultData);
                    // groupHealthPlanData.lead = resultData.quote_lead;
                    // storageService().setObject('groupHealthPlanData', groupHealthPlanData);
                    // this.navigate(this.state.next_state);
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



    handleChangeRadio = name => event => {


        var form_data = this.state.form_data || {};

        let optionsMapper = {
            'gender': genderOptions
        }
        form_data[name] = optionsMapper[name][event].value;
        form_data[name + '_error'] = '';

        this.setState({
            form_data: form_data
        })

    };

    render() {
        let currentDate = new Date().toISOString().slice(0, 10);

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title={this.state.header_title}
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >
                <div className="InputField">
                    <Input
                        type="text"
                        width="40"
                        label="Full name"
                        class="Name"
                        id="name"
                        name="name"
                        error={(this.state.form_data.name_error) ? true : false}
                        helperText={this.state.form_data.name_error}
                        value={this.state.form_data.name || ''}
                        onChange={this.handleChange()} />
                </div>
                <div className="InputField">
                    <Input
                        type="text"
                        width="40"
                        label="Date of birth (DD/MM/YYYY)"
                        class="DOB"
                        id="dob"
                        name="dob"
                        max={currentDate}
                        error={(this.state.form_data.dob_error) ? true : false}
                        helperText={this.state.form_data.dob_error}
                        value={this.state.form_data.dob || ''}
                        placeholder="DD/MM/YYYY"
                        maxLength="10"
                        onChange={this.handleChange()} />
                </div>

                <div className="InputField">
                    <RadioWithoutIcon
                        width="40"
                        label="Gender"
                        class="Gender:"
                        options={genderOptions}
                        id="gender"
                        name="gender"
                        error={(this.state.form_data.gender_error) ? true : false}
                        helperText={this.state.form_data.gender_error}
                        value={this.state.form_data.gender || ''}
                        onChange={this.handleChangeRadio('gender')} />
                </div>
                <div>
                    <DropdownInModal
                        options={this.state.height_options}
                        header_title="Select Height (cm)"
                        cta_title="SAVE"
                        selectedIndex={this.state.selectedIndex}
                        value={this.state.form_data.height}
                        error={(this.state.form_data.height_error) ? true : false}
                        helperText={this.state.form_data.height_error}
                        width="40"
                        label="Height"
                        class="Education"
                        id="height"
                        name="height"
                        onChange={this.handleChange('height')}
                    />
                </div>
                <div className="InputField">
                    <Input
                        type="number"
                        width="40"
                        label="Weight (Kg)"
                        class="Name"
                        id="name"
                        name="weight"
                        error={(this.state.form_data.weight_error) ? true : false}
                        helperText={this.state.form_data.weight_error}
                        value={this.state.form_data.weight || ''}
                        onChange={this.handleChange()} />
                </div>
            </Container>
        );
    }
}

export default GroupHealthPlanPersonalDetailsCommon;