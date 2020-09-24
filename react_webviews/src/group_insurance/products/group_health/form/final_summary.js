import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../../common/ui/Toast';
import { initialize, updateLead, resetQuote, openMedicalDialog } from '../common_data';
import BottomInfo from '../../../../common/ui/BottomInfo';
import {
    numDifferentiationInr, inrFormatDecimal,
    capitalizeFirstLetter, storageService, dateOrdinal
} from 'utils/validators';
import Api from 'utils/api';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import BottomSheet from '../../../../common/ui/BottomSheet';
import { childeNameMapper } from '../../../constants';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class GroupHealthPlanFinalSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            get_lead: true,
            common_data: {},
            lead: {
                member_base: []
            },
            accordianData: [],
            openDialogReset: false,
            quote_id: storageService().get('ghs_ergo_quote_id')
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
        this.resetQuote = resetQuote.bind(this);
        this.openMedicalDialog = openMedicalDialog.bind(this);
    }


    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
        this.initialize();
    }

    onload = () => {
        let { lead, provider } = this.state;
        let member_base = lead.member_base;
        let applicantIndex = member_base.findIndex(item => item.key === 'applicant');
        console.log(applicantIndex);
        if(applicantIndex >=0) {
            let appli_data = member_base[applicantIndex];
            member_base.splice(applicantIndex, 1);
            member_base.splice(0, 0, appli_data);
        }
        

        this.setState({
            applicantIndex: applicantIndex
        })

        let pan_needed = false;
        if (lead.total_amount > 100000) {
            pan_needed = true;
        }


        let personal_details_to_copy = [
            {
                'title': 'Insured name',
                'key': 'name'
            },
            {
                'title': 'Date of birth',
                'key': 'dob'
            },
            {
                'title': 'Gender',
                'key': 'gender'
            },
            {
                'title': 'Height',
                'key': 'height'
            },
            {
                'title': 'Weight',
                'key': 'weight'
            }
        ];

        const med_ques_mapper_religare = {
            'mand_1': {
                'disc': 'Any illness/injury in last 48 months?',
                'members': []
            },
            'mand_2': {
                'disc': 'Previous health insurance claim?',
                'members': []
            },
            'mand_3': {
                'disc': 'Previous health insurance declined/increase?',
                'members': []
            },
            'mand_4': {
                'disc': 'Already covered with Religare?',
                'members': []
            }
        }

        let accordianData = [];

        let diseases_data_backend = [];
        let life_style_details_data = [];
        let members_for_life_style = [];
        let med_ques_data = med_ques_mapper_religare;
        for (var i = 0; i < member_base.length; i++) {
            let member = Object.assign({}, member_base[i]);
            let member_display = capitalizeFirstLetter(childeNameMapper(member.key));

            let obj = {
                title: `${member_display}'s details ${member_base.length > 1 ? ('(' + (applicantIndex === -1 ? dateOrdinal(i + 1) : dateOrdinal(i))  + ' insured)') : ''}`,
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-personal-details/${member.key}`
            }

            if (member.key === 'applicant') {
                obj.title = 'Applicant details';
            }

            if (lead.account_type === 'self') {
                obj.title = 'Personal details';
            }

            let info = {};
            let data = [];

            for (var pc in personal_details_to_copy) {
                info = Object.assign({}, personal_details_to_copy[pc]);
                info.subtitle = member[info.key];

                if (member.key === 'applicant') {

                    if (info.key === 'name') {
                        info.title = 'Applicant name';
                    }

                    if (info.key === 'height' || info.key === 'weight') {
                        continue;
                    }
                }
                data.push(info);
            }


            if (pan_needed && (member.key === 'applicant' || member.key === 'self') &&
                lead.self_account_key.pan_number) {
                data.push({
                    'title': 'PAN number',
                    'key': 'pan',
                    'subtitle': lead.self_account_key.pan_number
                })
            }

            obj.data = data;
            accordianData.push(obj);


            if (provider === 'HDFCERGO') {
                if (member.ped_diseases_name) {
                    let dis_data = {
                        'title': `${member.relation}'s diseases`,
                        'subtitle': member.ped_diseases_name
                    }

                    diseases_data_backend.push(dis_data);
                }
            }


            let life_style_question = member.life_style_question;
            if (provider === 'RELIGARE') {

                // for lifestyle

                if (life_style_question && life_style_question.answer) {
                    members_for_life_style.push(member_display);

                    life_style_details_data.push({
                        'title': `${member_display}'s consumption details`,
                        'subtitle': life_style_question.answer_description
                    });

                    life_style_details_data.push({
                        'title': `Since when`,
                        'subtitle': life_style_question.start_date
                    });

                }


                // for peds
                if (member.ped_exists) {
                    
                    let p_list = '';

                    for (var p in member.ped_diseases) {
                        if (p_list) {
                            p_list += ', ';
                        }
                        p_list += `${(member.ped_diseases[p].answer_description || member.ped_diseases[p].key_mapper)} (${member.ped_diseases[p].start_date})`
                    }
                    let dis_data = {
                        'title': `${member_display}'s diseases`,
                        'subtitle': p_list
                    }

                    diseases_data_backend.push(dis_data);
                }

                // for med questions
                if (member.medical_questions) {
                    for (var qs in member.medical_questions) {
                        let q_data = member.medical_questions[qs];
                        if (q_data.answer) {
                            med_ques_data[q_data.key_mapper].members.push(member_display);
                        }
                    }
                }

            }
        }
        // console.log(med_ques_data);

        let contact_data = {
            'title': 'Contact details',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-contact`,
            data: [
                {
                    'title': 'Email',
                    'subtitle': lead.email
                },
                {
                    'title': 'Mobile number',
                    'subtitle': lead.mobile_number
                }
            ]
        }

        accordianData.push(contact_data);

        let address_data_backend = lead.permanent_address;

        let address_data = {
            'title': 'Address details',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-address`,
            data: [
                {
                    'title': 'Address line 1',
                    'subtitle': address_data_backend.addressline
                },
                {
                    'title': 'Address line 2',
                    'subtitle': address_data_backend.addressline2
                },
                {
                    'title': 'Pincode',
                    'subtitle': address_data_backend.pincode
                },
                {
                    'title': 'City',
                    'subtitle': address_data_backend.city
                },
                {
                    'title': 'State',
                    'subtitle': address_data_backend.state
                }
            ]
        }

        accordianData.push(address_data);

        let nominee_data_backned = lead.nominee_account_key;
        let nominee_data = {
            'title': 'Nominee',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-nominee`,
            data: [
                {
                    'title': 'Name',
                    'subtitle': nominee_data_backned.name
                },
                {
                    'title': 'Relation',
                    'subtitle': nominee_data_backned.relation
                }
            ]
        }
        accordianData.push(nominee_data);

        if (provider === 'RELIGARE' && members_for_life_style.length !== 0) {
            let data = [
                {
                    'title': 'Smoke/consume alcohol',
                    'subtitle': 'Yes'
                },
                {
                    'title': 'Who?',
                    'subtitle': members_for_life_style.join(', ')
                }
            ]

            data = data.concat(life_style_details_data);

            let final_data = {
                'title': 'Lifestyle details',
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-plan-lifestyle-details`,
                data: data
            }

            accordianData.push(final_data);
        }

        if (provider === 'RELIGARE') {
            let data = []

            for (var q in med_ques_data) {
                let q_data = med_ques_data[q];

                data.push({
                    title: q_data.disc,
                    subtitle: q_data.members.length !== 0 ? 'Yes' : 'No',
                    subtitle2: q_data.members.join(', ')
                })
            }

            let final_data = {
                'title': 'Medical history details',
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-plan-medical-history`,
                data: data
            }

            accordianData.push(final_data);
        }


        if (diseases_data_backend.length !== 0) {
            let diseases_data = {
                'title': 'Pre-existing diseases',
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-is-ped`,
                data: diseases_data_backend
            }

            accordianData.push(diseases_data);
        }

        this.setState({
            accordianData: accordianData
        })
    }

    redirectToPayment = (pg_data) => {
        let resultData = pg_data || this.state.pg_data;
        let current_url = window.location.href;
        let nativeRedirectUrl = current_url;

        let paymentRedirectUrl = encodeURIComponent(
            window.location.origin + `/group-insurance/group-health/${this.state.provider}/payment` + getConfig().searchParams
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
    }


    startPayment = async (data={}) => {

        if (this.state.medical_dialog) {
            this.sendEventsPopup('next');
        }
        this.setState({
            show_loader: true
        })
        this.handleClose();

        if(this.state.provider === 'RELIGARE' && !data.showMedDialog) {
            this.redirectToPayment();
            return;
        }
        try {
            let res = await Api.get(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/start/payment?lead_id=${this.state.quote_id}`);


            var resultData = res.pfwresponse.result;
            this.setState({
                pg_data: resultData
            })
            if (res.pfwresponse.status_code === 200) {

                if(resultData.ped_check && data.showMedDialog) {
                    this.openMedicalDialog('ped');
                    return;
                } else {
                    this.redirectToPayment(resultData);
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

    checkPPC = async () => {

        this.setState({
            show_loader: true
        });
        try {
            let res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/ppc/check?quote_id=${this.state.quote_id}`);


            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {

                if(this.state.provider === 'HDFCERGO') {
                    let lead = resultData.quote_lead || {};
                    if (lead.ped_check) {
                        this.openMedicalDialog('ped');
                    } else if (lead.ppc_check) {
                        this.openMedicalDialog('ppc');
                    } else if (lead.status === 'ready_to_pay') {
                        this.startPayment();
                    }
                } else {
                    this.startPayment({showMedDialog : true});
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

    handleClick = async () => {
        this.sendEvents('next');
        this.checkPPC();
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

    sendEventsPopup(user_action, data = {}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
                "screen_name": 'free_medical_checkup',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }


    renderMembertop = (props, index) => {
        if (props.key === 'applicant') {
            return (
                <div className="member-tile" key={index}>
                    <div className="mt-left">
                        <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                    </div>
                    <div className="mt-right">
                        <div className="mtr-top">
                            Applicant name
                        </div>
                        <div className="mtr-bottom">
                            {props.name}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="member-tile" key={index}>
                    <div className="mt-left">
                        <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                    </div>
                    <div className="mt-right">
                        <div className="mtr-top">
                            {this.state.applicantIndex === -1 ? index + 1 : index}st Insured name
                        </div>
                        <div className="mtr-bottom">
                            {props.name} ({props.relation.toLowerCase()})
                        </div>
                    </div>
                </div>
            );
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
                        {props.subtitle2 && <div className="subtitle">
                            {props.subtitle2}
                        </div>}
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
                        <div onClick={() => this.openEdit(props.edit_state, props.title)} className="generic-page-button-small">
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

    openEdit = (state, title) => {
        this.sendEvents('next', { edit_clicked: title });
        this.navigate(state);
    }

    handleClose = () => {

        if (this.state.medical_dialog) {
            this.sendEventsPopup('close');
        }

        if (this.state.openDialogReset) {
            this.sendEvents('next');
        }
        this.setState({
            openDialogReset: false,
            medical_dialog: false
        })
    }

    renderDialog = () => {
        return (
            <Dialog
                fullScreen={false}
                open={this.state.openDialogReset}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        You will lose your progress till now. Are you sure you want to restart?
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
            openDialogReset: true,
            restart_clicked: true
        }, () => {
            this.sendEvents('next');
        });
    }

    render() {

        return (
            <Container
                provider={this.state.provider}
                resetpage={true}
                handleReset={this.showDialog}
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Summary"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle={`MAKE PAYMENT OF ${inrFormatDecimal(this.state.lead.total_amount)}`}
                handleClick={() => this.handleClick()}
            >

                <div className="group-health-final-summary">
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            {/* <div className="tc-title">{this.state.common_data.base_plan_title}</div> */}
                            <div className="tc-subtitle">{this.state.lead.plan_title}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                        {this.state.lead.member_base.map(this.renderMembertop)}

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    SUM INSURED
                                </div>
                                <div className="mtr-bottom">
                                    {numDifferentiationInr(this.state.lead.sum_assured)}
                                </div>
                            </div>
                        </div>

                        {this.state.lead.add_ons_amount && <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    ADD ONS
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.add_ons && this.state.lead.add_ons.join(', ')}
                                </div>
                            </div>
                        </div>}

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVERAGE TYPE
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.cover_type}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVER PERIOD
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.tenure} year{this.state.lead.tenure>'1' && <span>s</span>}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    TOTAL PREMIUM
                                </div>
                                <div className="mtr-bottom flex">
                                    <div>
                                        <div> {inrFormatDecimal(this.state.lead.premium)} </div>
                                        <div style={{ fontSize: 10 }}> (Basic premium)</div>
                                    </div>
                                    <div>
                                        &nbsp;+&nbsp;
                                    </div>
                                    {this.state.lead.add_ons_amount &&
                                        <div>
                                            <div> {inrFormatDecimal(this.state.lead.add_ons_amount)} </div>
                                            <div style={{ fontSize: 10 }}> (Add on amount)</div>
                                        </div>
                                    }
                                    {this.state.lead.add_ons_amount &&
                                        <div>
                                            &nbsp;+&nbsp;
                                        </div>
                                    }
                                    <div>
                                        <div>{inrFormatDecimal(this.state.lead.tax_amount)} </div>
                                        <div style={{ fontSize: 10 }}>(18% GST) </div>
                                    </div>
                                    <div>
                                        &nbsp;=&nbsp;
                                        </div>
                                    <div>
                                        {inrFormatDecimal(this.state.lead.total_amount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-content">
                        <div className="generic-hr"></div>

                        {this.state.accordianData.map(this.renderAccordian)}


                    </div>

                    <div className="CheckBlock2 accident-plan-terms" style={{ padding: 0 }}>
                        <Grid container spacing={16} alignItems="center">
                        <Grid item xs={1} className="TextCenter">
                            <Checkbox
                            defaultChecked
                            checked={true}
                            color="default"
                            value="checked"
                            name="checked"
                            onChange={() => console.log('Clicked')}
                            className="Checkbox" />
                        </Grid>
                        <Grid item xs={11}>
                            <div className="accident-plan-terms-text" style={{}}>
                            I agree to the <span onClick={() => this.openInBrowser(this.state.common_data.tnc,
                            'tnc')} className="accident-plan-terms-bold" style={{ color: getConfig().primary }}>
                                Terms and conditions</span></div>
                        </Grid>
                        </Grid>
                    </div>
                    <BottomInfo baseData={{ 'content': 'Get best health insurance benefits at this amount and have a secured future.' }} />
                </div>
                {this.state.medical_dialog_data &&
                    <BottomSheet parent={this} data={this.state.medical_dialog_data} />}
                {this.renderDialog()}
            </Container>
        );
    }
}

export default GroupHealthPlanFinalSummary;