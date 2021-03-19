// import { storageservice } from 'utils/validators';
import { getConfig } from "utils/functions";
import Api from "utils/api";
// import toast from '../../common/ui/Toast';
import { nativeCallback } from "utils/native_callback";
import toast from "common/ui/Toast";

export async function initialize() {
  this.navigate = navigate.bind(this);
  this.SearchFaq = SearchFaq.bind(this);
  this.getAllCategories = getAllCategories.bind(this);
  this.getSubCategories = getSubCategories.bind(this);
  this.getFaqDescription = getFaqDescription.bind(this);
  this.getAllfaqs = getAllfaqs.bind(this);
  this.getUserTickets = getUserTickets.bind(this);
  this.getTicketConversations = getTicketConversations.bind(this);
  this.createTicket = createTicket.bind(this);
  this.ticketReply = ticketReply.bind(this);
  this.getPdf = getPdf.bind(this);
  this.updateFeedback = updateFeedback.bind(this);

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

export async function SearchFaq(word) {
  this.setState({
    isApiRunning: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.get(`/relay/hns/api/faq/search?word=${word}`);

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      isApiRunning: false,
    });

    if (status === 200) {
      return result;
    } else {
      error = result.error || result.message || true;
    }
  } catch (err) {
    this.setState({
      isApiRunning: false,
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
    console.log(err);
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function updateFeedback(feedback, id) {
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.post(`/relay/hns/api/faq/${id}/action?action=${feedback}`);
    let { result, status_code: status } = res.pfwresponse;

    if (status !== 200) {
      error = result.error || result.message || true;
    }
  } catch (err) {
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
    console.log(err);
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getAllCategories() {
  this.setState({
    skelton: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.get("/relay/hns/api/categories");

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      return result;
    } else {
      error = result.error || result.message || true;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getSubCategories(category_id) {
  this.setState({
    skelton: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.get(
      `/relay/hns/api/sub_categories?category_id=${category_id}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      this.setState({
        sub_categories: result.sub_categories,
      });
    } else {
      error = result.error || result.message || true;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getAllfaqs(sub_category_id) {
  this.setState({
    skelton: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.get(
      `/relay/hns/api/faqs?sub_category_id=${sub_category_id}`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      let { faqs } = this.state;

      faqs[sub_category_id] = result.faqs;

      this.setState({
        faqs: faqs,
      });
    } else {
      error = result.error || result.message || true;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getFaqDescription(faq_id) {
  this.setState({
    skelton: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
    const res = await Api.get(`/relay/hns/api/faq/${faq_id}/desc`);

    let { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      let { faqDesc, fromScreen, faqs } = this.state;

      if (fromScreen === "categoryList" && Object.keys(faqs).length === 0) {
        this.setState({
          sub_category_id: result.faq.cms_sub_category_id,
          index: result.faq.sequence_no - 1,
        });

        await this.getAllfaqs(result.faq.cms_sub_category_id);
      } else {
        this.setState({
          skelton: false,
        });
        faqDesc[faq_id] = result.faq;

        this.setState({
          faqDesc: faqDesc,
        });
      }
    } else {
      error = result.error || result.message || true;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getUserTickets(params) {
  this.setState({
    skelton: true,
  });
  this.setErrorData("onload");
  let error = "";
  try {
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
      error = result.error || result.message || true;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      showError: true,
      errorData: {
        ...this.state.errorData,
        type: "crash",
      },
    });
  }

  if (error) {
    this.setState({
      errorData: {
        ...this.state.errorData,
        title1: error,
      },
      showError: "page",
    });
  }
}

export async function getTicketConversations(ticket_id) {
  this.setState({
    skelton: true,
  });
  try {
    const res = await Api.get(
      `/relay/hns/api/freshdesk/ticket/${ticket_id}/conversations`
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
    });

    if (status === 200) {
      let { ticket_status, conversations } = this.state;

      ticket_status = result.response.status;
      conversations = result.response.conversations;

      this.setState({
        ticket_status: ticket_status,
        conversations: conversations,
        category: result.response.category,
        sub_category: result.response.sub_category,
      });
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
    });
  }
}

export async function createTicket(body = {}) {
  this.setState({
    skelton: true,
    show_loader: 'button'
  });

  try {
    const res = await Api.post(
      // `/relay/hns/api/freshdesk/ticket/500413/reply`,
      `/relay/hns/api/freshdesk/ticket/create`,
      body
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
      show_loader: false,
    });

    if (status === 200) {
      return result;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      show_loader: false,
    });
  }
}

export async function ticketReply(body = {}, id) {
  this.setState({
    skelton: true,
    show_loader: 'button'
  });

  try {
    const res = await Api.post(
      `/relay/hns/api/freshdesk/ticket/${id}/reply`,
      body
    );

    let { result, status_code: status } = res.pfwresponse;

    this.setState({
      skelton: false,
      show_loader: false,
    });

    if (status === 200) {
      return result;
    }
  } catch (err) {
    console.log(err);
    this.setState({
      skelton: false,
      show_loader: false,
    });
  }
}

export function getPdf(e) {
  e.preventDefault();

  let file = e.target.files[0] || "";

  if (file.size >= 15000000) {
    toast("Please select pdf file less than 15 MB only");
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
    toast("Please select pdf file only");
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
  let acceptedType = ["application/pdf"];

  if (file.size >= 6000000) {
    toast("Please select pdf file less than 6 MB only");
    this.setState({
      show_loader: false,
    })
    return;
  }

  if (acceptedType.indexOf(file.type) === -1) {
    toast("Please select pdf file only");
    return;
  }

  let { documents, count } = this.state;
  file.doc_type = file.type;

  file.name = !file.file_name
    ? `attachment ${count + 1}`
    : `${file.file_name}`;
  file.id = count++;

  if (!file.name.includes(".pdf")) {
    file.name = `${file.name}.pdf`;
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