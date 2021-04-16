import toast from "../../../../common/ui/Toast";
import Api from "../../../../utils/api";
import { apiConstants } from "../../constants";

const errorMessage = "Something went wrong!";
export function getFormattedStartDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1];
    });
  }
}

export function getFormattedEndDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1] + " " + p3;
    });
  }
}

export function getSchemeOption(text) {
  if (!text) {
    return null;
  } else {
    return text.split("_").join(" ");
  }
}

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