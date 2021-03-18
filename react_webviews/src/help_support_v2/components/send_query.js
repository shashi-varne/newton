import React, { Component } from "react";
import Container from "../common/Container";
import { initialize } from "../common/functions";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Slide from "@material-ui/core/Slide";
import RenderAttachment from "./attachments";

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
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  handleChange = () => {};

  handleClick = () => {
    this.setState({
      openConfirmDialog: true,
    });
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
    return (
      <Container
        title="Write to us"
        buttonTitle="PROCEED"
        handleClick={this.handleClick}
        // skelton={this.state.skelton}
      >
        <div className="send-query">
          <div className="sub-title">Insurance {">"} Health insurance</div>
          <RenderAttachment row={8} />
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default SendQuery;
