import React, { Component } from 'react';
import Container from '../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../common/ui/Toast';
import { initialize } from '../../common/functions';
import BottomInfo from '../../../common/ui/BottomInfo';
import Api from 'utils/api';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import text_error_icon from 'assets/text_error_icon.svg';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class FormSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            get_lead: true,
            fetch_all: true,
            accordianData: [],
            confirm_details_check: false,
            application_info: {}
        }
        this.initialize = initialize.bind(this);
    }


    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        this.initialize();
    }

    onload = () => {
        let lead = this.state.lead;

        console.log(lead);

        let accordianData = [];

        let { personal_info, permanent_address_data, current_address_data,
            professional_info, application_info } = lead;

        let personal_data = {
            'title': 'Personal details',
            edit_state: `/loan/edit-personal-details`,
            data: [
                {
                    'title': 'PAN detail',
                    'subtitle': personal_info.pan_no
                },
                {
                    'title': 'Insured name',
                    'subtitle': personal_info.first_name + ' ' + personal_info.last_name
                },
                {
                    'title': 'Date of birth',
                    'subtitle': personal_info.dob
                },
                {
                    'title': "Father's name",
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
                    'title': 'Residence type (current address)',
                    'subtitle': current_address_data.residence_type
                },
                {
                    'title': 'Duration (current address)',
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
            application_info: application_info
        })
    }


    startPayment = async () => {
        this.setState({
            show_loader: true
        })
        this.handleClose();
        try {
            let res = await Api.get(`/api/ins_service/api/insurance/hdfcergo/start/payment?lead_id=${this.state.quote_id}`);


            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {


                let current_url = window.location.href;
                let nativeRedirectUrl = current_url;

                let paymentRedirectUrl = encodeURIComponent(
                    window.location.origin + `/group-insurance/group-health/${this.state.provider}/payment`
                );


                var payment_link = resultData.payment_link;
                var pgLink = payment_link;
                let app = getConfig().app;
                var back_url = encodeURIComponent(current_url);
                // eslint-disable-next-line
                pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
                    '&app=' + app + '&back_url=' + back_url;
                if (getConfig().generic_callback) {
                    pgLink += '&generic_callback=' + getConfig().generic_callback;
                }


                if (getConfig().app === 'ios') {
                    nativeCallback({
                        action: 'show_top_bar', message: {
                            title: 'Payment'
                        }
                    });
                }

                nativeCallback({
                    action: 'take_control', message: {
                        back_url: nativeRedirectUrl,
                        back_text: 'Are you sure you want to exit the payment process?'
                    }
                });

                window.location.href = pgLink;


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

    handleClick = async () => {
        this.sendEvents('next');

        this.setState({
            show_loader: true
        });
        try {
            let res = await Api.post(`/api/ins_service/api/insurance/hdfcergo/ppc/check?quote_id=${this.state.quote_id}`);


            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                let lead = resultData.quote_lead || {};
                if (lead.ped_check) {
                    this.openMedicalDialog('ped');
                } else if (lead.ppc_check) {
                    this.openMedicalDialog('ppc');
                } else if (lead.status === 'ready_to_pay') {
                    this.startPayment();
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


    sendEvents(user_action, data = {}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'summary',
                'restart_clicked': this.state.restart_clicked ? 'yes' : 'no',
                'restart_conformation': this.state.restart_conformation ? 'yes' : 'no',
                'edit_clicked': data.edit_clicked || ''
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
                        <div onClick={() => this.openEdit(props.edit_state)} className="generic-page-button-small">
                            EDIT
                        </div>
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
            selectedIndex: selectedIndex
        })
    }

    openEdit = (state) => {
        this.sendEvents('next', { edit_clicked: state });
        this.navigate(state);
    }

    handleClose = () => {
        this.setState({
            openDialogReset: false,
            medical_dialog: false
        })
    }

    renderDialog = () => {
        return (
            <Dialog
                fullScreen={false}
                open={this.state.openDialogReset || false}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        All the data will be saved. Are you sure you want to restart?
              </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.resetQuote} color="default">
                        YES
              </Button>
                    <Button onClick={this.handleClose} color="default" autoFocus>
                        CANCEL
              </Button>
                </DialogActions>
            </Dialog>
        );
    }

    showDialog = () => {
        this.setState({
            openDialogReset: true
        });
    }


    handleChange = name => event => {
        if (!name) {
            name = event.target.name;
        }

        this.setState({
            [name]: event.target.checked
        })
    };

    render() {

        return (
            <Container

                resetpage={true}
                handleReset={this.showDialog}
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Review application form"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle={'SUBMIT'}
                handleClick={() => this.handleClick()}
            >

                <div className="common-top-page-subtitle">
                    Application no: <b>{this.state.application_info.application_id}</b>
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
                        <div className="CheckBlock2" style={{ margin: '10px 0' }}>
                            <Grid container spacing={16} alignItems="center">
                                <Grid item xs={1} className="TextCenter">
                                    <Checkbox
                                        defaultChecked
                                        checked={this.state.confirm_details_check}
                                        color="default"
                                        value="confirm_details_check"
                                        name="confirm_details_check"
                                        onChange={this.handleChange()}
                                        className="Checkbox" />
                                </Grid>
                                <Grid item xs={11}>
                                    <div className="checkbox-text">I confirm my above mentioned details </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    <BottomInfo baseData={{ 'content': 'You are one step away from knowing your eligibility' }} />
                </div>

                {this.renderDialog()}
            </Container>
        );
    }
}

export default FormSummary;