import Api from '../../utils/api';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
// import { storageService } from '../../utils/validators';

export const getUserStatus = async () => {
    try {
        const res = await Api.get('relay/api/loan/user/status/idfc');

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
            return result;
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }
    } catch (e) {
        throw e;
    }
};

export const getOrCreate = async (params) => {

    let payload = {
        "create_new": (params && params.create_new) || false,
        "reset_application": (params && params.reset) || false,
        "application_info": true,
        "personal_info": true,
        "address_info": true,
        "bank_info": true,
        "document_info": true,
        "vendor_info": true,
        "bt_info": true
    }
    try {
        const res = await Api.post('relay/api/loan/get/application/idfc', payload);

        const { result, status_code: status } = res.pfwresponse;
        
        if (status === 200) {
            let application_id = result.application_id || "";
            storageService().set('loan_application_id', application_id);
            
            return result;
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }

    } catch (e) {
        throw e;
    }
}

export const updateApplication = async (params) => {
    let application_id = storageService().get('loan_application_id') || "";

    try {
        const res = await Api.post(`relay/api/loan/update/application/idfc/${application_id}`, params);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
            return result
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }
    } catch (e) {
        throw e;
    }
}

export const verifyOtp = async (url, params) => {

    try {
        const res = await Api.post(url, params);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
            return result
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }
    } catch (e) {
        throw e
    }
}

export const retriggerOtp = async (url) => {
    try {
        const res = await Api.get(url);

        const { result, status_code: status } = res.pfwresponse;

        if (status === 200) {
            return result
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }
    } catch (e) {
        throw e
    }
}