import { storageService } from "utils/validators";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";

export const genericErrMsg = "Something went wrong";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.countCarouselSwipe = countCarouselSwipe.bind(this);
  this.productName = productName.bind(this);

  nativeCallback({ action: "take_control_reset" });

  if (this.state.screen_name === "fund_list") {
    const state = this.props.location.state;
    this.setState({
      title: storageService().get("category_index_name") || state,
    });
  }
}

export const productName = () => getConfig().productName;


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
}
