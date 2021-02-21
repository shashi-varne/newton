import React, { Component } from 'react';
import Container from '../../common/Container';

import {getConfig} from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../common/ui/Toast';
import { initialize } from '../../common/functions';
import BottomInfo from '../../../common/ui/BottomInfo';
import Api from 'utils/api';
import text_error_icon from 'assets/text_error_icon.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import ReactHtmlParser from 'react-html-parser';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import { storageService } from 'utils/validators';
import { checkStringInString } from 'utils/validators';
import scrollIntoView from 'scroll-into-view-if-needed';

const agreeOptions = [
    {
        'name': 'I agree',
        'value': 'agree'
    },
    {
        'name': 'Decline',
        'value': 'decline'
    }
];

class FormSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            get_lead: true,
            fetch_all: true,
            accordianData: [],
            confirm_details_check: false,
            application_info: {},
            agreement: [],
            agree_check: '',
            vendor_info: {},
            isScrolledToBottom: false,
            detail_clicked: []
        }
        this.initialize = initialize.bind(this);
        this.agreeRef = React.createRef();
    }


    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        this.initialize();

        let agreement = [
            `I/We hereby apply for a finance facility for the short term personal loan (“Facility”) mentioned in this application. I/We declare that all the particulars and information and details given/filled in this Application Form are true, correct, complete and up-to date in all respects and no information has been withheld. I/We understand that the information given in this application shall form the basis of any loan that DMI Finance Private Limited (“DMI”) may decide to grant to me/us and if at any stage of processing this application, it comes to the knowledge of DMI that, I/we have provided any incorrect or incomplete information, fabricated documents, or fake documents, they will be treated by DMI as having been manipulated by me/us and DMI shall have the right to forthwith reject this loan application, cancel / revoke any sanction or further drawdowns or recall any loan granted at any stage of processing the application, without assigning any reason whatsoever and DMI and its employees/ representatives/ agents / service providers shall not be responsible/liable in any manner whatsoever to me/us for such rejection or any delay in notifying me/us of such rejection (including for any payments which may have been made by me to any vendor/ service provider prior to cancellation).`,
            `I/We understand that DMI will also be procuring personal information from other sources/agents and I/We have no objection for the same. I/We authorize DMI to make reference and inquire relating to information in this application which DMI considers necessary, including from the banks where I/we hold bank accounts.`,
            `I/We hereby give my/our consent voluntarily for use of AADHAAR card/details for the purposes of availing the Facility including KYC purposes as required under applicable laws and as per DMI policies. I/We hereby give our consent to DMI to procure my /our  AADHAAR details, PAN No/copy of my/our PAN Card, other identity proof and Bank Account details from time to time, exchange, part with/share all information relating to my/our loan details and repayment history with other banks/financial institutions /CIBIL etc. and periodically obtain / generate CIBIL, Experian, Hunter and such other reports as may be required and shall not hold DMI liable for use of this information. I/We do hereby expressly and irrevocably authorize DMI to collect, store, share, obtain and authenticate any aspect of my/our personal information either directly or through any of the authorized agencies and disclose such information to its agents/contractors/service providers and to also use such information for the purposes of KYC authentication, grant of the Facility and for internal evaluation by DMI of its business. For more details please 
            click here <a id="link">https://www.dmifinance.in/privacy-policy.html.</a>.`,
            `I/We, would like to know through telephonic calls, or SMS/WhatsApp on my mobile number mentioned in the Application Form as well as in this undertaking, or through any other communication mode, transactional information, various loan offer schemes or loan promotional schemes or any other promotional schemes which may be provided by DMI and hereby authorize DMI and their employee, agent, associate to do so. I confirm that laws in relation to the unsolicited communication referred in “National Do Not Call Registry” (the “NDNC Registry”) as laid down by TELECOM REGULATORY AUTHORITY OF INDIA will not be applicable for such communication/calls/SMSs/WhatsApp messages received from DMI, its employees, agents and/or associates.`,
            `I/We acknowledge that Sourcing Partner and DMI are independent of each other and I/we will not have any claim against DMI for any loan or other facility arranged/ provided by Sourcing Partner which is not sanctioned/ disbursed by DMI. I acknowledge that DMI does not in any manner make any representation, promise, statement or endorsement in respect of any other product of services which may be provided by Sourcing Partner  and will not be responsible or liable in any manner whatsoever for the same.`,
            `I/we understand that the I/we have an option of not providing the information as required in this application form or as may be required by DMI from time to time provided that on exercising such option DMI shall have the right to cancel the sanction or seek prepayment of the amounts due as per the terms of the GC.`,
            `I/ We declare that I/ We have not made any payment in cash, bearers cheques or by any other mode along with or in connection with this Application Form to the person collecting my/our Application Form. I/ We shall not hold DMI or its employees/representatives/agents/service providers liable for any such payment made by us to the person collecting this Application Form.`,
            `I/We authorize  ${this.state.productName} to share my investment data with DMI if I have made investment with ${this.state.productName} in past.`,
            'I/We allow receiving communication from Fisdom via SMS and email.',
            '<b> I/We confirm that I/We have understood the terms of the application form.</b>'
        ]

        this.setState({
            agreement: agreement
        })
    }

    onload = () => {
        let lead = this.state.lead;

        let accordianData = [];

        let personal_info = lead.personal_info || {};
        let permanent_address_data = lead.permanent_address_data || {};
        let current_address_data = lead.current_address_data || {};
        let professional_info = lead.professional_info || {};
        let application_info = lead.application_info || {};
        let vendor_info = lead.vendor_info || {};

        if (vendor_info && vendor_info.lead_id) {
            this.setState({
                isScrolledToBottom: true,
                agree_check: 'agree',
                confirm_details_check: true,
                form_submitted: true
            })
        }
        let personal_data = {
            'title': 'Personal details',
            edit_state: `/loan/edit-personal-details`,
            data: [
                {
                    'title': 'PAN detail',
                    'subtitle': personal_info.pan_no
                },
                {
                    'title': "Borrower name",
                    'subtitle': personal_info.first_name + ' ' + personal_info.last_name
                },
                {
                    'title': 'Date of birth',
                    'subtitle': personal_info.dob
                },
                {
                    'title': "Father name",
                    'subtitle': personal_info.father_name
                },
                {
                    'title': 'Gender',
                    'subtitle': personal_info.gender
                },
                {
                    'title': 'Marital status',
                    'subtitle': personal_info.marital_status
                }
            ]
        }

        accordianData.push(personal_data);

        let contact_data = {
            'title': 'Contact details',
            edit_state: `/loan/edit-contact-details`,
            data: [
                {
                    'title': 'Mobile number',
                    'subtitle': personal_info.mobile_no
                },
                {
                    'title': 'Email id',
                    'subtitle': personal_info.email_id
                },
            ]
        }

        accordianData.push(contact_data);


        let address_data = {
            'title': 'Address details',
            edit_state: `/loan/edit-address-details`,
            data: [
                {
                    'title': 'Residence type (Current address)',
                    'subtitle': current_address_data.residence_type
                },
                {
                    'title': 'Duration (Current address)',
                    'subtitle': current_address_data.duration
                },
                {
                    'title': 'Current address',
                    'subtitle': `${current_address_data.address}, ${current_address_data.pincode},
                    ${current_address_data.city}, ${current_address_data.state},
                     ${current_address_data.country}`
                },
                {
                    'title': 'Permanent address',
                    'subtitle': `${permanent_address_data.address}, ${permanent_address_data.pincode},
                    ${permanent_address_data.city}, ${permanent_address_data.state},
                     ${permanent_address_data.country}`
                },

            ]
        }

        accordianData.push(address_data);


        let professional_data = {
            'title': 'Professional details',
            edit_state: `/loan/edit-professional-details`,
            data: [
                {
                    'title': 'Educational qualification',
                    'subtitle': professional_info.educational_qualification
                },
                {
                    'title': 'Company name',
                    'subtitle': professional_info.company_name
                },
                {
                    'title': 'Duration',
                    'subtitle': professional_info.duration
                },
                {
                    'title': 'Office address',
                    'subtitle': professional_info.office_address
                },
                {
                    'title': "Office pincode",
                    'subtitle': professional_info.office_pincode
                },
                {
                    'title': 'Office email',
                    'subtitle': professional_info.office_email
                },

                {
                    'title': 'Office city',
                    'subtitle': professional_info.office_city
                },
                {
                    'title': 'Office state',
                    'subtitle': professional_info.office_state
                },
                {
                    'title': 'Office country',
                    'subtitle': professional_info.office_country
                }
            ]
        }

        accordianData.push(professional_data);


        this.setState({
            accordianData: accordianData,
            application_info: application_info,
            vendor_info: vendor_info || {}
        }, () => {
            if (!this.state.form_submitted) {
                this.handleAccordian(0);
            }

        })
    }

    openCreateProfile = async () => {
        this.navigate('form-create-profile', {
            params: {
                fromSummary: true
            }
        });
    }

    handleClick = async () => {
        this.sendEvents('next');

        if (this.state.agree_check !== 'agree') {
            this.handleScroll();
            toast('It is mandatory to agree to Terms & Conditions for submitting your application.');
            return;
        }

        this.setState({
            show_loader: true
        });

        storageService().set('loan_dmi_loan_status', this.state.vendor_info.dmi_loan_status);

        if (this.state.vendor_info.lead_id) {
            this.openCreateProfile();
        } else {
            try {
                let res = await Api.get(`/relay/api/loan/submit/application/${this.state.application_id}`);

                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200 && !resultData.error) {

                    if (resultData.status === 'Application Rejected' && ['location', 'occupation'].indexOf(resultData.rejection_reason) !== -1) {
                        let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
                        this.navigate('instant-kyc-status', {
                            searchParams: searchParams,
                            params: {
                                rejection_reason: resultData.rejection_reason
                            }
                        });
                        
                    } else {
                        this.openCreateProfile();
                    }

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


    sendEvents(user_action, data = {}) {
        let detail_clicked = this.state.detail_clicked.filter((item, index) => 
            this.state.detail_clicked.indexOf(item) === index &&
            item !== false
        );

        let eventObj = {
            "event_name": 'lending',
            "properties": {
                "user_action": user_action,
                "screen_name": 'application form',
                "edit": data.edit_clicked || 'none',
                "detail_click": detail_clicked.length !== 0 ? detail_clicked.join(',') : 'none',
                "consent": this.state.agree_check,
                "confirm_details": this.state.confirm_details_check ? 'yes' : 'no'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }


    renderAccordiansubData = (props, index) => {
        return (
            <div key={index}>
                {props.subtitle &&
                    <div className="bctc-tile">
                        <div className="title">
                            {props.title}
                        </div>
                        <div className="subtitle">
                            {props.subtitle}
                        </div>
                    </div>
                }
            </div>
        )
    }

    renderAccordian = (props, index) => {
        return (
            <div key={index} onClick={() => this.handleAccordian(index)} className="bc-tile">
                <div className="bct-top">
                    <div className="bct-top-title">
                        {props.title}
                    </div>
                    <div className="bct-icon">
                        <img src={require(`assets/${props.open ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                    </div>
                </div>

                {props.open &&
                    <div className="bct-content">
                        {props.data.map(this.renderAccordiansubData)}
                        {!this.state.form_submitted &&
                            <div
                                onClick={() => {
                                    this.sendEvents('next', { edit_clicked: props.title.split(' ')[0] });
                                    this.openEdit(props.edit_state)
                                }} className="generic-page-button-small">
                                EDIT
                        </div>
                        }
                    </div>}
            </div>
        );
    }

    handleAccordian = (index) => {
        let accordianData = this.state.accordianData;
        let selectedIndex = this.state.selectedIndex;

        if (index === this.state.selectedIndex) {
            accordianData[index].open = false;
            selectedIndex = -1;
        } else {
            if (selectedIndex >= 0) {
                accordianData[selectedIndex].open = false;
            }

            accordianData[index].open = true;
            selectedIndex = index;
        }

        this.setState({
            accordianData: accordianData,
            selectedIndex: selectedIndex,
            detail_clicked: [...this.state.detail_clicked, selectedIndex !== -1 && accordianData[selectedIndex].title.split(' ')[0]]
        })
    }

    openEdit = (state) => {
        
        this.navigate(state);
    }

    handleClose = () => {
        this.setState({
            openDialogReset: false,
            medical_dialog: false
        })
    }


    handleChange = name => event => {
        if (!name) {
            name = event.target.name;
        }

        this.setState({
            [name]: event.target.checked
        })
    };

    handleChangeRadio = name => event => {

        this.setState({
            [name]: agreeOptions[event].value,
            [name + '_error']: ''
        })

    };

    handleAgreement = (props) => {
        if (checkStringInString(props, "https://www.dmifinance.in/privacy-policy.html")) {
            this.openInBrowser('https://www.dmifinance.in/privacy-policy.html');
        }
    }

    renderAgreement = (props, index) => {
        return (
            <div key={index} id={'agreement_' + index} className="agree-tiles"
                onClick={() => this.handleAgreement(props)}>
                <div className="agree-tiles-left"></div>
                <div className="agree-tiles-right">{ReactHtmlParser(props)}</div>
            </div>
        )
    }

    onScroll = (e) => {
        const element = e.target;
        let isScrolled = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
        if (!this.state.form_submitted) {
            this.setState({
                isScrolledToBottom: isScrolled
            })
        }

    }

    handleScroll = () => {
        setTimeout(function () {
            let element = document.getElementById('agreeScroll');
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

                resetpage={true}
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Review Application Form"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle={'SUBMIT'}
                disable={!(this.state.confirm_details_check)}
                handleClick={() => this.handleClick()}
                headerData={{
                    icon: 'close'
                }}
                classOverRide={'loanMainContainer'}
            >

                <div className="common-top-page-subtitle">
                    Application no.: <b>{this.state.application_info.application_id}</b>
                </div>
                <div className="loan-form-summary">

                    <div className="bottom-content">
                        <div className="generic-hr"></div>
                        {this.state.accordianData.map(this.renderAccordian)}

                    </div>

                    <div style={{
                        margin: '30px 0 30px 0', display: 'flex',
                        position: 'relative', background: '#FDF5F6', alignItems: 'baseline'
                    }}
                        className="highlight-text highlight-color-info">
                        <div>
                            <img className="highlight-text11"
                                src={text_error_icon}
                                alt="info" />
                        </div>

                        <div>
                            <div className="highlight-text1">
                                <div className="highlight-text2" style={{ color: '#767E86', marginLeft: 7 }}>
                                    The details cannot be changed once submitted.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="InputField" style={{ marginBottom: '0px !important' }}>
                        <div className="CheckBlock2 checkbox-loan" style={{ margin: '10px 0' }}>
                            <Grid container spacing={16} alignItems="center">
                                <Grid item xs={1} className="TextCenter">
                                    <Checkbox
                                        defaultChecked
                                        checked={this.state.confirm_details_check}
                                        color="secondary"
                                        value="confirm_details_check"
                                        name="confirm_details_check"
                                        onChange={this.handleChange()}
                                        className="Checkbox" />
                                </Grid>
                                <Grid item xs={11}>
                                    <div className="checkbox-text"><span className="secondary-color">I confirm</span> above mentioned details. </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    <div className="generic-page-title" style={{
                        margin: '0 0 20px 0 ',
                        opacity: this.state.confirm_details_check ? 1 : 0.4
                    }}>
                        We need your consent
                    </div>
                    <div id="agreement" className="agreement-block" style={{
                        opacity: this.state.confirm_details_check ? 1 : 0.4
                    }} onScroll={this.onScroll}>
                        {this.state.agreement.map(this.renderAgreement)}
                    </div>

                    <div id="agreeScroll" ref={this.agreeRef} className="InputField" style={{ margin: '30px 0 50px 0', opacity: this.state.confirm_details_check ? 1 : 0.4 }}>
                        <RadioWithoutIcon
                            width="40"
                            label="I/We confirm that I/We have understood the
                            terms of the application form."
                            class="Gender:"
                            options={agreeOptions}
                            id="agree_check"
                            name="agree_check"
                            disabled={!(this.state.confirm_details_check)}
                            error={(this.state.agree_check_error) ? true : false}
                            helperText={this.state.agree_check_error}
                            value={this.state.agree_check || ''}
                            onChange={this.handleChangeRadio('agree_check')} />
                    </div>

                    <BottomInfo baseData={{ 'content': 'You are one step away from knowing your eligibility' }} />
                </div>

            </Container>
        );
    }
}

export default FormSummary;