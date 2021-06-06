import Api from "../../utils/api";
import { isEmpty } from 'lodash';
import toast from '../../common/ui/Toast';


export async function getFundDetailsList(body) {

  this.setState({ skelton: true });
  let error = ""
  try {
    const res = await Api.post(`/api/funds/passive/index/category/${this.state.title}`, body);
    let result = res.pfwresponse?.result?.funds;
    var resultData = res.pfwresponse?.result;
    let fundDescription = res.pfwresponse?.result?.category_explainer

    this.setState({ skelton: false })

    if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && !isEmpty(result)) {
      return { result, fundDescription };
    }
    else if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && isEmpty(result)) {
      toast("We are sorry! There are no funds that match your requirements.")
      return { fundDescription };
    }
    else {
      error = resultData?.error || resultData?.message || "Something went wrong."
      throw error;
    }
  } catch (err) {
    console.log(err)
    toast(err, `error`)
    this.setState({ skelton: false })
    throw err;
  }
};