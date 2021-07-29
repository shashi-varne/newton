import Api from 'utils/api'
import { isEmpty } from 'utils/validators'
const genericErrorMessage = 'Something Went wrong!'

export const handleApi = (res) => {
    if (
        res.pfwstatus_code !== 200 ||
        !res.pfwresponse ||
        isEmpty(res.pfwresponse)
    ) {
        throw new Error(res?.pfwmessage || genericErrorMessage);
    }
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
        return result;
    } else {
        throw new Error(result.error || result.message || genericErrorMessage);
    }
};


export const verifyGoldOtp = async (body) => {
    let url = body?.verify_link + '?otp=' + body?.otp;
    const res = await Api.post(url);
    return handleApi(res);
}

export const sendGoldOtp = async (body) => {
    const res = await Api.post("/api/gold/contact/trigger/otp", body)
    return handleApi(res);
}

export const resendGoldOtp = async (body) => {
    const res = await Api.get(body)
    return handleApi(res);
}

export const comfirmVerification = async (body) => {
    const res = await Api.get(body)
    return handleApi(res);
}