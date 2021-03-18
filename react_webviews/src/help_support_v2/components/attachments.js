import React, { Component } from "react";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import ic_clip from "assets/ic_clip.svg";
import { initialize } from "../common/functions";
import { bytesToSize } from "utils/validators";
import { isMobile } from "utils/functions";
// import toast from "common/ui/Toast";
import $ from "jquery";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class RenderAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidMount() {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: "native_receiver_image",
        show_loader: function (show_loader) {
          that.showLoaderNative();
        },
      });
    }
  }

  onload = () => {};

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type) {
    this.setState({
      type: method_name,
    });

    if (getConfig().Web || isMobile.iOS()) {
      this.openFileExplorer();
    } else {
      //   this.native_call_handler(method_name, doc_type);
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderDialog = () => {
    return (
      <Dialog
          open={this.state.open || false}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              Disagree
            </Button>
            <Button onClick={this.handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
    );
  };

  handledelete = () => {
    this.setState({ open: true });
  }

  render() {
    let { documents } = this.state;
    return (
      <div className="render-attachment fade-in">
        <div
          className="input"
          style={{
            border: `1px solid ${
              this.state.productName === "finity" ? "#CBDEF6" : "#D5CCE9"
            }`,
          }}
        >
          <textarea
            rows={this.props.row}
            placeholder="Write your query here"
            //   value={this.state.query}
            //   onChange={this.handleChange()}
          ></textarea>
        </div>
        {documents.map((item, index) => (
          <div className="attachment" key={index}>
            <div className="attachment-title">
              <img
                style={{ margin: "0 5px 0 0" }}
                src={require(`assets/${this.state.productName}/attached.svg`)}
                alt=""
              />
              {item.name}
              <span className="bytes">{bytesToSize(item.size)}</span>
            </div>
            <img
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={() => this.handledelete()}
              src={require("assets/sign_icon.svg")}
              alt=""
            />
          </div>
        ))}
        <div
          className="pdf-upload"
          onClick={() => this.startUpload("open_camera", "attachment")}
        >
          <div className="plus-sign">
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => this.getPdf(e)}
              id="myFile"
            />
            <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
              }
              src={ic_clip}
            />
          </div>
          <div>UPLOAD ATTACHMENTS</div>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}

export default RenderAttachment;
