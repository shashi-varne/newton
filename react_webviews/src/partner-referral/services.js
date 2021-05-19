import Api from "utils/api";
import toast from "../common/ui/Toast";

export async function verifyReferralCode(partnerIndex, referralCode) {
  let error = "";
  const url = `/api/referral/${partnerIndex}/validate?referral=${referralCode}`;
  const response = await Api.get(url);
  let resultData = response.pfwresponse.result;
  try {
    if (response.pfwresponse.status_code === 200) {
      const url = `https://play.google.com/store/apps/details?id=com.finwizard.fisdom&referrer=utm_source=%7B%22referrer%22%3A%22${referralCode}%22%2C%22campaign_name%22%3A%22%22%2C%22product_name%22%3A%22%22%2C%22agency_name%22%3A%22%22%7D`;
      return url;
    } else {
      error = resultData.error || resultData.message || "Something went wrong";
      throw error;
    }
  } catch (err) {
    toast(err || "Something went wrong!");
  }
}
