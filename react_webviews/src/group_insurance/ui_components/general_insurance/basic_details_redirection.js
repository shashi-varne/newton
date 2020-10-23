import React, { Component } from 'react';
import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import {
    validateEmail, validateNumber, numberShouldStartWith,
    validateEmpty, open_browser_web
} from 'utils/validators';
import { FormControl } from 'material-ui/Form';

import qs from 'qs';

import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';

import { nativeCallback } from 'utils/native_callback';

class BasicDetailsRedirectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            parent: this.props.parent,
            show_loader: true,
            premium_details_all: window.sessionStorage.getItem('group_insurance_plan_final_data') ?
            JSON.parse(window.sessionStorage.getItem('group_insurance_plan_final_data')) : '',
            name: '',
            openModal: false,
            name_error: '',
            email: '',
            mobile_number: '',
            email_error: '',
            mobile_number_error: '',
            provider: '',
            params: qs.parse(this.props.parent.props.history.location.search.slice(1)),
            type: getConfig().productName,
            productName: getConfig().productName
        };

        this.handleClickCurrent = this.handleClickCurrent.bind(this);
    }

    componentWillMount() {

        nativeCallback({ action: 'take_control_reset' });
        let premium_details = this.state.premium_details_all[this.props.parent.state.product_key];
        let providerLogoMapper = {
            'hdfcergo': {
                'insurance_title': 'HDFC ERGO'
            }
        }

        let  buttonTitle = 'Continue';
        let provider = this.props.parent.state.provider;
        let current_url = window.location.href;
        this.setState({
            current_url: current_url,
            provider: provider,
            premium_details: premium_details,
            insurance_title: providerLogoMapper[provider] ? providerLogoMapper[provider].insurance_title: '',
            productTitle: premium_details.productTitle || '',
            buttonTitle: buttonTitle
        });
    }

    async componentDidMount() {
        try {
            const res = await Api.get('/api/ins_service/api/insurance/account/summary')
            this.setState({
                show_loader: false
            });

            if (res.pfwresponse.status_code === 200) {
                const { name, email, mobile_number } = res.pfwresponse.result.insurance_account;
                this.setState({
                    name: name || '',
                    email: email || '',
                    mobile_number: mobile_number || '',
                });
            } else if (res.pfwresponse.status_code === 401) {

            } else {
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message
                    || 'Something went wrong');
            }


        } catch (err) {
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }
    }

    handleChange = () => event => {
        if (event.target.name === 'mobile_number') {
            if (event.target.value.length <= 10) {
                this.setState({
                    [event.target.name]: event.target.value,
                    [event.target.name + '_error']: ''
                });
            }
        } else {
            this.setState({
                [event.target.name]: event.target.value,
                [event.target.name + '_error']: ''
            });
        }
    };

    componentDidUpdate(prevState) {

        if (prevState.parent !== this.props.parent) {
            this.setState({
                parent: this.props.parent || {}
            })
        }

    }

    async handleClickCurrent() {

        this.sendEvents('next');

        var canSubmitForm = true;

        if (!validateEmpty(this.state.name)) {
            canSubmitForm = false;
            this.setState({
                name_error: 'Enter valid full name'
            });
        } else if (this.state.name.split(" ").length < 2) {
            canSubmitForm = false;
            this.setState({
                name_error: 'Enter valid full name'
            });
        }

        if (this.state.email.length < 10 || !validateEmail(this.state.email)) {
            canSubmitForm = false;
            this.setState({
                email_error: 'Please enter valid email'
            });
        }

        if (this.state.mobile_number.length !== 10 || !validateNumber(this.state.mobile_number)) {
            canSubmitForm = false;
            this.setState({
                mobile_number_error: 'Please enter valid mobile no'
            });
        } else if (!numberShouldStartWith(this.state.mobile_number)) {
            canSubmitForm = false;
            this.setState({
                mobile_number_error: 'Please enter valid mobile no'
            });
        }

        if (canSubmitForm) {
            try {
                let openModalMessage = 'Redirecting to ' + this.state.insurance_title + ' portal';
                this.setState({ openModal: true, openModalMessage: openModalMessage });

                var leadCreateBody = {
                    name: this.state.name,
                    mobile_no: this.state.mobile_number,
                    email: this.state.email,
                    product_name: this.props.parent.state.product_key,
                    product_plan: this.state.premium_details.product_plan
                };


                const res = await Api.post('/api/ins_service/api/insurance/' + 
                this.props.parent.state.provider + '/lead/create', leadCreateBody);

                if (res.pfwresponse.status_code === 200) {
                    
                    var leadRedirectUrl = res.pfwresponse.result.lead;
                    if (getConfig().app === 'web') {
                        this.setState({ 
                            show_loader: false,
                            openModal: false, 
                            openModalMessage: ''
                         });

                         open_browser_web(leadRedirectUrl, '_blank');
                    } else {

                        if (getConfig().app === 'ios') {
                            nativeCallback({
                                action: 'show_top_bar', message: {
                                    title: this.state.productTitle
                                }
                            });
                        }

                        nativeCallback({
                            action: 'take_control', message: {
                                back_url: this.state.current_url,
                                show_top_bar: false,
                                back_text: "We suggest you to complete the application process for fast issuance of your insurance.Do you still want to exit the application process?"
                            },

                        });
                        nativeCallback({ action: 'show_top_bar', message: { title: this.state.productTitle } });

                        window.location.href = leadRedirectUrl;
                    }

                } else {
                    this.setState({ show_loader: false,openModal: false, 
                        openModalMessage: '' });
                    
                    toast(res.pfwresponse.result.error ||  'Something went wrong');
                }
            } catch (err) {
                this.setState({
                    show_loader: false
                });
                toast('Something went wrong');
            }
        }

    }

    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'Group Insurance',
            "properties": {
                "user_action": user_action,
                "screen_name": 'basic_detail_v2',
                "provider": this.state.provider,
                'name': this.state.name ? 'yes' : 'no',
                'email': this.state.email ? 'yes' : 'no',
                'mobile_number': this.state.mobile_number ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    bannerText = () => {
        return (
            <span>
                Enter your personal details to get a free quote.
      </span>
        );
    }

    renderModal = () => {
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.openModal}
            >
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 4, minWidth: 320, padding: 25, textAlign: 'center' }}>
                    <div style={{ padding: '20px 0' }}>
                        <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt=""  style={{ width: '30%', height: '30%' }} />
                    </div>
                    <Typography variant="subheading" id="simple-modal-description" style={{ color: '#444' }}>
                        {this.state.openModalMessage}
                    </Typography>
                </div>
            </Modal>
        );
    }


    render() {
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                product_key={this.props.parent ? this.props.parent.state.product_key : ''}
                buttonTitle={this.state.buttonTitle}
                onlyButton={true}
                banner={true}
                bannerText={this.bannerText()}
                showLoader={this.state.show_loader}
                handleClick={() => this.handleClickCurrent()}
                title='Personal details'
                classOverRideContainer="basic-details">
                <FormControl fullWidth>
                    <div className="InputField">
                        <Input
                            type="text"
                            productType={this.state.type}
                            error={(this.state.name_error) ? true : false}
                            helperText={this.state.name_error}
                            width="40"
                            label="Full Name"
                            class="FullName"
                            id="name"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <Input
                            error={(this.state.email_error) ? true : false}
                            helperText={this.state.email_error}
                            type="email"
                            width="40"
                            label="Email address"
                            class="Email"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange()} />
                    </div>
                    <div className="InputField">
                        <MobileInputWithoutIcon
                            error={(this.state.mobile_number_error) ? true : false}
                            helperText={this.state.mobile_number_error}
                            type="number"
                            width="40"
                            label="Mobile number"
                            class="Mobile"
                            id="number"
                            name="mobile_number"
                            value={this.state.mobile_number}
                            onChange={this.handleChange()} />
                    </div>
                </FormControl>
                {this.renderModal()}
            </Container>
        );
    }
}


const BasicDetailsRedirection = (props) => (
    <BasicDetailsRedirectionForm
        {...props} />
);

export default BasicDetailsRedirection;