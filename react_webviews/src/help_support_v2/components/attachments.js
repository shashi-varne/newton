import React, { Component } from "react";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import ic_clip from "assets/ic_clip.svg";
import { initialize } from "../common/functions";
import { bytesToSize } from "utils/validators";
import { isMobile } from "utils/functions";
import $ from "jquery";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import Button from "material-ui/Button";

class RenderAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      count: 0,
      productName: getConfig().productName
    };
    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {}

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

  showLoaderNative() {
    this.setState({
      show_loader: true
    })
  }

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
        this.native_call_handler(method_name, doc_type);
    }
  }

  native_call_handler(method_name, doc_type) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: "doc",
        doc_type: doc_type,
        // callbacks from native
        upload: function upload(file) {
          try {
            that.setState({
              docType: this.doc_type,
              show_loader: true,
            });
            switch (file.type) {
              case "application/pdf":
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
              case "image/bmp":
                that.props.save(file);
                break;
              default:
                alert("Please select pdf/image file");
                that.setState({
                  docType: this.doc_type,
                  show_loader: false,
                });
            }
          } catch (e) {
            //
          }
        },
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (status) => {
    if (status === 'yes') this.props.onDelete(this.state.index);

    this.setState({ open: false });
  };

  handleClick = event => {
    const { target = {} } = event || {};
    target.value = "";
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
            Are you sure you want to delete this attached file?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: "flex" }}>
          <Button onClick={() => this.handleClose("yes")}>YES</Button>
          <Button onClick={() => this.handleClose()}>NO</Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleDelete = (index) => {
    this.setState({ open: true, index: index });
  };

  render() {
    return (
      <div className="render-attachment fade-in">
        <div
          className="input"
          style={{
            border: `1px solid ${
              this.state.productName === "fisdom" ? "#D5CCE9" : `${getConfig().secondary}` 
            }`,
          }}
        >
          <textarea
            rows={this.props.row}
            placeholder="Write your query here"
              value={this.props.value}
            onChange={(e) => this.props.handleChange(e)}
          ></textarea>
        </div>
        {this.props.documents.map((item, index) => (
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
              onClick={() => this.handleDelete(index)}
              src={require("assets/sign_icon.svg")}
              alt=""
            />
          </div>
        ))}
        <div
          className="pdf-upload"
          onClick={() => this.startUpload("open_file", "attachment")}
        >
          <div className="plus-sign">
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => this.props.getPdf(e)}
              onClick={(e) => this.handleClick(e)}
              id="myFile"
            />
            <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + getConfig().styles.secondaryColor)
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
