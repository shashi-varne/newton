import {
    storageService, getEditTitle, dobFormatTest,
    inrFormatTest
} from 'utils/validators';
import { getConfig, getBasePath } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openPdf = openPdf.bind(this);
    this.setEditTitle = setEditTitle.bind(this);
    this.updateLead = updateLead.bind(this);
    this.formCheckUpdate = formCheckUpdate.bind(this);
    this.formHandleChange = formHandleChange.bind(this);
    this.callBackApi = callBackApi.bind(this);
    this.decisionCallback = decisionCallback.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.openInTabApp = openInTabApp.bind(this);
    this.acceptAgreement = acceptAgreement.bind(this);
    this.redirectMandate = redirectMandate.bind(this);

    nativeCallback({ action: 'take_control_reset' });

    this.setState({
        productName: getConfig().productName,
    }, () => {
        if (!this.state.get_lead) {
            this.onload();
        }
    })


    let lead = {
        member_base: []
    };

    if (this.state.get_lead) {
        try {

            this.setState({
                show_loader: true
            });

            let body = {
                "vendor_name": "DMI",
                "application_info": "True",
            };

            if (this.state.fetch_all) {
                body = {
                    "vendor_name": "DMI",
                    "application_info": "True",
                    "personal_info": "True",
                    "professional_info": "True",
                    "address_info": "True",
                    "bank_info": "True",
                    "document_info": "True",
                    "vendor_info": "True"
                };
            }

            for (var key in this.state.getLeadBodyKeys) {
                body[this.state.getLeadBodyKeys[key]] = "True";
            }
            const res = await Api.post('/relay/api/loan/get/application/dmi', body);

            var resultData = res.pfwresponse.result;

            this.setState({
                show_loader: false
            });
            if (res.pfwresponse.status_code === 200) {

                lead = resultData || {};
                let application_id = (lead.application_info || {}).application_id;
                storageService().set('loan_application_id', application_id)
                this.setState({
                    lead: lead || {},
                    application_id: application_id
                }, () => {
                    if (this.onload && !this.state.ctaWithProvider) {
                        this.onload();
                    }
                })
            } else {
                toast(resultData.error || resultData.message
                    || 'Something went wrong');
                this.onload();
            }
        } catch (err) {
            console.log(err)
            this.setState({
                show_loader: false,
                lead: lead,
                common_data: {}
            }, () => {
                this.onload();
            });
            toast('Something went wrong');
        }
    } else {
        let application_id = storageService().get('loan_application_id');
        this.setState({
            application_id: application_id
        })
    }
}


export function openInBrowser(url) {
    nativeCallback({
        action: 'open_in_browser',
        message: {
            url: url
        }
    });
}

export function openInTabApp(data = {}) {
    nativeCallback({
        action: 'open_inapp_tab',
        message: {
            url: data.url || '',
            back_url: data.back_url || ''
        }
    });
}

