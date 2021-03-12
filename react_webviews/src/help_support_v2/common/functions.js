// import { storageservice } from 'utils/validators';
import { getConfig } from "utils/functions";
import Api from "utils/api";
// import toast from '../../common/ui/Toast';
import { nativeCallback } from "utils/native_callback";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.SearchFaq = SearchFaq.bind(this);

  nativeCallback({ action: "take_control_reset" });

  this.setState(
    {
      productName: getConfig().productName,
    },
    () => {
      this.onload();
    }
  );
}

export function navigate(pathname, data = {}) {
  if (this.props.edit || data.edit) {
    this.props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  } else {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      params: data.params || {},
    });
  }
}

export async function SearchFaq(word) {
  try {
    const res = await Api.get(`/relay/hns/api/faq/search?word=${word}`);

    let { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
        return result;
    }
  } catch (err) {
    console.log(err);
  }
}
