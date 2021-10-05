import Api from "../../utils/api";

export const updateEtfConsentStatus = async (consent) => {
  try {
    const res = Api.post('/api/equity/etf/user/consent/update', {
      consent
    });
    return Api.handleApiResponse(res);
  } catch(e) {
    throw e;
  }
}