export async function updateLead(body, application_id) {
    try {

        if (!application_id) {

            application_id = this.state.application_id || storageService().get('loan_application_id');
        }

        this.setState({
            show_loader: true
        });

        const res = await Api.post('/relay/api/loan/update/application/dmi/' + application_id,
            body);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            if (this.props.edit && !this.state.force_forward) {
                this.props.history.goBack();
            } else {
                this.navigate(this.state.next_state);
            }

        } else {
            this.setState({
                show_loader: false
            });

            if (resultData.invalid_fields && resultData.invalid_fields.length > 0 && resultData.error &&
                resultData.error.length > 0) {
                let form_data = this.state.form_data;

                if (this.state.screen_name === 'address-details') {
                    for (var j in resultData.invalid_fields) {
                        toast(resultData.error[j]);
                        break;
                    }
                } else {
                    for (var i in resultData.invalid_fields) {
                        form_data[resultData.invalid_fields[i] + '_error'] = resultData.error[i];
                    }
                }

                this.setState({
                    form_data: form_data
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


export async function acceptAgreement() {
    try {

        let res = await Api.get(`/relay/api/loan/dmi/agreement/accept/${this.state.application_id}`);

        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200 && !resultData.error) {
            this.navigate(this.state.next_state || '/loan/dmi/loan-know-more');

        } else {

            this.setState({
                show_loader: false
            });
            toast(resultData.error || resultData.message
                || 'Something went wrong');
            this.props.history.goBack();
        }
    } catch (err) {
        console.log(err)
        this.setState({
            show_loader: false
        });
        toast('Something went wrong');
    }
}
export async function callBackApi(body) {
    try {


        let res = await Api.post(`/relay/api/loan/dmi/callback/get/status/${this.state.application_id}`, body);
        var resultData = res.pfwresponse.result;

        this.setState({
            show_loader: false
        });
        if (res.pfwresponse.status_code === 200 && !resultData.error) {
            return resultData;
        } else {
            toast(resultData.error || resultData.message
                || 'Something went wrong');
            return {};
        }

    } catch (err) {
        console.log(err)
        this.setState({
            show_loader: false
        });
        toast('Something went wrong');
        return {};
    }

}

export function openPdf(url, type) {

    if (!url) {
        return;
    }
    this.sendEvents('tnc_clicked');
    if (!getConfig().Web) {
        this.setState({
            show_loader: true
        })
    }

    let mapper = {
        'tnc': {
            header_title: 'Terms & Conditions',
        },
        'read_document': {
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
            search: data.searchParams || getConfig().searchParams,
            params: data.params || {}
        });
    }

}

export function setEditTitle(string) {

    if (this.props.edit) {
        return getEditTitle(string);
    }

    return string;
}


export function formCheckUpdate(keys_to_check, form_data, just_check) {

    if (!form_data) {
        form_data = this.state.form_data;
    }

    let keysMapper = {
        'purpose': 'purpose',
        'tenor': 'loan period',
        'amount_required': 'loan amount',
        'employment_type': 'employment type',
        'net_monthly_salary': 'net monthly salary',
        'work_experience': 'work experience',

        'pan_no': 'pan number',
        'first_name': 'first name',
        'last_name': 'last name',
        'father_name': 'father name',
        'dob': 'dob',
        'gender': 'gender',
        'marital_status': 'marital status',

        'email_id': 'email',
        'mobile_no': 'mobile number',

        'company_name': 'company name',
        'duration': 'duration',
        'office_address': 'office address',
        'office_pincode': 'office pincode',
        'office_email': 'office email',
        'educational_qualification': 'educational qualification',

        'residence_type': 'residence type',
        'address': 'address',
        'pincode': 'pincode',
        'city': 'city',
        'state': 'state',
        'country': 'country',
        'p_address': 'address',
        'p_pincode': 'pincode',
        'p_city': 'city',
        'p_state': 'state',
        'p_country': 'country',

        'ref_name_first': '1st reference name',
        'ref_contact_first': '1st reference contact',
        'ref_name_second': '2nd reference name',
        'ref_contact_second': '2nd reference contact',
    }


    let selectTypeInput = ['purpose', 'employment_type', 'gender', 'marital_status',
        'educational_qualification', 'residence_type'];

    for (var i = 0; i < keys_to_check.length; i++) {
        let key_check = keys_to_check[i];
        let first_error = selectTypeInput.indexOf(key_check) !== -1 ? 'Please select ' : 'Please enter ';
        if (!form_data[key_check]) {
            form_data[key_check + '_error'] = first_error + keysMapper[key_check];
        }
    }

    let validations = {
        'net_monthly_salary': {
            value_to_check: 25000,
            error_message: 'Minimum monthly salary of Rs 25,000 needed'
        },
        'work_experience': {
            value_to_check: 1,
            error_message: 'Minimum work experience of 1 yr needed'
        },
        'duration': {
            value_to_check: 6,
            error_message: 'No. of months in current job must be greater than 6 months'
        }
    }

    let canSubmitForm = true;
    for (var key in form_data) {
        if (Object.keys(validations).includes(key) && form_data[key]) {
            let value = form_data[key];
            let screen_name = this.state.screen_name;

            if (value < validations[key].value_to_check) {
                form_data[key + '_error'] = screen_name === 'address-details' && key === 'duration' ?
                 'No. of months in residence must be greater than 6 months' 
                    : validations[key].error_message;

                canSubmitForm = false;
                break;
            }
        }

        if (key.indexOf('error') >= 0) {
            if (form_data[key]) {
                canSubmitForm = false;
                break;
            }
        }
    }

    this.setState({
        form_data: form_data
    })

    if (canSubmitForm && !just_check) {
        let body = {};

        if (this.state.screen_name === 'address-details') {

            let checked = this.state.checked;
           
            body = {

                current_residence_type: form_data.residence_type || '',
                current_duration: form_data.duration || '',
                current_address: form_data.address || '',
                current_pincode: form_data.pincode || '',
                current_city: form_data.city || '',
                current_state: form_data.state || '',
                current_country: form_data.country || '',

                permanent_address: checked ? form_data.address : form_data.p_address,
                permanent_pincode: checked ? form_data.pincode : form_data.p_pincode ,
                permanent_city: checked ? form_data.city : form_data.p_city ,
                permanent_state:  checked ? form_data.state : form_data.p_state,
                permanent_country: checked ? form_data.country : form_data.p_country ,

                // permanent_address_same_as_current: this.state.checked || false
            };
        } else {
            for (var j in keys_to_check) {
                let key = keys_to_check[j];
                body[key] = form_data[key] || '';
            }
        }

        this.updateLead(body);
    } else {
        return canSubmitForm
    }
}


export function formHandleChange(name, event) {
    if (!name) {
        name = event.target.name;
    }


    var value = event.target ? event.target.value : event;

    if (name === 'dob' && !dobFormatTest(value)) {
        return;
    }

    if (name === 'pan_no' && value) {
        value = value.toUpperCase();
    }
    var form_data = this.state.form_data || {};

    if ((name === 'amount_required' || name === 'net_monthly_salary') &&
        !inrFormatTest(value)) {
        return;
    }

    if (['ref_contact_first', 'ref_contact_second', 'mobile_no'].indexOf(name) !== -1 && value.length > 10) {
        return;
    }

    form_data[name] = typeof value === 'string' ? value.replace(/,/g, "") : value;
    form_data[name + '_error'] = '';

    this.setState({
        form_data: form_data
    })
}

export async function redirectMandate() {

    this.setState({
        show_loader: true
    })
    const res = await Api.get(`/relay/api/loan/eMandate/application/${this.state.application_id}`);

    let resultData = res.pfwresponse.result;
    if (res.pfwresponse.status_code === 200 && !resultData.error) {
        let basepath = getBasePath();
        let paymentRedirectUrl = encodeURIComponent(
            basepath + `/loan/dmi/redirection-status/mandate` + getConfig().searchParams
        );


        let back_url = encodeURIComponent(
            basepath + `/loan/dmi/mandate-status` + getConfig().searchParams
        );

        // for web no issue
        if (getConfig().Web) {
            paymentRedirectUrl = back_url;
        }

        var payment_link = resultData.url;
        var pgLink = payment_link;
        let app = getConfig().app;
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
            '&app=' + app + '&back_url=' + back_url + '&generic_callback=' + getConfig().generic_callback;

        this.openInTabApp(
            {
                url: pgLink,
                back_url: back_url
            }
        );

        // if (!getConfig().Web) {
        //     this.setState({
        //         show_loader: false
        //     });
        // }


    } else {
        this.setState({
            show_loader: false
        });

        toast(resultData.error || resultData.message
            || 'Something went wrong');
    }
}

export async function decisionCallback() {

    let isKyc = this.state.screen_name === 'instant-kyc';

    if (!isKyc) {
        this.setState({
            show_loader: true
        })
    }

    let body = {
        "request_type": "decision"
    }

    let resultData = await this.callBackApi(body);

    let totalEligiRounds = this.state.totalEligiRounds;
    let currentEligiRounds = this.state.currentEligiRounds;

    this.setState({
        currentEligiRounds: currentEligiRounds + 1
    })

    if (resultData.callback_status) {
        // no change required
        if (resultData.eligible) {
            this.navigate('loan-eligible');
            // loan approved
        } else {
            // loan not approved
            let searchParams = getConfig().searchParams + '&status=loan_not_eligible';
            this.navigate('instant-kyc-status', { searchParams: searchParams });
        }
    } else {
        // sorry

        if (isKyc) {
            if (totalEligiRounds === currentEligiRounds) {
                let searchParams = getConfig().searchParams + '&status=eligible_sorry';
                this.navigate('instant-kyc-status', { searchParams: searchParams });
            } else {
                this.startEligiCheck();
            }
        } else {
            let searchParams = getConfig().searchParams + '&status=eligible_sorry';
            this.navigate('instant-kyc-status', { searchParams: searchParams });
        }

    }

}