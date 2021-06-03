import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";
import { filter_options } from "../constants"
import Checkbox from '@material-ui/core/Checkbox';

export const genericErrMsg = "Something went wrong";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.setErrorData = setErrorData.bind(this);
  this.handleError = handleError.bind(this);
  this.carouselSwipecount = carouselSwipe_count.bind(this);
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

export function carouselSwipe_count(index) {
  this.setState({
    selectedIndex: index,
    card_swipe: "yes",
    card_swipe_count: this.state.card_swipe_count + 1,
  });
};

export function handleClick(data) {
  let categoryName = data.key === "global_indices" ? "global_index_funds" : data.key;
  this.sendEvents("next", categoryName);
  storageService().set("category_index_name", data.title);
  this.navigate(`${data.key}/fund-list`, data.title);
}


export function selected_year(selected) {
  let time
  switch (selected) {
    case "1M":
      time = 'one_month_return'
      break;
    case "3M":
      time = 'three_month_return'
      break;
    case "6M":
      time = 'six_month_return'
      break;
    case "1Y":
      time = 'one_year_return'
      break;
    case "3Y":
      time = 'three_year_return'
      break;
    case "5Y":
      time = 'five_year_return'
      break;
    default:
      time = 'five_year_return'
  }
  return time;
}



export async function fetch_funddetails_list(body) {

  this.setState({ skelton: true })

  if (isEmpty(body)) {
    var body = {
      "subcategory": "all",
      "sort_by": "high_to_low",
      "filter_by": "returns"
    }
  };

  try {
    const res = await Api.post(`/api/funds/passive/index/category/${this.state.title}`, body);
    let result = res.pfwresponse?.result?.funds;
    let fundDescription = res.pfwresponse?.result?.category_explainer

    if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && !isEmpty(result)) {

      getFilterNames(result, 'fund_house', 'Fund House');  // responce |  value |  Name
      getFilterNames(result, 'tracking_index', 'Index');

      this.setState({
        result: result,
        fundDescription: fundDescription,
        filter_options: filter_options
      })

    }
    this.setState({ skelton: false })

  } catch (err) {
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