import { storageService, inrFormatDecimal, getEditTitle } from 'utils/validators';
import { getConfig, 
    // isFeatureEnabled
 } from 'utils/functions';
import { ghGetMember } from '../../constants';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import {  openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';

import {getGhProviderConfig, memberKeyMapperFunction} from './constants';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.setEditTitle = setEditTitle.bind(this);
    this.setLocalProviderData = setLocalProviderData.bind(this);
    this.memberKeyMapper = memberKeyMapper.bind(this);

    let provider = this.props.parent && this.props.parent.props ? this.props.parent.props.match.params.provider : this.props.match.params.provider;
    let providerConfig = getGhProviderConfig(provider);
    let screenData = {};
    if(this.state.screen_name && providerConfig[this.state.screen_name]) {
        screenData = providerConfig[this.state.screen_name];
    }

    let next_screen = '';
    if(this.state.screen_name && providerConfig.get_next[this.state.screen_name]) {
        next_screen = providerConfig.get_next[this.state.screen_name];
    }

    let validation_props = providerConfig.validation_props || {};

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData_' + provider) || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerConfig,
        next_screen: next_screen,
        providerConfig: providerConfig,
        provider_api: providerConfig.provider_api,
        plan_selected: groupHealthPlanData && groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected : {},
        insured_account_type: groupHealthPlanData.account_type || '',
        screenData: screenData,
        validation_props: validation_props
    })
    nativeCallback({ action: 'take_control_reset' });


    let lead = {
        member_base: []
    };

    if (this.state.get_lead) {
        try {

            this.setState({
                show_loader: true
            });

            let quote_id = storageService().get('ghs_ergo_quote_id');

            const res = await Api.get(`/api/ins_service/api/insurance/${providerConfig.provider_api}/lead/quote?quote_id=${quote_id}`);

            // const res = {
            //     "pfwutime": "",
            //     "pfwuser_id": 0,
            //     "pfwresponse": {
            //       "status_code": 200,
            //       "requestapi": "",
            //       "result": {
            //         "quote": {
            //           "vendor_action_required_title": null,
            //           "policy_number": null,
            //           "family_size": "1A",
            //           "dob": "28-01-1997",
            //           "vendor_action_required_message": "",
            //           "sum_assured": 5,
            //           "dt_policy_start": null,
            //           "transaction_date": null,
            //           "plan_title": "",
            //           "data_src": "Health_Insurance_Quotation_Lead",
            //           "gender": null,
            //           "payment_status": "init",
            //           "user_source": "fisdom_dev",
            //           "account_id": "d5871293308076032",
            //           "add_ons": [
            //             "CAREWITHNCB",
            //             "UAR"
            //           ],
            //           "application_number": null,
            //           "add_ons_amount": 3043.0,
            //           "city": null,
            //           "status": "cancelled",
            //           "premium": 17393.0,
            //           "plan_code": null,
            //           "eldest_dob": "28/01/1997",
            //           "nominee_account_key": {
            //             "ped_diseases": [
                          
            //             ],
            //             "medical_questions": [
                          
            //             ],
            //             "marital_status": "",
            //             "mand_question_exists": true,
            //             "gender": "",
            //             "nationality": "INDIAN",
            //             "life_style_question_exists": false,
            //             "dob": "",
            //             "correspondence_address": {
                          
            //             },
            //             "mobile_number": "",
            //             "weight": null,
            //             "pan_number": "",
            //             "id": "5626435075047424",
            //             "life_style_question": {
                          
            //             },
            //             "dt_created": "03-09-2020",
            //             "name": "ankit mehla ror",
            //             "height": null,
            //             "relation": "NEPHEW",
            //             "permanent_address": {
                          
            //             },
            //             "email": "",
            //             "dt_updated": "05-09-2020",
            //             "ped_exists": true,
            //             "ped_diseases_name": null
            //           },
            //           "applicant_dob": "",
            //           "ppc_check": false,
            //           "insured_pattern": null,
            //           "self_account_key": {
            //             "ped_diseases": [
            //               {
            //                 "answer_description": null,
            //                 "key_mapper": "ped_no_1",
            //                 "answer": true,
            //                 "start_date": "01/02/2019",
            //                 "medical_question": "PEDdiabetesDetails"
            //               }
            //             ],
            //             "medical_questions": [
            //               {
            //                 "answer_description": null,
            //                 "key_mapper": "mand_1",
            //                 "answer": true,
            //                 "start_date": null,
            //                 "medical_question": "HEDHealthHospitalized"
            //               },
            //               {
            //                 "answer_description": null,
            //                 "key_mapper": "mand_2",
            //                 "answer": false,
            //                 "start_date": null,
            //                 "medical_question": "HEDHealthClaim"
            //               },
            //               {
            //                 "answer_description": null,
            //                 "key_mapper": "mand_3",
            //                 "answer": false,
            //                 "start_date": null,
            //                 "medical_question": "HEDHealthDeclined"
            //               },
            //               {
            //                 "answer_description": null,
            //                 "key_mapper": "mand_4",
            //                 "answer": false,
            //                 "start_date": null,
            //                 "medical_question": "HEDHealthCovered"
            //               }
            //             ],
            //             "marital_status": "",
            //             "mand_question_exists": true,
            //             "gender": "MALE",
            //             "nationality": "INDIAN",
            //             "life_style_question_exists": true,
            //             "dob": "28-01-1997",
            //             "correspondence_address": {
                          
            //             },
            //             "mobile_number": "6363566840",
            //             "weight": "67",
            //             "pan_number": "",
            //             "id": "6752334981890048",
            //             "life_style_question": {
            //               "answer_description": "sas fdfd dds",
            //               "key_mapper": "lifestylye_no_1",
            //               "answer": true,
            //               "start_date": "01/03/2020",
            //               "medical_question": "PEDSmokeDetails"
            //             },
            //             "dt_created": "03-09-2020",
            //             "name": "ravinder mehla",
            //             "height": "163",
            //             "relation": "SELF",
            //             "permanent_address": {
                          
            //             },
            //             "email": "ravindermehla77@gmail.com",
            //             "dt_updated": "05-09-2020",
            //             "ped_exists": true,
            //             "ped_diseases_name": null
            //           },
            //           "mobile_number": "9717317075",
            //           "tenure": 1,
            //           "id": "5063485121626112",
            //           "cover_type": "WF",
            //           "vendor_status": null,
            //           "policy_status": null,
            //           "dt_created": "03-09-2020",
            //           "name": null,
            //           "discount_amount": 1532.0,
            //           "plan": "plan1",
            //           "permanent_address": {
            //             "state": "UTTAR PRADESH",
            //             "country": "INDIA",
            //             "street": "",
            //             "id": 6339296566968320,
            //             "dt_created": "05-09-2020",
            //             "addressline2": "maghun",
            //             "district": "",
            //             "account_id": "d5871293308076032",
            //             "dt_updated": "05-09-2020",
            //             "pincode": "201010",
            //             "house_no": "",
            //             "city": "Ghaziabad",
            //             "address_line": "Vaishali",
            //             "landmark": "",
            //             "addressline": "Vaishali"
            //           },
            //           "email": "ravindermehla77@gmail.com",
            //           "dt_updated": "05-09-2020",
            //           "base_plan_title": null,
            //           "account_type": "self",
            //           "total_amount": 18904.0,
            //           "tax_amount": 187.44,
            //           "provider": null,
            //           "ped_check": false,
            //           "user_id": "5871293308076032",
            //           "logo": null
            //         },
            //         "common": {
                      
            //         }
            //       }
            //     },
            //     "pfwmessage": "Success",
            //     "pfwstatus_code": 200,
            //     "pfwtime": "2020-09-05 15:10:19.871875"
            //   }
               
               
              
            var resultData = res.pfwresponse.result;

            this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {

                lead = resultData.quote;
                lead.member_base = ghGetMember(lead, this.state.providerConfig);
                this.setState({
                    lead: resultData.quote || {},
                    common_data: resultData.common,
                    insured_account_type: lead.account_type || ''
                }, () => {
                    if (this.onload && !this.state.ctaWithProvider) {
                        this.onload();
                    }

                })
            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false,
                lead: lead,
                common_data: {}
            });
            toast('Something went wrong');
        }
    }

    if (this.state.ctaWithProvider) {


        let leftTitle, leftSubtitle, sum_assured, tenure, base_premium, tax_amount, total_amount = '';
        if (this.state.get_lead) {
            leftTitle = lead.plan_title || '';
            leftSubtitle = inrFormatDecimal(lead.total_amount);
            sum_assured = lead.sum_assured;
            tenure = lead.tenure;
            base_premium = lead.premium;
            tax_amount = lead.tax_amount;
            total_amount = lead.total_amount;

        } else {
            let premium_data = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.premium_data.WF : [];
            let selectedIndexSumAssured = groupHealthPlanData.selectedIndexSumAssured || 0;

            this.setState({
                premium_data: premium_data
            })

            leftTitle = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '';
            leftSubtitle = premium_data[selectedIndexSumAssured] ? inrFormatDecimal(premium_data[selectedIndexSumAssured].net_premium) : '';

        }

        let bottomButtonData = {
            leftTitle: leftTitle,
            leftSubtitle: leftSubtitle,
            leftArrow: 'up',
            provider: providerConfig.key,
            logo: providerConfig.logo_cta
        }

        let confirmDialogData = {
            buttonData: {
                ...bottomButtonData,
                leftArrow: 'down'
            },
            buttonTitle: "OK",
            content1: [
                {
                    'name': 'Basic premium ', 'value':
                        inrFormatDecimal(base_premium)
                },
                { 'name': 'GST & other taxes', 'value': inrFormatDecimal(tax_amount) }
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal(total_amount) }
            ],
            sum_assured: sum_assured,
            tenure: tenure
        }


        this.setState({
            bottomButtonData: bottomButtonData,
            confirmDialogData: confirmDialogData
        }, () => {
            if (this.onload) {
                this.onload();
            }

        })
    }
}

