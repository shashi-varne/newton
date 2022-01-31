import { useState, useEffect } from 'react'
import { STORAGE_CONSTANTS, } from "../../constants";
import { initData } from "../../services";
import { isEmpty, storageService, } from "../../../utils/validators";
import Toast from '../../../common/ui/Toast';

function useUserKycHook() {
    const [kyc, setUserKyc] = useState(
        storageService().getObject(STORAGE_CONSTANTS.KYC) || {}
    );
    const [user, setUser] = useState(
        storageService().getObject(STORAGE_CONSTANTS.USER) || {}
    );
    const [isLoading, setIsLoading] = useState(function () {
        if (isEmpty(user) || isEmpty(kyc)) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        const init = async () => {
            try {
                await initData();
                const kycDetails = storageService().getObject(STORAGE_CONSTANTS.KYC);
                const userDetails = storageService().getObject(STORAGE_CONSTANTS.USER);
                setIsLoading(false);
                setUser(userDetails);
                setUserKyc(kycDetails);
            } catch(err) {
                Toast(err.message);
            }
        };
        if (isEmpty(user) || isEmpty(kyc)) {
            init();
        }
    }, []);

    const updateKyc = (kycData) => {
        if (kycData) {
            storageService().setObject("kyc", kycData);
            setUserKyc(kycData);
        }
    };

    return {kyc, user, isLoading, updateKyc};
}

export default useUserKycHook
