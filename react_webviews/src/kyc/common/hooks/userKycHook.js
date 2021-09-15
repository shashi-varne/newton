import { useState, useEffect } from 'react'
import { STORAGE_CONSTANTS, } from "../../constants";
import { initData } from "../../services";
import { isEmpty, storageService, } from "../../../utils/validators";

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

    let kycDetails = {}, userDetails = {};

    useEffect(() => {
        const init = async () => {
            await initData();
            kycDetails = storageService().getObject(STORAGE_CONSTANTS.KYC);
            userDetails = storageService().getObject(STORAGE_CONSTANTS.USER);
            setIsLoading(false);
            setUser(userDetails);
            setUserKyc(kycDetails);
        };
        if (isEmpty(user) || isEmpty(kyc)) {
            init();
        }
    }, []);

    const updateKyc = (kycData) => {
        storageService().setObject("kyc", kycData);
        setUserKyc(kycData)
    };

    return {kyc,user, isLoading, updateKyc};
}

export default useUserKycHook
