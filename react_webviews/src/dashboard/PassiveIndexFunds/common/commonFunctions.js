import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import { isEmpty } from "utils/validators";
import toast from "../../../common/ui/Toast";

export const genericErrMsg = "Something went wrong";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.setErrorData = setErrorData.bind(this);
  this.handleError = handleError.bind(this);
  this.carouselSwipecount = carouselSwipe_count.bind(this);
  this.productName = productName.bind(this);
  this.handleClick = handleClick.bind(this);

  nativeCallback({ action: "take_control_reset" });

  if (this.state.screen_name === "fund_list") {
    const state = this.props.location.state;
    this.setState({
      title: state
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
  this.sendEvents("next", categoryName)
  this.navigate(`${data.key}/fund-list`, data.title);
}




export async function fetch_funddetails_list() {

  let body = {
    "subcategory": "all",
    "sort_by": "high_to_low",
    "filter_by": "expense_ratio"
  }


  try {
    const res = await Api.post(`https://subham-dot-plutus-staging.appspot.com/api/funds/passive/index/category/${this.state.title}`, body);

    let result = res.pfwresponse?.result?.funds;
    let fundDescription =  res.pfwresponse?.result?.category_explainer

    if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200 && !isEmpty(result)) {

        this.setState({
          result: result,
          fundDescription: fundDescription
        })

    }

  } catch (err) {
    throw err;
  }
};