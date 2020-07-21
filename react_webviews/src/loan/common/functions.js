import { storageService, getEditTitle } from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import {  openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.setEditTitle = setEditTitle.bind(this);

    nativeCallback({ action: 'take_control_reset' });
    
    this.setState({
        productName: getConfig().productName,
    }, () => {
        this.onload();
    })

    


    // let lead = {
    //     member_base: []
    // };

    // if (this.state.get_lead) {
    //     try {

    //         this.setState({
    //             show_loader: true
    //         });

    //         let quote_id = storageService().get('ghs_ergo_quote_id');

    //         const res = await Api.get('/api/ins_service/api/insurance/hdfcergo/lead/quote?quote_id=' + quote_id);

    //         var resultData = res.pfwresponse.result;

    //         this.setState({
    //             show_loader: false
    //         });
    //         if (res.pfwresponse.status_code === 200) {

    //             lead = resultData.quote;
    //             lead.member_base = ghGetMember(lead);
    //             this.setState({
    //                 lead: resultData.quote || {},
    //                 common_data: resultData.common,
    //                 insured_account_type: lead.account_type || ''
    //             }, () => {
    //                 if (this.onload && !this.state.ctaWithProvider) {
    //                     this.onload();
    //                 }

    //             })
    //         } else {
    //             toast(resultData.error || resultData.message
    //                 || 'Something went wrong');
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         this.setState({
    //             show_loader: false,
    //             lead: lead,
    //             common_data: {}
    //         });
    //         toast('Something went wrong');
    //     }
    // }
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

export function openInBrowser(url, type) {

    if(!url) {
        return;
    }
    this.sendEvents('tnc_clicked');
    if (!getConfig().Web) {
        this.setState({
            show_loader: true
        })
    }

    let mapper = {
        'tnc' : {
            header_title: 'Terms & Conditions',
        },
        'read_document' : {
            header_title: 'Read Detailed Document',
        }
    }

    let mapper_data = mapper[type];

    let data = {
        url: url,
        header_title: mapper_data.header_title,
        icon: 'close'
    };

    openPdfCall(data);
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

export function setEditTitle(string) {

    if(this.props.edit) {
        return getEditTitle(string);
    }

    return string;
}
