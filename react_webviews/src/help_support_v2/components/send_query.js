import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Slide from "@material-ui/core/Slide";
import RenderAttachment from "./attachments";
import scrollIntoView from "scroll-into-view-if-needed";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";

const Transition = (props) => {
  return <Slide direction="up" {...props} />;
};
class SendQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: "g",
      openConfirmDialog: false,
      ticket: "",
      sub_category: "",
      category: "",
      value: "",
      documents: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { ticket, category, sub_category } = this.state;

    if (this.props.location.state.ticket) {
      ticket = this.props.location.state.ticket;
      category = ticket.category;
      sub_category = ticket.sub_category;

      this.setState({
        ticket: ticket,
      });
    } else {
      category = this.props.location.state.category;
      sub_category = this.props.location.state.sub_category;
    }

    this.setState({
      category: category,
      sub_category: sub_category,
    });
  };

  sendEvents(user_action, data = {}) {
    let { category, sub_category, ticket, documents, value } = this.state;
    let eventObj = {
      event_name: "help_and_support",
      properties: {
        user_action: user_action,
        screen_name: ticket ? 'reopen_query' : 'unable_to_find_query',
        query_edit: value ? 'yes' : 'no',
        add_attachment: documents.length !== 0 ? 'yes' : 'no',
        category: category,
        sub_category: sub_category
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next')
    this.setState({
      show_loader: "button",
    });

    let body_data = new FormData();
    body_data.set("subject", this.state.sub_category);
    body_data.set("description", this.state.value);
    body_data.set("cf_product", "Gold");
    body_data.set("cf_category", this.state.category);
    body_data.set("cf_subcategory", this.state.sub_category);
    this.state.documents.forEach((item) => {
      body_data.append("res[]", item, item.name);
    });

    let result = await this.createTicket(body_data);

    if (result) {
      this.setState({
        openConfirmDialog: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openConfirmDialog || false}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
      >
        <DialogContent>
          <div
            className="group-health-bmi-dialog help-query-dialog"
            id="alert-dialog-description"
          >
            <div className="top-content flex-between">
              <div className="generic-page-title">
                <div className="call-back-popup-heading">Query sent!</div>
              </div>
              <img
                className=""
                src={require(`assets/${this.state.productName}/icn_msg_sent.svg`)}
                alt=""
              />
            </div>
            <div className="content-mid">
              We’ve received your message. Our Customer Support Team will get
              back to you with a response in the next 24 hours. For more details
              check “My queries”
            </div>
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.props.history.push(
                    { pathname: "queries", search: getConfig().searchParams },
                    { fromScreen: "send_query" }
                  );
                }}
                className="call-back-popup-button"
              >
                OKAY
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  handleChange = (e) => {
    let value = e.target.value;

    this.setState({
      value: value,
    });
  };

  handleScroll = () => {
    setTimeout(function () {
      let element = document.getElementById("viewScroll");
      if (!element || element === null) {
        return;
      }

      scrollIntoView(element, {
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  handleDelete = (index) => {
    let { documents } = this.state;

    documents.splice(index, 1);
    this.setState({
      documents: documents,
    });
  };

  redirectOldTicket = (ticket) => {
    this.props.history.push(
      { pathname: "conversation", search: getConfig().searchParams },
      { ticket: ticket }
    );
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
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
  };

  render() {
    let { ticket, category, sub_category, documents } = this.state;

    return (
      <Container
        title="Write to us"
        buttonTitle="SUBMIT"
        handleClick={this.handleClick}
        showLoader={this.state.show_loader}
        events={this.sendEvents("just_set_events")}
        showError={this.state.showError}
        errorData={this.state.errorData}
        disable={!this.state.value && documents.length === 0}
      >
        <div className="send-query">
          <div className="sub-title">
            {category} {">"} {sub_category}
          </div>
          {ticket && (
            <div
              className="ticket-id"
              onClick={() => this.redirectOldTicket(ticket)}
            >
              Old Ticket: {ticket.ticket_id}
            </div>
          )}
          <RenderAttachment
            row={8}
            handleChange={this.handleChange}
            getPdf={this.getPdf}
            save={this.save}
            value={this.state.value}
            documents={this.state.documents}
            onDelete={this.handleDelete}
          />
          <div id="viewScroll"></div>
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default SendQuery;
