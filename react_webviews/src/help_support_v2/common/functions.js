import { getConfig } from "utils/functions";
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import toast from "common/ui/Toast";
import throttle from "lodash/throttle";
import scrollIntoView from "scroll-into-view-if-needed";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.openInBrowser = openInBrowser.bind(this);
  this.getPdf = getPdf.bind(this);
  this.save = save.bind(this);
  this.handleError = handleError.bind(this);

  nativeCallback({ action: "take_control_reset" });

  this.setState({
    productName: getConfig().productName,
  });

  this.onload();
}

export function navigate(pathname, data = {}) {
  this.props.history.push({
    pathname: pathname,
    search: data.searchParams || getConfig().searchParams,
    params: data.params || {},
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

export const handleScroll = throttle(
  () => {
    let element = document.getElementById("viewScroll");
    if (!element || element === null) {
      return;
    }

    scrollIntoView(element, {
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
  },
  50,
  { trailing: true }
);

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

export async function getAllCategories() {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
    });

    const res = await Api.get("/relay/hns/api/categories");

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function SearchFaq(word) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      isApiRunning: true,
    });

    const res = await Api.get(`/relay/hns/api/faq/search?word=${word}`);

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      isApiRunning: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });
      let value = "";
      this.handleChange(value)

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function getSubCategories(category_id) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
    });

    const res = await Api.get(
      `/relay/hns/api/sub_categories?category_id=${category_id}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function getAllfaqs(sub_category_id) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
    });

    const res = await Api.get(
      `/relay/hns/api/faqs?sub_category_id=${sub_category_id}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function getFaqDescription(faq_id) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
      isApiRunning: true,
    });
    const res = await Api.get(`/relay/hns/api/faq/${faq_id}/desc`);

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
      isApiRunning: false,
    })
    if (status === 200) {
      return result
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function updateFeedback(feedback, id) {
  this.setErrorData("upldateFeedback");
  let error = "";
  let errorType = "";

  try {
    const res = await Api.post(
      `/relay/hns/api/faq/${id}/action?action=${feedback}`
    );
    let { result, status_code: status } = res.pfwresponse;

    if (status !== 200) {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });
      this.setErrorData("upldateFeedback");
      throw error
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false)
  }
}

export async function getUserTickets(params) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    this.setState({
      skelton: true,
    });

    const res = await Api.get(
      `/relay/hns/api/freshdesk/ticket/all?status=${params}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      let { tickets } = this.state;

      tickets[params] = result.tickets;
      this.setState({
        tickets: tickets,
      });
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function getTicketConversations(ticket_id) {
  this.setErrorData("onload");
  let error = "";
  let errorType = "";

  try {
    const res = await Api.get(
      `/relay/hns/api/freshdesk/ticket/${ticket_id}/conversations`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
      show_loader: false,
    });

    if (status === 200) {
      return result.response;
    } else {
      let title1 = result.error || result.message || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("onload");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "crash";
  }

  if (error) {
    this.handleError(error, errorType)
  }
}

export async function createTicket(body = {}) {
  this.setErrorData("submit");

  let error = "";
  let errorType = "";

  try {
    this.setState({
      show_loader: "button",
    });
    const res = await Api.post(`/relay/hns/api/freshdesk/ticket/create`, body);

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
      show_loader: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("submit");
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false)
  }
}

export async function ticketReply(body = {}, id) {
  this.setErrorData("submit");

  let error = "";
  let errorType = "";

  try {
    this.setState({
      show_loader: "button",
    });
    const res = await Api.post(
      `/relay/hns/api/freshdesk/ticket/${id}/reply`,
      body
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      let title1 = result.error || "Something went wrong!";
      this.setState({
        title1: title1,
      });

      this.setErrorData("submit");
      error = true;
      errorType = "form";
    }
  } catch (err) {
    console.log(err);
    error = true;
    errorType = "form";
  }

  if (error) {
    this.handleError(error, errorType, false)
  }
}

export function getPdf(e) {
  e.preventDefault();

  let file = e.target.files[0] || "";

  if (file.size >= 10000000) {
    toast("Please select pdf/image file less than 10 MB only");
    return;
  }

  let acceptedType = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/bmp",
  ];

  if (file && acceptedType.indexOf(file.type) === -1) {
    toast("Please select pdf/image file only");
    return;
  }

  if (file) {
    let { documents, count } = this.state;
    file.doc_type = file.type;

    let duplicate = documents.filter((item) => {
      return item.name === file.name;
    });

    duplicate.length === 0 && documents.length < 10 && documents.push(file);

    this.setState(
      {
        documents: documents,
        confirmed: duplicate.length !== 0 ? true : false,
        count: count,
      },
      () => this.handleScroll()
    );
  }
}

export function save(file) {
  let acceptedType = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/bmp",
  ];

  if (file.size >= 10000000) {
    toast("Please select pdf/image file less than 10 MB only");
    this.setState({
      show_loader: false,
    });
    return;
  }

  if (!acceptedType.includes(file.type)) {
    toast("Please select pdf/image file only");
    return;
  }

  let { documents } = this.state;
  file.doc_type = file.type;

  let ext = file.type.split("/")[1];
  if (!file.name.includes(`.${ext}`)) {
    file.name = `${file.name}.${ext}`;
  }

  let duplicate = documents.filter((item) => {
    return item.name === file.name;
  });

  duplicate.length === 0 && documents.length < 10 && documents.push(file);

  this.setState({
    documents: documents,
    show_loader: false,
  });
}