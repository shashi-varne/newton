// import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
// import Api from "utils/api";
// import toast from "../../common/ui/Toast";
import { nativeCallback } from "utils/native_callback";

export async function initialize() {
  this.navigate = navigate.bind(this);

  nativeCallback({ action: "take_control_rest" });

  this.setState({
    productName: getConfig().productName,
  });
}

export function navigate(pathname, data = {}) {
  this.props.history.push({
    pathname: pathname,
    search: data.searchParams || getConfig().searchParams,
    params: data.params || {},
  });
}
