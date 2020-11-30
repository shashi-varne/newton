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
import {getCoverageType} from '../constants';

import Checkbox from 'material-ui/Checkbox';
// import Checkbox from '../../../../common/ui/Checkbox';
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
            quotation : {  member_base : []},
            tncChecked: true,
            accordianData: [],
            openDialogReset: false,
            quote_id: storageService().get('ghs_ergo_quote_id'),
            screen_name:'final_summary_screen',
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

        let insured_people_details = lead.insured_people_details;
        let buyer_details = lead.buyer_details;
        buyer_details.key = 'applicant';
        let member_base = [];

        insured_people_details.forEach(element => {
            element.insured_person.answers = element.answers
            member_base.push(element.insured_person)
          });
      
          member_base.forEach(element => {
            let relation = this.state.member_base.find(mem => mem.backend_key === element.relation_key)
             element.key = relation.key
           });
          member_base.push(buyer_details);
        let ped_list = (this.state.providerConfig.select_ped_screen || {}).ped_list || [];
        
        let applicantIndex = this.state.member_base.findIndex(item => item.key === "applicant");
        if(applicantIndex >=0) {
            let appli_data = member_base[applicantIndex];
            member_base.splice(applicantIndex, 1);
            member_base.splice(0, 0, appli_data);
        }
      
              let body = {}
              let pedcase = false;
              body["insured_people_details"] = []
              this.state.lead.insured_people_details.forEach((memberData) => {
                 let relation_key  = memberData.insured_person.relation_key
                 if(memberData.answers.pre_existing_diseases.length === 0 && memberData.insured_person.ped === true){
                    pedcase = true
                     body["insured_people_details"].push( { 'ped': false, "relation_key" : relation_key} )
                 }else if(memberData.answers.pre_existing_diseases.length === 0 ){
               body["insured_people_details"].push( { 'ped': false, "relation_key" : relation_key} )
           } else  if(memberData.answers.pre_existing_diseases.length > 0 ){
            body["insured_people_details"].push( { 'ped': true, "relation_key" : relation_key} )
           }
             })
         member_base.sort((a, b) => {return this.state.member_base.findIndex(p => p.backend_key === a.relation_key) - this.state.member_base.findIndex(p => p.backend_key === b.relation_key)})

             if(pedcase){
                this.updateLead(body); 
                // window.location.reload();
             }

        this.setState({
            applicantIndex: applicantIndex,
            member_base: member_base
        });

        let pan_amount = this.state.pan_amount;

        let pan_needed = false;
        if (lead.quotation_details.total_premium > pan_amount) {
            pan_needed = true;
        }

        let addon = Object.keys(lead.quotation_details.add_ons).length
        if( addon !== 0) {
            let add_ons_backend = lead.quotation_details.add_ons;
            let add_ons_show = '';
            for (var key in add_ons_backend) {

                if(add_ons_show) {
                    add_ons_show += ', ';
                }

                add_ons_show += add_ons_backend[key].title;
               
            }

            this.setState({
                add_ons_show: add_ons_show
            })
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

        if(provider === 'STAR') {
            personal_details_to_copy.push({
                'title': 'Occupation',
                'key': 'occupation'
            })
        }

        const med_ques_mapper_religare = {
            'religare_mhd_prev_hosp': {
                'disc': 'Any illness/injury in last 48 months?',
                'members': []
            },
            'religare_mhd_file_claim': {
                'disc': 'Previous health insurance claim?',
                'members': []
            },
            'religare_mhd_prev_proposal_decline': {
                'disc': 'Previous health insurance declined/increase?',
                'members': []
            },
            'religare_mhd_exising_policy_in_religare': {
                'disc': 'Already covered with Care (formerly Religare)?',
                'members': []
            }
        }

        let accordianData = [];

        let diseases_data_backend = [];
        let life_style_details_data = [];
        let members_for_life_style = [];
        let med_ques_data = med_ques_mapper_religare;

        if (provider === 'STAR') {
            let health_data = {
                'title': 'Health details',
                data: [
                    {
                        'title': 'Any critical illness?',
                        'subtitle': 'No'
                    }
                ]
            }
        
            accordianData.push(health_data);
        }

        for (var i = 0; i < member_base.length; i++) {
            let member = Object.assign({}, member_base[i]);
            let member_display = capitalizeFirstLetter(childeNameMapper(member.key));

            let obj = {
                title: `${member_display}'s details ${member_base.length > 1 ? ('(' + (applicantIndex === -1 ? lead.quotation_details.insurance_type !== 'self' ? dateOrdinal(i + 1) : '' : dateOrdinal(i))  + ' insured)') : ''}`,
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-personal-details/${member.key}`
            }

            if (member.key === 'applicant') {
                obj.title = 'Applicant details';
            }

            if (lead.quotation_details.insurance_type === 'self') {
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

                    if (['height', 'weight', 'occupation'].indexOf(info.key) !== -1) {
                        continue;
                    }
                }
                data.push(info);
            }


            if (pan_needed && (member.key === 'applicant' || member.key === 'self') &&
                lead.buyer_details.pan_no) {
                data.push({
                    'title': 'PAN number',
                    'key': 'pan',
                    'subtitle': lead.buyer_details.pan_no
                })
            }

            if(member.key === 'applicant' && (this.state.insured_account_type === 'self' || this.state.insured_account_type === 'self_family') ){
                continue    
            }
            obj.data = data;
            accordianData.push(obj);
         
            if(member.key === 'applicant'){
                continue
            }


            if (provider === 'HDFCERGO') {
                let subtitle = []
                member.answers.pre_existing_diseases.forEach((name) => {
                    let ped = ped_list.find(item => item.id === name.front_end_question_id);
                    if (ped.id === 'hdfc_ergo_ped_other_diseases') {
                        subtitle.push(name.description)
                    } else {
                        subtitle.push(ped.name)
                    }
                })

                if (member.ped) {
                    let dis_data = {
                        'title': `${(member.relation).toUpperCase()}'s diseases`,
                        'subtitle': subtitle
                    }
                    diseases_data_backend.push(dis_data);
                }
            }


            let life_style_question = member.answers.life_style_details;
            if (provider === 'RELIGARE') {
                         
                // for lifestyle     
              
                if (life_style_question.length >=1 && life_style_question[0].yes_no) {
                    members_for_life_style.push(member_display);

                    life_style_details_data.push({
                        'title': `${member_display}'s consumption details`,
                        'subtitle': life_style_question[0].description
                    });

                    life_style_details_data.push({
                        'title': `Since when`,
                        'subtitle': life_style_question[0].since_when
                    });

                }

                // for peds 
                if (member.ped) {

                    if (this.state.insured_account_type !== 'self') {
                        diseases_data_backend.push({
                            'title': `${member_display}'s pre-existing diseases`,
                            'subtitle': ' ',
                            'key': 'heading'
                        })
                    }
                    
                    // eslint-disable-next-line no-loop-func
                    member.answers.pre_existing_diseases.forEach(ped_option => {
                        
                        // eslint-disable-next-line no-loop-func 
                        let ped = ped_list.find(item => item.key === ped_option.front_end_question_id);
                        diseases_data_backend.push({
                            'title': ped_option.description || ped.name,
                            'subtitle': 'Since - ' + ped_option.since_when
                        })
                    })
                    
                    diseases_data_backend.push(diseases_data_backend);
                }

                // for med questions
                if (member.answers.medical_history_details.length >= 1 ) {
                    for (var qs in member.answers.medical_history_details) {
                         let q_data = member.answers.medical_history_details[qs];
                        if (q_data.yes_no) {
                            med_ques_data[q_data.front_end_question_id].members.push(member_display);
                        }
                    }
                }

            }

            if (provider === 'STAR') {

                // for ped
                if (member.answers.pre_existing_diseases.length >= 1) {
                    members_for_life_style.push(member_display);
                    diseases_data_backend.push({
                        'title': `${member_display}'s pre-existing disease details`,
                        'subtitle': member.answers.pre_existing_diseases[0].description
                    });

                }
            }
        }
        // console.log(med_ques_data);

        let contact_data = {
            'title': 'Contact details',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-contact`,
            data: [
                {
                    'title': 'Email id',
                    'subtitle': lead.buyer_details.email
                },
                {
                    'title': 'Mobile number',
                    'subtitle': lead.buyer_details.phone_number
                }
            ]
        }

        accordianData.push(contact_data);
    
        let address_data_backend = [lead.address_details.correspondence_address ,lead.address_details.permanent_address];

        if (['HDFCERGO', 'STAR'].includes(provider)) {
            address_data_backend = [lead.address_details.permanent_address]
        }

        let data = address_data_backend.map((item, index) => {
            return [
                {
                    'title': `${provider==='RELIGARE'? index === 0 ? 'Current address' : 'Permanent address':''}`,
                    'subtitle': ' ',
                    'key': 'heading'
                },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                {
                    'title': 'Address line 1',
                    'subtitle': item.addr_line1
                },
                {
                    'title': 'Address line 2',
                    'subtitle': item.addr_line2
                },
                {
                    'title': 'Pincode',
                    'subtitle': item.pincode
                },
                {
                    'title': 'City',
                    'subtitle': item.city
                },
                {
                    'title': 'State',
                    'subtitle': item.state
                }
            ]
        })

        if (provider === 'STAR') {
            data[0].splice(5, 0, {
                'title': 'Area',
                'subtitle': address_data_backend[0].area
            })
        };

        let address_data={
            'title': 'Address details',
            edit_state: `${provider==='STAR'?`/group-insurance/group-health/${this.state.provider}/edit-address-star`:`/group-insurance/group-health/${this.state.provider}/edit-address`}`,
            data: data 
        }

        accordianData.push(address_data);

        let nominee_data_backend = lead.nominee_details;
        let nominee_data = {
            'title': 'Nominee',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-nominee`,
            data: [
                {
                    'title': 'Name',
                    'subtitle': nominee_data_backend.name
                },
                {
                    'title': 'Relation',
                    'subtitle': nominee_data_backend.relation
                }
            ]
        }

        if (provider === 'STAR') {

            nominee_data.data.push(
                {
                    'title': 'Date of birth',
                    'subtitle': nominee_data_backend.dob
                },
            )

            if (lead.appointee_details.name) {
                let appointee_data_backend = lead.appointee_details;
                nominee_data.data = [
                    ...nominee_data.data,
                    {
                        'title': 'Appointee name',
                        'subtitle': appointee_data_backend.name
                    },
                    {
                        'title': 'Appointee relation',
                        'subtitle': appointee_data_backend.relation
                    },
                    {
                        'title': 'Appointee date of birth',
                        'subtitle': appointee_data_backend.dob
                    }
                ]
            }
        }

        accordianData.push(nominee_data);

        if (provider === 'RELIGARE') {
            let data = [];
            if (members_for_life_style.length !== 0) {
                data = [
                    {
                        'title': 'Smoke/consume alcohol',
                        'subtitle': 'Yes'
                    },
                    {
                        'title': 'Who?',
                        'subtitle': members_for_life_style.join(', ')
                    }
                ]
            } else {
                data = [
                    {
                        'title': 'Smoke/consume alcohol',
                        'subtitle': 'No'
                    }
                ]
            }
            

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


        if (diseases_data_backend.length === 0) {
            diseases_data_backend.push({
                'title': `Any pre-existing diseases?`,
                'subtitle': 'No'
            })
        }


        let ped_edit_state = provider === 'STAR'  ? 'edit-star-select-ped' : 'edit-is-ped';
        let diseases_data = {
            'title': 'Pre-existing diseases',
            edit_state: `/group-insurance/group-health/${this.state.provider}/${ped_edit_state}`,
            data: diseases_data_backend
        }

        accordianData.push(diseases_data);
        this.setState({
            accordianData: accordianData
        })
    }

    redirectToPayment = (pg_data) => {  
        let resultData = this.state.pg_data;
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

        // if(this.state.provider === 'RELIGARE' && !data.showMedDialog) {
            // this.redirectToPayment();
        //     return;
        // }
        let application_id = storageService().get('health_insurance_application_id');
        try {
            let res = await Api.get(`api/insurancev2/api/insurance/health/payment/start_payment/${this.state.providerConfig.provider_api}?application_id=${application_id}`);       
           

            var resultData = res.pfwresponse.result;
            this.setState({
                pg_data: resultData
            }); 

            if (res.pfwresponse.status_code === 200) {
                    if (this.state.provider === 'HDFCERGO') {
                        let lead = resultData || {};
                        if (lead.ped_check) {
                            this.openMedicalDialog('ped');
                        } else if (lead.ppc_check) {
                            this.openMedicalDialog('ppc');
                        } else if (lead.application_status === 'ready_for_payment') {
                            this.redirectToPayment(resultData);
                        }
                    } else {
                        if(resultData.ped_check && data.showMedDialog) {
                            this.openMedicalDialog('ppc');
                            return;
                        } else {
                            this.redirectToPayment(resultData);
                        }
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

    // checkPPC = async () => {
    //     let application_id = storageService().get('health_insurance_application_id');
    //     this.setState({
    //         show_loader: true
    //     });
    //     try {
           
    //         let res = await Api.get(`api/insurancev2/api/insurance/proposal/${this.state.providerConfig.provider_api}/ppc_ped_check?application_id=${application_id}`);

    //         var resultData = res.pfwresponse.result;
    //         if (res.pfwresponse.status_code === 200) {
    //             if(this.state.provider === 'HDFCERGO') {
    //                 let lead = resultData.quote_lead || {};
    //                 if (lead.ped_check) {
    //                     this.openMedicalDialog('ped');
    //                 } else if (lead.ppc_check) {
    //                     this.openMedicalDialog('ppc');
    //                 } else if (lead.status === 'ready_to_pay') {
    //                     this.startPayment();
    //                 }
    //             } else {
    //                 this.startPayment({showMedDialog : true});
    //             }
                
    //         } else {
    //             this.setState({
    //                 show_loader: false
    //             });
    //             toast(resultData.error || resultData.message
    //                 || 'Something went wrong');
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         this.setState({
    //             show_loader: false
    //         });
    //         toast('Something went wrong');
    //     }
    // }

    handleClick = async () => {


        if(!this.state.tncChecked){
            toast('Please Agree to the Terms and Conditions');
            return;
          }
        this.sendEvents('next');
        let {lead}  = this.state;

        if(this.state.provider === 'STAR') {
            if(lead.application_details.ped) {
                // this.openMedicalDialog('ped');
                this.startPayment({showMedDialog : true});
                return;
            }
            else {
                this.startPayment();
            }
        } else {
            this.startPayment({showMedDialog : true});
        }
        
    }


    sendEvents(user_action, data = {}) {
        let eventObj = {
            "event_name": 'health_insurance',
            "properties": {
                "user_action": user_action,
                "product": this.state.providerConfig.provider_api,
                "flow": this.state.insured_account_type || '',
                "screen_name": 'summary',
                'restart_clicked': this.state.restart_clicked ? 'yes' : 'no',
                'restart_conformation': this.state.restart_conformation ? 'yes' : 'no',
                'edit_clicked': data.edit_clicked || '',
                't&c_clicked': this.state.tncChecked ? 'yes' : 'no',
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
                "product": this.state.providerConfig.provider_api,
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
        if (props.key === "applicant") {
           if (this.state.quotation.insurance_type === 'self' || this.state.quotation.insurance_type === 'self_family') {
               return;
           }
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
                            {this.state.applicantIndex === -1 ? (this.state.quotation.insurance_type !== 'self' ? dateOrdinal(index + 1) : '') : dateOrdinal(index)} Insured name
                        </div>
                        <div className="mtr-bottom">
                            {props.name} ({childeNameMapper(props.key)})
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
                        <div className="title" style={{opacity: props.key === 'heading' ? 0.6 : ''}}>
                            {props.title}
                        </div>
                        <div className="subtitle" style={{margin : '7px 0 0 0',whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                          {capitalizeFirstLetter((props.subtitle + "").toLowerCase())}
                             {(props.title==='Height' && <span>cm</span>) || (props.title==='Weight' && <span>kg</span>)}
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

                {props.open && props.title !== 'Address details' &&
                    <div className="bct-content">
                        {props.data.map(this.renderAccordiansubData)}
                        {props.edit_state && 
                        <div onClick={() => this.openEdit(props.edit_state, props.title)} className="generic-page-button-small">
                            EDIT
                        </div>}
                    </div>}

                {props.open && props.title === 'Address details' &&
                    <div className={`bct-content bct-content-address`}>

                        {props.data[0].map(this.renderAccordiansubData)}
                        <div onClick={() => this.openEdit(props.edit_state, props.title)} className="generic-page-button-small">
                            EDIT
                        </div>
                        <br />
                        {this.state.provider === 'RELIGARE' && <React.Fragment>
                            {props.data[1].map(this.renderAccordiansubData)}
                            <div onClick={() => this.openEdit(props.edit_state, props.title)} className="generic-page-button-small">
                                EDIT
                            </div>
                        </React.Fragment>}
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

    handleTermsAndConditions = () =>{
        this.setState({
          tncChecked : !this.state.tncChecked
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
            buttonTitle={`MAKE PAYMENT OF ${inrFormatDecimal(this.state.quotation.total_premium)}`}
            handleClick={() => this.handleClick()}
        >

            <div className="group-health-final-summary">
                <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                    <div className="left">
                          <div className="tc-title">{this.state.providerData.title2 || this.state.common_data.base_plan_title}</div>

                        <div className="tc-subtitle">{ this.state.providerData.hdfc_plan_title_mapper ? this.state.providerData.hdfc_plan_title_mapper[this.state.quotation.plan_id] : this.state.providerData.subtitle }</div>
                    </div>

                    <div className="tc-right">
                        <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                    </div>
                </div>

                <div className='mid-content'>

                    {this.state.member_base && this.state.member_base.map(this.renderMembertop)}

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                SUM INSURED
                            </div>
                            <div className="mtr-bottom">
                                {numDifferentiationInr(this.state.quotation.individual_sum_insured)}
                            </div>
                        </div>
                    </div>
                   
                    { this.state.add_ons_show && (Object.keys(this.state.quotation.add_ons).length > 0) && <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                ADD ON
                            </div>
                            <div className="mtr-bottom">
                                {this.state.add_ons_show}
                            </div>
                        </div>
                    </div>}

                   {this.state.quotation.floater_type &&
                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                COVERAGE TYPE
                            </div>
                            <div className="mtr-bottom">
                            {getCoverageType(this.state.lead)}
                            </div>
                        </div>
                    </div>}

                    <div className="member-tile">
                        <div className="mt-left">
                            <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                        </div>
                        <div className="mt-right">
                            <div className="mtr-top">
                                COVER PERIOD
                            </div>
                            <div className="mtr-bottom">
                                {this.state.quotation.tenure} year{this.state.quotation.tenure>'1' && <span>s</span>}
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
                            <div className="mtr-bottom flex" style={{textTransform:'none'}}>
                                <div>
                                    <div> {inrFormatDecimal(this.state.quotation.base_premium - this.state.quotation.total_discount)} </div>
                                    <div style={{ fontSize: 10 }}> (Basic premium)</div>
                                </div>
                                <div>
                                    &nbsp;+&nbsp;
                                </div>
                                {this.state.add_ons_show && (Object.keys(this.state.quotation.add_ons).length > 0)  &&
                                    <div>
                                        <div> {inrFormatDecimal(this.state.quotation.add_on_premium)} </div>
                                        <div style={{ fontSize: 10 }}> (Add on amount)</div>
                                    </div>
                                }
                                {this.state.add_ons_show && (Object.keys(this.state.quotation.add_ons).length > 0)  &&
                                    <div>
                                        &nbsp;+&nbsp;
                                    </div>
                                }
                                <div>
                                    <div>{inrFormatDecimal(this.state.quotation.gst)} </div>
                                    <div style={{ fontSize: 10 }}>(18% GST) </div>
                                </div>
                                <div>
                                    &nbsp;=&nbsp;
                                    </div>
                                <div>
                                    {inrFormatDecimal(this.state.quotation.total_premium)}
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
                  checked={this.state.tncChecked}
                  color="default"
                  value="checked"
                  name="checked"
                  onChange={this.handleTermsAndConditions}
                  className="Checkbox"
                />
                    </Grid>
                    <Grid item xs={11}>
                        <div className="accident-plan-terms-text" style={{}}>
                        I agree to the <span onClick={() => this.openInBrowser(this.state.lead.terms_and_condition,
                        'tnc')} className="accident-plan-terms-bold" style={{ color: getConfig().primary }}>
                            Terms and conditions</span></div>
                    </Grid>
                    </Grid>
                </div>
                  <BottomInfo baseData={{ 'content': 'Complete your details and get quality medical treatments at affordable cost' }} />
            </div>
            {this.state.medical_dialog_data &&
                <BottomSheet parent={this} data={this.state.medical_dialog_data} />}
            {this.renderDialog()}
        </Container>
    );
}
}

export default GroupHealthPlanFinalSummary;