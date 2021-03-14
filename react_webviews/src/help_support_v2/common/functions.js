// import { storageservice } from 'utils/validators';
import { getConfig } from "utils/functions";
import Api from "utils/api";
// import toast from '../../common/ui/Toast';
import { nativeCallback } from "utils/native_callback";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.SearchFaq = SearchFaq.bind(this);
  this.getAllCategories = getAllCategories.bind(this);

  nativeCallback({ action: "take_control_reset" });

  this.setState(
    {
      productName: getConfig().productName,
    }
  );

  let { screen_name } = this.state;

  if (screen_name === 'categories') {
    let result = await this.getAllCategories();
    this.setState({
      categoryList: result.categories
    })
  }

  this.onload();
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

export async function getAllCategories() {
  this.setState({
    skelton: true
  })
  try {
    const res = await Api.get('/relay/hns/api/categories');

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false
    })

    if (status === 200) {
      return result;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false
    })
  }
}