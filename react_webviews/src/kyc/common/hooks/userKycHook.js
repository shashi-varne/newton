import { useState, useEffect } from 'react'
import { storageConstants, } from "../../constants";
import { initData } from "../../services";
import { isEmpty, storageService, } from "../../../utils/validators";

function useUserKycHook() {
    const [kyc, setUserKyc] = useState(
        storageService().getObject(storageConstants.KYC) || {}
    );
    const [user, setUser] = useState(
        storageService().getObject(storageConstants.USER) || {}
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
            kycDetails = storageService().getObject(storageConstants.KYC);
            userDetails = storageService().getObject(storageConstants.USER);
            setIsLoading(false);
            setUser(userDetails);
            setUserKyc(kycDetails);
        };
        if (isEmpty(user) || isEmpty(kyc)) {
            init();
        }
    }, []);

    const setKycToSession = (kycData) => {
        storageService().setObject("kyc", kycData);
    };

    return { kyc, user, isLoading, setKycToSession};
}

export default useUserKycHook