export function updateBottomPremium(premium) {

    this.setState({
        bottomButtonData: {
            ...this.state.bottomButtonData,
            leftSubtitle: inrFormatDecimal(premium || this.state.premium_data[this.state.selectedIndex].net_premium)
        }
    })
}

export async function updateLead(body, quote_id) {
    try {


        if (!quote_id) {
            quote_id = storageService().get('ghs_ergo_quote_id');
        }

        this.setState({
            show_loader: true
        });

        const res = await Api.post(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/lead/update?quote_id=${quote_id}`,body);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            if(this.props.edit && !this.state.force_forward) {
                this.props.history.goBack();
            } else {
                this.navigate(this.state.next_state);
            }
            
        } else {
            this.setState({
                show_loader: false
            });
            if (resultData.bmi_check) {
                this.setState({
                    openBmiDialog: true
                }, () => {
                    this.sendEvents('next', {bmi_check: true})
                })
            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
            }
        }
    } catch (err) {
        console.log(err)
        this.setState({
            show_loader: false
        });
        toast('Something went wrong');
    }
}

export function navigate(pathname, data = {}) {

    if (this.props.edit || data.edit) {
        this.props.history.replace({
            pathname: pathname,
            search: getConfig().searchParams
        });
    } else {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
            params: {
                forceClose: this.state.forceClose || false
            }
        });
    }

}

export async function resetQuote() {

    this.handleClose();
    let quote_id = storageService().get('ghs_ergo_quote_id');
    this.setState({
        show_loader: true,
        restart_conformation: true
    }, () => {
        this.sendEvents('next');
    });

    try {
        const res = await Api.get(`/api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/lead/cancel/${quote_id}`);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {

            let next_state = `/group-insurance/group-health/${this.state.provider}/insure-type`;
            this.navigate(next_state);
            this.setState({
                resultData: resultData
            })

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

export function openInBrowser(url, type) {

    if(!url) {
        return;
    }
    this.sendEvents(type);

    let mapper = {
        'tnc' : {
            header_title: 'Terms & Conditions',
            file_name: 'terms_and_conditions'
        },
        'read_document' : {
            header_title: 'Read Detailed Document',
            file_name: 'read_detailed_document'
        }
    }

    let mapper_data = mapper[type];

    if(getConfig().Android && !getConfig().isWebCode) {
        nativeCallback({
            action: 'download_on_device',
            message: {
                url: url || '',
                file_name: mapper_data.file_name + '.pdf'
            }
        });
    } else {

        if (!getConfig().Web) {
            this.setState({
                show_loader: true
            })
        }
    
    
        
    
        let data = {
            url: url,
            header_title: mapper_data.header_title,
            icon: 'close'
        };
    
        openPdfCall(data);

        // let open_inapp_tab_hs = isFeatureEnabled(getConfig(), 'open_inapp_tab_hs');

        // if(open_inapp_tab_hs) {
    
        //     if(!getConfig().Web) {
        //         url = "https://docs.google.com/gview?embedded=true&url=" + url;
        //     }
            
        //     nativeCallback({
        //         action: 'open_inapp_tab',
        //         message: {
        //             url: url || ''
        //         }
        //     });
        // } else {
        //     if (!getConfig().Web) {
        //         this.setState({
        //             show_loader: true
        //         })
        //     }
        
        //     let mapper = {
        //         'tnc' : {
        //             header_title: 'Terms & Conditions',
        //         },
        //         'read_document' : {
        //             header_title: 'Read Detailed Document',
        //         }
        //     }
        
        //     let mapper_data = mapper[type];
        
        //     let data = {
        //         url: url,
        //         header_title: mapper_data.header_title,
        //         icon: 'close'
        //     };
        
        //     openPdfCall(data);
        // }
    }

    
    
}

export function setEditTitle(string) {

    if(this.props.edit) {
        return getEditTitle(string);
    }

    return string;
}

export function openMedicalDialog(type) {
    
    let data = {
        'header_title': 'Free medical check-up',
        'content': 'Based on your details, a medical checkup will be required to issue the policy. HDFC ERGO team will contact you for the <b>free medical checkup</b> after the policy payment.', //ppc
        'icon': 'ic_medical_checkup2',
        'dialog_name': 'medical_dialog',
        'cta_title': 'CONTINUE TO PAYMENT',
        'handleClick': this.startPayment
    }

    if(type === 'ped') {
        data.content = 'Your details will be reviewed by the HDFC Ergo team before policy issuance. You may be contacted for a <b>free medical checkup</b> after the policy payment.'
    }

    this.setState({
        medical_dialog: true,
        medical_dialog_data: data,
        medical_dialog_opened: true,
        show_loader: false
    })
   
}

export function setLocalProviderData(data) {
    storageService().setObject('groupHealthPlanData_' + this.state.provider, data);
}

export function memberKeyMapper(member_key) {
    const final_dob_list = memberKeyMapperFunction(member_key, this.state.groupHealthPlanData);
    return final_dob_list.filter(data => data.key === member_key)[0];
}