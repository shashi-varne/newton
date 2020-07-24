import { storageService, getEditTitle, inrFormatTest } from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.setEditTitle = setEditTitle.bind(this);
    this.updateLead = updateLead.bind(this);
    this.formCheckUpdate = formCheckUpdate.bind(this);
    this.formHandleChange = formHandleChange.bind(this);
    this.callBackApi = callBackApi.bind(this);

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

            if(this.state.fetch_all) {
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
            const res = await Api.post('/relay/api/loan/get/application', body);

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


export async function updateLead(body, application_id) {
    try {

        if (!application_id) {

            if (this.state.lead.application_info &&
                this.state.lead.application_info.application_id) {
                application_id = this.state.lead.application_info.application_id;
            } else {
                application_id = storageService().get('loan_application_id');
            }
        }

        this.setState({
            show_loader: true
        });

        const res = await Api.post('/relay/api/loan/update/application/' + application_id,
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
            console.log(resultData)
            if (resultData.invalid_fields && resultData.invalid_fields.length > 0 && resultData.error &&
                resultData.error.length > 0) {
                let form_data = this.state.form_data;

                for (var i in resultData.invalid_fields) {
                    form_data[resultData.invalid_fields[i] + '_error'] = resultData.error[i];
                }

                console.log(form_data);
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

export function openInBrowser(url, type) {

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
            params: {
                forceClose: this.state.forceClose || false
            }
        });
    }

}

export function setEditTitle(string) {

    if (this.props.edit) {
        return getEditTitle(string);
    }

    return string;
}


export function formCheckUpdate(keys_to_check, form_data) {

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

    let canSubmitForm = true;
    for (var key in form_data) {
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


    if (canSubmitForm) {
        let body = {};

        if(this.state.screen_name === 'address-details') {
            body = {

                current_residence_type: form_data.residence_type || '',
                current_duration: form_data.duration || '',
                current_address: form_data.address || '',
                current_pincode: form_data.pincode || '',
                current_city: form_data.city || '',
                current_state: form_data.state || '',
                current_country: form_data.country || '',
    
                permanent_address: form_data.p_address || '',
                permanent_pincode: form_data.p_pincode || '',
                permanent_city: form_data.p_city || '',
                permanent_state: form_data.p_state || '',
                permanent_country: form_data.p_country || '',
            };
        } else {
            for (var j in keys_to_check) {
                let key = keys_to_check[j];
                body[key] = form_data[key] || '';
            }
        }
       
        this.updateLead(body);
    }
}


export function formHandleChange(name, event) {
    if (!name) {
        name = event.target.name;
    }
    var value = event.target ? event.target.value : event;
    var form_data = this.state.form_data || {};

    if ((name === 'amount_required' || name === 'net_monthly_salary') &&
        !inrFormatTest(value)) {
        return;
    }

    if (name === 'mobile_no' && value.length > 10) {
        return;
    }

    form_data[name] = value.replace(/,/g, "");
    form_data[name + '_error'] = '';

    this.setState({
        form_data: form_data
    })
}