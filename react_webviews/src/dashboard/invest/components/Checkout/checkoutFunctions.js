import toast from "../../../../common/ui/Toast";
import Api from "../../../../utils/api";
import { getBasePath } from "../../../../utils/functions";
import { formatAmountInr, storageService } from "../../../../utils/validators";
import { apiConstants } from "../../constants";
import {
  proceedInvestmentChild,
  isInvestRefferalRequired,
} from "../../../proceedInvestmentFunctions";
import { navigate } from "../../functions";

const errorMessage = "Something went wrong!";
export async function initializeComponentFunctions() {
  this.navigate = navigate.bind(this);
  this.deleteFund = deleteFund.bind(this);
  this.checkLimit = checkLimit.bind(this);
  this.proceedInvestment = proceedInvestment.bind(this);
  this.proceedInvestmentChild = proceedInvestmentChild.bind(this);
  this.getDiyPurchaseLimit = getDiyPurchaseLimit.bind(this);
  let userKyc = storageService().getObject("kyc") || {};
  let currentUser = storageService().getObject("user") || {};
  this.setState({
    userKyc: userKyc,
    currentUser: currentUser,
  });
  if (this.onload) this.onload();
}

export const deleteFund = (item, index) => {
  let { fundsData, cartCount } = this.state;
  let fundName = item.legalName || item.legal_name;
  fundsData.splice(index, 1);
  cartCount = fundsData.length;
  this.setState({
    fundName: fundName,
    fundsData: fundsData,
    cartCount: cartCount,
  });
  storageService().setObject("diystore_cart", fundsData);
  storageService().set("diystore_cartCount", fundsData.length);
};

export async function getNfoPurchaseLimit(data) {
  this.setState({ show_loader: true });
  try {
    const res = await Api.get(
      `${apiConstants.getPurchaseLimit}${data.investType}?type=isin&isins=${data.isins}`
    );

    const { result, status_code: status } = res.pfwresponse;
    let { fundsData, purchaseLimitData } = this.state;
    if (status === 200) {
      purchaseLimitData[data.investType] = result.funds_data;
      let disableInputSummary = true;
      if (purchaseLimitData[data.investType][0].ot_sip_flag) {
        fundsData[0].allow_purchase = true;
        disableInputSummary = false;
      }
      this.setState({
        show_loader: false,
        fundsData: fundsData,
        purchaseLimitData: purchaseLimitData,
        disableInputSummary: disableInputSummary,
      });
    } else {
      this.setState({ show_loader: false });
      toast(result.error || result.message || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export async function getDiyPurchaseLimit(data) {
  this.setState({ show_loader: true });
  try {
    const res = await Api.get(
      `${apiConstants.getPurchaseLimit}${data.investType}?type=isin&isins=${data.isins}`
    );
    const { result, status_code: status } = res.pfwresponse;
    let { fundsData, purchaseLimitData } = this.state;
    if (status === 200) {
      purchaseLimitData[data.investType] = result.funds_data;
      purchaseLimitData[data.investType] = purchaseLimitData[
        data.investType
      ].map((dict) => {
        var results = fundsData.filter((obj) => {
          if (obj.isin === dict["isin"]) {
            obj["allow_purchase"] = dict["ot_sip_flag"];
          }
          return obj;
        });
        dict["addedToCart"] = false;
        dict["allow_purchase"] = true;
        if (results.length === 0) {
          dict["addedToCart"] = false;
        }
        return dict;
      });

      this.setState({
        show_loader: false,
        fundsData: fundsData,
        purchaseLimitData: purchaseLimitData,
      });
    } else {
      this.setState({ show_loader: false });
      toast(result.error || result.message || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export function checkLimit(amount, index) {
  let {
    purchaseLimitData,
    form_data,
    disableInputSummary,
    disableInput,
    fundsData,
    investType,
  } = this.state;
  let limitData = purchaseLimitData[investType].find(
    (data) => data.isin === fundsData[index].isin
  );
  if (!limitData) return;
  if (!limitData.ot_sip_flag || !limitData.addl_purchase) return;
  let min = limitData.addl_purchase.min;
  let max = limitData.addl_purchase.max;
  let mul = limitData.addl_purchase.mul;

  if (amount < min) {
    form_data[index].amount_error =
      "Please add atleast " + formatAmountInr(min) + " to proceed.";
    disableInput[index] = 1;
  } else if (amount % mul !== 0) {
    form_data[index].amount_error =
      "Amount must be multiple of " + formatAmountInr(mul);
    disableInput[index] = 1;
  } else if (amount > max) {
    disableInput[index] = 1;
    form_data[index].amount_error =
      "Maximum amount for this fund is " + formatAmountInr(max);
  } else {
    disableInput[index] = 0;
    form_data[index].amount_error = "";
  }

  let value = disableInput.reduce((total, num) => {
    return total + num;
  });

  if (value === 0) disableInputSummary = false;
  else disableInputSummary = true;

  this.setState({
    disableInputSummary: disableInputSummary,
    form_data: form_data,
  });
}

export async function proceedInvestment(investReferralData, isReferralGiven) {
  let {
    partner_code,
    fundsData,
    purchaseLimitData,
    investType,
    totalAmount,
    currentUser,
    userKyc,
    isSipDatesScreen,
    type,
  } = this.state;
  if (isInvestRefferalRequired(partner_code) && !isReferralGiven) {
    this.handleDialogStates("openInvestReferral", true);
    return;
  }

  let allocations = [];
  fundsData
    .filter((data) => data.allow_purchase)
    .forEach((fund) => {
      let limitData = purchaseLimitData[investType].find(
        (element) => element.isin === fund.isin
      );
      if (!limitData) return;
      let allocation = {
        mfid: limitData.mfid,
        mfname: limitData.mfname,
        amount: fund.amount,
        default_date: limitData.addl_purchase.default_date,
        sip_dates: limitData.addl_purchase.sip_dates,
      };
      allocations.push(allocation);
    });
  let investment = {};
  investment.amount = parseFloat(totalAmount);
  let investment_type = "";
  if (investType === "onetime") {
    investment.type = "diy";
    investment_type = "onetime";
  } else {
    investment.type = "diysip";
    investment_type = "sip";
  }

  let paymentRedirectUrl = encodeURIComponent(
    `${getBasePath()}/page/callback/${investment_type}/${investment.amount}`
  );

  investment.allocations = allocations;
  window.localStorage.setItem("investment", JSON.stringify(investment));
  let body = {
    investment: investment,
  };
  let investmentEventData = {
    amount: parseFloat(totalAmount),
    investment_type: investment_type,
    investment_subtype: "",
    journey_name: type,
  };

  storageService().setObject("mf_invest_data", investmentEventData);

  if (
    !currentUser.active_investment &&
    partner_code !== "bfdlmobile" &&
    type === "diy"
  ) {
    this.navigate("/invest-journey");
    return;
  }

  if (isReferralGiven && investReferralData.code) {
    body.referral_code = investReferralData.code;
  }

  this.setState({
    sipOrOnetime: investment_type,
    body: body,
    investmentEventData: investmentEventData,
  });
  this.proceedInvestmentChild({
    userKyc: userKyc,
    sipOrOnetime: investment_type,
    body: body,
    investmentEventData: investmentEventData,
    paymentRedirectUrl: paymentRedirectUrl,
    isSipDatesScreen: isSipDatesScreen,
    history: this.props.history,
    handleDialogStates: this.handleDialogStates,
    handleApiRunning: this.handleApiRunning,
  });
}
