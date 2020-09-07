import { storageService, inrFormatDecimal, getEditTitle } from 'utils/validators';
import { getConfig, 
    // isFeatureEnabled
 } from 'utils/functions';
import { ghGetMember } from '../../constants';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import {  openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';

import {getGhProviderConfig} from './constants';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.setEditTitle = setEditTitle.bind(this);

    let provider = this.props.parent && this.props.parent.props ? this.props.parent.props.match.params.provider : this.props.match.params.provider;
    let providerConfig = getGhProviderConfig('HDFCERGO');

    let screenData = {};
    if(this.state.screen_name && providerConfig[this.state.screen_name]) {
        screenData = providerConfig[this.state.screen_name];
    }

    let next_screen = '';
    if(this.state.screen_name && providerConfig.get_next[this.state.screen_name]) {
        next_screen = providerConfig.get_next[this.state.screen_name];
    }
    

    let groupHealthPlanData = storageService().getObject('groupHealthPlanData') || {};
    this.setState({
        productName: getConfig().productName,
        provider: provider,
        groupHealthPlanData: groupHealthPlanData,
        providerData: providerConfig,
        next_screen: next_screen,
        providerConfig: providerConfig,
        plan_selected: groupHealthPlanData && groupHealthPlanData.plan_selected ? groupHealthPlanData.plan_selected : {},
        insured_account_type: groupHealthPlanData.account_type || '',
        screenData: screenData
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

            const res = await Api.get('/api/ins_service/api/insurance/hdfcergo/lead/quote?quote_id=' + quote_id);

            var resultData = res.pfwresponse.result;

            this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {

                lead = resultData.quote;
                lead.member_base = ghGetMember(lead);
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

        const res = await Api.post('/api/ins_service/api/insurance/hdfcergo/lead/update?quote_id=' + quote_id,
            body);

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
        const res = await Api.get(`/api/ins_service/api/insurance/hdfcergo/lead/cancel/` + quote_id);

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