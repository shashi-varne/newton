import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from 'lodash';
import { filter_options } from "../constants"
import Checkbox from '@material-ui/core/Checkbox';
import toast from "../../../common/ui/Toast";

export const genericErrMsg = "Something went wrong";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.setErrorData = setErrorData.bind(this);
  this.handleError = handleError.bind(this);
  this.countCarouselSwipe = countCarouselSwipe.bind(this);
  this.productName = productName.bind(this);
  this.handleClick = handleClick.bind(this);
  this.fetch_funddetails_list = fetch_funddetails_list.bind(this);

  nativeCallback({ action: "take_control_reset" });

  if (this.state.screen_name === "fund_list") {
    const state = this.props.location.state;
    this.setState({
      title: storageService().get('category_index_name') || state,
    })
  }
}

export const productName = () => getConfig().productName

export function setErrorData(type) {
  this.setState({
    showError: false,
  });
  if (type) {
    let mapper = {
      onload: {
        handleClick1: this.onload,
        title1: this.state.title1,
        button_text1: "Retry",
      },
      upldateFeedback: {
        handleClick1: () => {
          this.setState({
            showError: false,
          });
        },
        title1: this.state.title1,
        button_text1: "Dismiss",
      },
      submit: {
        handleClick1: this.handleClick,
        button_text1: "Retry",
        title1: this.state.title1,
        handleClick2: () => {
          this.setState({
            showError: false,
          });
        },
        button_text2: "Edit",
      },
    };

    this.setState({
      errorData: { ...mapper[type], setErrorData: this.setErrorData },
    });
  }
}

export function handleError(error, errorType, fullScreen = true) {
  this.setState({
    show_loader: false,
    skelton: false,
    isApiRunning: false,
    errorData: {
      ...this.state.errorData,
      title2: error,
      type: errorType,
    },
    showError: fullScreen ? "page" : true,
  });
}

export function navigate(pathname, data = {}, redirect) {
  this.props.history.push({
    pathname: `/passive-index-funds/${pathname}`,
    search: data.searchParams || getConfig().searchParams,
    state: data,
  });
}

export function countCarouselSwipe(index) {
  this.setState({
    selectedIndex: index,
    card_swipe: "yes",
    card_swipe_count: this.state.card_swipe_count + 1,
  });
};

export function handleClick(data) {
  const categoryName = data.key === "global_indices" ? "global_index_funds" : data.key;
  this.sendEvents("next", categoryName);
  storageService().set("category_index_name", data.title);
  this.navigate(`${data.key}/fund-list`, data.title);
}


export async function fetch_funddetails_list(body) {

  if (isEmpty(body)) {
    body = {
      "subcategory": "all",
      "sort_by": "low_to_high",
      "filter_by": "tracking_error",
      "return_type": "five_year_return"
    }
    this.setState({ body: body })
  };

  this.setState({ skelton: true })
  let error = ""
  try {
    const res = await Api.post(`/api/funds/passive/index/category/${this.state.title}`, body);
    let result = res.pfwresponse?.result?.funds;
    var resultData = res.pfwresponse.result;
    let fundDescription = res.pfwresponse?.result?.category_explainer

    if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && !isEmpty(result)) {

      if (this.state.mount) {
        getFilterNames(result, 'fund_house', 'Fund House');  // responce |  value |  Name
        getFilterNames(result, 'tracking_index', 'Index');
        this.setState({
          result: result,
          fundDescription: fundDescription,
          filter_options: filter_options,
          body: body,
          mount: false,
        })
      }
      else {
        this.setState({
          result: result,
          body: body
        })
      }

    }
    else if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && isEmpty(result)) {
      this.setState({
        fundDescription: fundDescription,
      })
      toast("We are sorry! There are no funds that match your requirements.")
    }
    else {
      error = resultData?.error || resultData?.message || "Something went wrong."
      throw error;
    }

    this.setState({ skelton: false })
  } catch (err) {
    console.log(err)
    toast(err, `error`)
    this.setState({ skelton: false })
    throw err;
  }
};


export function getFilterNames(result, Value, name) {

  if (result.length > 0) {
    const dataArr = result.map((item) => item[Value])
    const uniqueSet = new Set(dataArr)
    var uniqueArr = Array.from(uniqueSet)
  }

  if (!isEmpty(uniqueArr)) {
    const option = uniqueArr.map((item, idx) => {
      return ({
        value: item,
        control: Checkbox,
        title: item,
        labelPlacement: "end",
        color: "primary",
      });
    })

    filter_options.forEach(element => {

      if (!!element[name]) {
        element[name] = option
      }

    });
    return filter_options;
  }

  return filter_options;

}