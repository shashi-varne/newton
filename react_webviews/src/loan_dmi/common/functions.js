import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.openInBrowser = openInBrowser.bind(this);
  this.openInTabApp = openInTabApp.bind(this);

  let get_next = {
    home_screen: 'personal-details',
    personal_details: 'select-loan',
  };

  let next_screen = this.state.next_screen || "";
  if (this.state.screen_name && get_next[this.state.screen_name]) {
    next_screen = get_next[this.state.screen_name];
    this.setState({
      next_state: next_screen,
    });
  }

  nativeCallback({ action: "take_control_reset" });

  this.setState({
    productName: getConfig().productName,
    count: 0,
  });
}

export function openInBrowser(url) {
  nativeCallback({
    action: "open_in_browser",
    message: {
      url: url,
    },
  });
}

export function openInTabApp(data = {}) {
  nativeCallback({
    action: "open_inapp_tab",
    message: {
      url: data.url || "",
      back_url: data.back_url || "",
    },
  });
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
