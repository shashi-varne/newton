// import { storageService } from "utils/validators";
import { getConfig } from 'utils/functions';
// import Api from 'utils/api';
// import toast from '../../common/ui/Toast';
import { openPdfCall } from 'utils/native_callback';
import { nativeCallback } from 'utils/native_callback';
import { idfc_config } from '../constants';
import { getOrCreate, updateApplication } from "./ApiCalls";
import { validatePan, isValidDate } from "utils/validators";

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openPdf = openPdf.bind(this);
    this.openInBrowser = openInBrowser.bind(this);
    this.openInTabApp = openInTabApp.bind(this);
    this.formCheckUpdate = formCheckUpdate.bind(this);
    
    let screenData = {};
    if(this.state.screen_name) {
        screenData = idfc_config[this.state.screen_name]
    }

    let next_screen = this.state.next_screen || '';
    if (this.state.screen_name && idfc_config.get_next[this.state.screen_name]) {
        next_screen = idfc_config.get_next[this.state.screen_name];
        this.setState({
            next_state: next_screen
        })
    }

    nativeCallback({ action: 'take_control_reset' });

    this.setState({
        screenData: screenData,
        productName: getConfig().productName,
    }, () => {
        this.onload();
    })

    this.setState({
        show_loader: true
    })

    const result = await getOrCreate();
    
    if (result) {
        this.setState({
            mobile_no: result.personal_info.mobile_no || "",
            productName: getConfig().productName,
            screenData: screenData,
            show_loader: false
        }, () => {
            this.onload();
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

export async function formCheckUpdate(keys_to_check, form_data) {
    if (!form_data) {
        form_data = this.state.form_data;
    }

    let canSubmitForm = true;

    let keysMapper = {
        'dob': 'dob',
        'pan_no': 'pan number',
        'employment_type': 'employment type',
        'education_qualification': 'education qualification'
    }

    let selectTypeInput = ['education_qualification'];

    for (var i=0; i< keys_to_check.length; i++) {
        let key_check = keys_to_check[i];
        let first_error =  selectTypeInput.indexOf(key_check) !== -1 ? 'Please select ' : 'Please enter ';
        if (!form_data[key_check]) {
            form_data[key_check + '_error'] = first_error + keysMapper[key_check];
            canSubmitForm = false;
        }
    }

    if (form_data.pan_no && !validatePan(form_data.pan_no)) {
        form_data.pan_no_error = 'Invalid PAN number';
        canSubmitForm = false;
      }
  
    if (form_data.dob && !isValidDate(form_data.dob)) {
      form_data.dob_error = 'Invalid dob';
      canSubmitForm = false;
    }    

    this.setState({
        form_data: form_data
    })

    if (canSubmitForm) {
        let body = {};
        this.setState({
            show_loader: true
        })

        for (var j in keys_to_check) {
            let key = keys_to_check[j];
            body[key] = form_data[key] || '';
        }

        const result = await updateApplication(body);
        if (result) {
            this.navigate(this.state.next_state);
        }
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