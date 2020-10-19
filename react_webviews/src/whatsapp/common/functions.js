// import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import toast from "../../common/ui/Toast";
import { nativeCallback } from "utils/native_callback";

export async function initialize() {

  this.setState({
    productName: getConfig().productName,
  });

  this.navigate = navigate.bind(this);

  nativeCallback({ action: "take_control_rest" });
}

export async function summary() {

  try {
    this.setState({
      show_loader: true
    });

    let body = {
      user: ["user"]
    }
    const res = await Api.post(`/api/user/account/summary`, body);

    if (res.pfwresponse.status_code === 200) {
      const resultData = res.pfwresponse.result.data.user.user.data;
      const { mobile, user_id, verified } = resultData;
      this.setState({
        show_loader: false,
      });

      this.setState({
        productName: getConfig().productName,
        mobile: mobile.slice(3),
        user_id: user_id, 
        verified: verified
      });
    }

  } catch (err) {
    this.setState({
      show_loader: false
    });
    toast("Something went wrong");
  }
}

export async function getContact(data) {

  try {
    this.setState({
      show_loader: true
    });

    const res = await Api.get(`api/communication/contact/get?user_id=${data.user_id}&contact_value=${data.mobile}`);

    
    if (res.pfwresponse.status_code === 200) {
      const resultData = res.pfwresponse.result.contact_details;
      const { id } = resultData;

      this.setState({
        show_loader: false,
        // contact_id: id,
      })

      return id;
    } else {

      const resultData = res.pfwresponse.result;
      this.setState({
        show_loader: false
      });
      toast(resultData.error || resultData.message || "Something went wrong");
    }

  } catch (err) {
    this.setState({
      show_loader: false
    });
    toast("Something went wrong");
  }
}

export function navigate(pathname, data = {}) {
  this.props.history.push({
    pathname: pathname,
    search: data.searchParams || getConfig().searchParams,
    params: data.params || {},
  });
}
