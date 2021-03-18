import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Slide from "@material-ui/core/Slide";
import RenderAttachment from "./attachments";
// import { getConfig } from "utils/functions";

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
      category = this.props.location.state.category;
      sub_category = this.props.location.state.sub_category;

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

  handleChange = () => {};

  handleClick = () => {
    this.createTicket();
    // this.setState({
    //   openConfirmDialog: true,
    // });
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
                onClick={() => this.handleClose()}
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

  render() {
    let { ticket, category, sub_category } = this.state;

    return (
      <Container
        title="Write to us"
        buttonTitle="SUBMIT"
        handleClick={this.handleClick}
        // skelton={this.state.skelton}
      >
        <div className="send-query">
          <div className="sub-title">
            {category} {">"} {sub_category}
          </div>
          <div className="ticket-id">Old Ticket: {ticket.ticket_id}</div>
          <RenderAttachment row={8} />
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default SendQuery;
