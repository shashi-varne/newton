import React, { Component } from 'react';
import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import Api from 'utils/api';
// import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import {
    validateEmail, validateNumber, numberShouldStartWith,
    validateEmpty, open_browser_web
} from 'utils/validators';
import { FormControl } from 'material-ui/Form';

import qs from 'qs';

import LoaderModal from '../../common/Modal';

import { nativeCallback } from 'utils/native_callback';

class BasicDetailsRedirectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            parent: this.props.parent,
            skelton: true,
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

    setErrorData = (type) => {
        this.setState({
          showError: false
        });
        if(type) {
          let mapper = {
            'onload':  {
              handleClick1: this.onload,
              button_text1: 'Fetch again',
              title1: ''
            },
            'submit': {
              handleClick1: this.handleClickCurrent,
              button_text1: 'Retry',
              handleClick2: () => {
                this.setState({
                  showError: false
                })
              },
              button_text2: 'Edit'
            }
          };
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
      }

    async componentDidMount() {
        this.onload();
      }

      onload = async () => {
        this.setErrorData('onload');
        let error = ''

        this.setState({
            skelton: true
          });

        try {
            const res = await Api.get('/api/ins_service/api/insurance/account/summary')
            this.setState({
                skelton: false,
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
                // toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
                error = res.pfwresponse.result.message || res.pfwresponse.result.message || 'Something went wrong'
            }


        } catch (err) {
            this.setState({
              skelton: false,
              showError: 'page'
            });
          }
      
          // set error data
          if(error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error
              },
              showError: 'page'
            })
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
        this.setErrorData('submit');
        let error = ''

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
                            skelton: false,
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
                    this.setState({ skelton: false,openModal: false, 
                        openModalMessage: '' });
                    
                    // toast(res.pfwresponse.result.error ||  'Something went wrong');
                    error = res.pfwresponse.result.message || res.pfwresponse.result.message || 'Something went wrong'
                }
            } catch (err) {
                this.setState({
                  skelton: false,
                  showError: true
                });
              }
          
              // set error data
              if(error) {
                this.setState({
                  errorData: {
                    ...this.state.errorData,
                    title2: error
                  },
                  showError: true
                })
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
            <LoaderModal 
                open={this.state.openModal} 
                message={this.state.openModalMessage} 
            />
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
                showError={this.state.showError}
                skelton={this.state.skelton}
                errorData={this.state.errorData}
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