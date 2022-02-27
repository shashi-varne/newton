import { DIY_PATHNAME_MAPPER } from "./constants";

export const validateKycAndRedirect =
  ({ navigate, kyc }) =>
  () => {
    if (kyc.kyc_allow_investment_status === "INVESTMENT_ALLOWED") {
      navigate(DIY_PATHNAME_MAPPER.mfOrders);
    } else {
      navigate(DIY_PATHNAME_MAPPER.completeKyc);
    }
  };
