import Api from "../../utils/api";

export const updateEtfConsentStatus = async (consent) => {
  try {
    const res = await Api.post(`/api/equity/api/eqm/etf/user/consent/update?consent=${consent}`);
    return Api.handleApiResponse(res);
  } catch(e) {
    throw e;
  }
}