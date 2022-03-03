import { handleIframeInvest } from "../../../dashboard/proceedInvestmentFunctions";
import { getBasePath, getConfig } from "../../../utils/functions";
import { storageService } from "../../../utils/validators";
import { DIY_PATHNAME_MAPPER } from "./constants";
/* eslint-disable */
export const validateKycAndRedirect =
  ({ navigate, kyc }) =>
  () => {
    if (kyc.kyc_allow_investment_status === "INVESTMENT_ALLOWED") {
      navigate(DIY_PATHNAME_MAPPER.mfOrders);
    } else {
      navigate(DIY_PATHNAME_MAPPER.completeKyc);
    }
  };

export const handlePaymentRedirection =
  ({ navigate, handleApiRunning, kyc }) =>
  (result) => {
    const config = getConfig();
    const partnerCode = config.code;
    if (partnerCode) {
      storageService().set("partner", partnerCode)
    }
    const investmentData = result?.investments[0] || {};
    const paymentRedirectUrl = encodeURIComponent(
      `${getBasePath()}/page/callback/${investmentData.order_type}/${
        investmentData.amount
      }${config.searchParams}`
    );
    let investmentEventData =
      storageService().getObject("mf_invest_data") || {};
    let pgLink = investmentData.pg_link;
    pgLink = `${pgLink}${
      pgLink.match(/[\?]/g) ? "&" : "?"
    }redirect_url=${paymentRedirectUrl}${
      partnerCode ? "&partner_code=" + partnerCode : ""
    }`;
    investmentEventData["payment_id"] = investmentData.id;
    storageService().setObject("mf_invest_data", investmentEventData);
    if (config.Web) {
      if (config.isIframe) {
        handleIframeInvest(pgLink, result, navigate, handleApiRunning);
      } else {
        handleApiRunning("page");
        window.location.href = pgLink;
      }
    } else {
      if (result.rta_enabled) {
        navigate("/payment/options", {
          state: {
            pg_options: result.pg_options,
            consent_bank: result.consent_bank,
            investment_type: investmentData.order_type,
            remark: investmentData.remark_investment,
            investment_amount: investmentData.amount,
            redirect_url: paymentRedirectUrl,
          },
        });
      } else {
        navigate("/kyc/journey", {
          state: {
            show_aadhaar: !(
              kyc.address.meta_data.nri || kyc.kyc_type === "manual"
            ),
          },
        });
      }
    }
  };

export const getDiyDataAid = (string = "") => {
  return string?.charAt(0)?.toLowerCase() + string?.slice(1)?.split("_")?.join("");
}