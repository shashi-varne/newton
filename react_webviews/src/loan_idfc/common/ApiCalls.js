import Api from '../../utils/api';
import toast from '../../common/ui/Toast';
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

    let body = {
        "create_new": params.create_new || false,
        "reset_application": params.reset || false,
        "application_info": true,
        "personal_info": true,
        "address_info": true,
        "bank_info": true,
        "document_info": true,
        "vendor_info": true,
        "bt_info": true
    }
    try {
        const res = await Api.post('relay/api/loan/get/application/idfc', body);

        const { result, status_code: status } = res.pfwresponse;
        
        if (status === 200) {
            return result;
        } else {
            toast(result.error || result.message || 'Something went wrong!');
        }

    } catch (e) {
        throw e;
    }
}