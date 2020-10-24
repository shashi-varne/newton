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

    let next_screen = this.state.next_state || '';
    if(this.state.screen_name && providerConfig.get_next[this.state.screen_name]) {
        next_screen = providerConfig.get_next[this.state.screen_name];
        this.setState({
            next_state: next_screen  //override
        })
    }

    let validation_props = providerConfig.validation_props || {};
    let pan_amount = providerConfig.pan_amount || '';
    let claim_settlement_ratio = providerConfig.claim_settlement_ratio || '';

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
        insured_account_type: provider === 'STAR' && (groupHealthPlanData.account_type || '').indexOf('parents') >=0 ? 
        (groupHealthPlanData.ui_members || {}).parents_option: groupHealthPlanData.account_type || '',
        screenData: screenData,
        validation_props: validation_props,
        pan_amount: pan_amount,
        claim_settlement_ratio: claim_settlement_ratio
    }, () => {
        if(!this.state.get_lead && this.state.force_onload_call) {
            this.onload();
        }
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

            let url = `/api/ins_service/api/insurance/${providerConfig.provider_api}/lead/quote?quote_id=${quote_id}`;

            if(this.state.screen_name === 'final_summary_screen') {
                url += `&forms_completed=true`;
            }
            const res = await Api.get(url);
              
            var resultData = res.pfwresponse.result;
            
             this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {

                lead = resultData.quote;
                lead.base_premium = lead.base_premium_showable || lead.premium; // incluesive of addons
                lead.member_base = ghGetMember(lead, this.state.providerConfig);
                this.setState({
                    lead: resultData.quote || {},
                    common_data: {
                        ...resultData.common,
                        tnc: resultData.common.tnc || resultData.tnc
                    },
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
            console.log(err);
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
            leftSubtitle = lead.total_amount;
            sum_assured = lead.sum_assured;
            tenure = lead.tenure;
            base_premium = lead.base_premium;
            tax_amount = lead.tax_amount;
            total_amount = lead.total_amount;

        } else {
            let premium_data = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.premium_data : [];
            let selectedIndexSumAssured = groupHealthPlanData.selectedIndexSumAssured || 0;

            this.setState({
                premium_data: premium_data
            })

            leftTitle = groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected.plan_title : '';
            if(selectedIndexSumAssured && premium_data){
            leftSubtitle = premium_data[selectedIndexSumAssured] ? premium_data[selectedIndexSumAssured].premium : '';
            }

        }

        let bottomButtonData = {
            leftTitle: leftTitle,
            leftSubtitle: inrFormatDecimal(leftSubtitle),
            leftSubtitleUnformatted: leftSubtitle,
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
                { 'name': 'GST', 'value': inrFormatDecimal(tax_amount) }
            ],
            content2: [
                { 'name': 'Total', 'value': inrFormatDecimal(total_amount) }
            ],
            sum_assured: sum_assured,
            tenure: tenure
        }

        if(provider === 'RELIGARE' && lead.add_ons_amount) {

            confirmDialogData.content1 = [
                {
                    'name': 'Basic premium ', 'value':
                        inrFormatDecimal(base_premium)
                }
            ]

            let add_ons_backend = lead.add_ons_json;
            let data = [];
            let heading_added = false;
            for (var key in add_ons_backend) {
                data.push({
                    name: add_ons_backend[key].title,
                    value: inrFormatDecimal(add_ons_backend[key].premium),
                    heading: !heading_added ? 'Add ons' : ''
                })

                heading_added = true;
            }

            confirmDialogData.content1 = confirmDialogData.content1.concat(data);

            confirmDialogData.content1.push({
                'name': 'GST', 'value': inrFormatDecimal(tax_amount) 
            })
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
    if(this.state.premium_data || this.state.add_ons_data){
        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                leftSubtitle: inrFormatDecimal(premium || this.state.premium_data[this.state.selectedIndex].premium || '')
            }
        })    
    }
}

export function updateBottomPremiumAddOns(premium) {
    if(this.state.add_ons_data){
        this.setState({
            bottomButtonData: {
                ...this.state.bottomButtonData,
                leftSubtitle: inrFormatDecimal(premium ||'')
            }
        })    
    }
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
                console.log('if');
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
                    this.sendEvents('next', {bmi_check: true});
                });
            } else {
                toast(
                    resultData.error ||
                    resultData.message ||
                    'Something went wrong'
                );
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

    this.sendEvents('next', {more_info: type});

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
    };
    let provider = this.state.provider;

    if(provider === 'HDFCERGO') {
        data = {
            ...data,
            'header_title': 'Free medical check-up',
            'content': 'Based on your details, a medical checkup will be required to issue the policy. HDFC ERGO team will contact you for the <b>free medical checkup</b> after the policy payment.', //ppc
            
        }
    
        if(type === 'ped') {
            data.content = 'Your details will be reviewed by the HDFC Ergo team before policy issuance. You may be contacted for a <b>free medical checkup</b> after the policy payment.'
        }
    }

    if(provider === 'RELIGARE') {
        data = {
            ...data,
            'header_title': 'Medical Review',
            'content': 'Please note that basis your health declaration, Care Health team may contact you for a medical review before policy issuance', //ped only
        }
    }

    if(provider === 'STAR') {
        data = {
            ...data,
            'header_title': 'Medical Review',
            'content': 'Please note that basis your health declaration, Star’s team may contact you for a medical review before policy issuance', //ped only
        }
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
    const final_dob_list = memberKeyMapperFunction(this.state.groupHealthPlanData);
    return final_dob_list.filter(data => data.key === member_key)[0];
}