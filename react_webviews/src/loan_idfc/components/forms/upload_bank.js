import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Attention from "../../../common/ui/Attention";
// import { formatDate, dobFormatTest, isValidDate } from "utils/validators";
import { getConfig } from "utils/functions";
import { getBase64 } from "utils/functions";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import toast from "../../../common/ui/Toast";
// import "../../../utils/native_listner_otm";
import $ from 'jquery';
import right_arrow from "assets/right_arrow.svg";

class UploadBankStatements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidMount() {
    //
  }

  onload = () => {};

  sendEvents(user_action) {
    let eventObj = {
      event_name: "lending",
      properties: {
        user_action: user_action,
        screen_name: "otp",
        fileUploaded: false,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  showLoaderNative() {
    this.setState({
      show_loader: true
    })
  }


  native_call_handler(method_name, doc_type, doc_name) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: 'doc',
        doc_type: doc_type,
        doc_name: doc_name,
        // callbacks from native
        upload: function upload(file) {
          try {
            that.setState({
              docType: this.doc_type,
              docName: this.docName,
              doc_side: this.doc_side,
              show_loader: true
            })
            switch (file.type) {
              case 'application/pdf':
                that.mergeDocs(file);
                break;
              default:
                alert('Please select image file');
                that.setState({
                  docType: this.doc_type,
                  show_loader: false
                })
            }
          } catch (e) {
            // 
          }
        }
      });

      window.callbackWeb.add_listener({
        type: 'native_receiver_image',
        show_loader: function (show_loader) {
          that.setState({
            show_loader: true
          })
          that.showLoaderNative();
        }
      });
    }
  }

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type, doc_name) {
    this.setState({
      type: method_name
    })

    this.openFileExplorer();
    // this.native_call_handler(method_name, doc_type, doc_name);
  }

  getPhoto = (e) => {

    e.preventDefault();

    let file = e.target.files[0];

    let acceptedType = ['application/pdf'];

    if (acceptedType.indexOf(file.type) === -1) {
      toast('Please select pdf file only');
      return;
    }

    let that = this;
    file.doc_type = file.type;
    this.setState({
      imageBaseFile: file
    })
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img,
        fileUploaded: true
      })
    });

  }

  uploadFile = () => {
    // this.native_call_handler("open_file", "bank_statement");
  };

  handleChange = () => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={true}
      >
        <div className="upload-bank-statement">
          <Attention />
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.bank_name_error}
                helperText={this.state.bank_name_error}
                type="text"
                width="40"
                label="Bank name"
                class="bank_name"
                id="name"
                name="bank_name"
                value={this.state.bank_name || ""}
                onChange={this.handleChange}
              />
            </div>
            <div className="InputField">
              <Input
                error={!!this.state.start_date_error}
                // helperText={this.state.start_date_error}
                helperText="This date must be 3 months from the current date"
                type="text"
                width="40"
                label="Start date"
                class="start_date"
                id="date"
                name="start_date"
                placeholder="DD/MM/YYYY"
                value={this.state.start_date || ""}
                onChange={this.handleChange}
              />
            </div>
            <div className="InputField">
              <Input
                error={!!this.state.end_date_error}
                helperText="This date must be 3 days before the current date"
                type="text"
                width="40"
                label="End date"
                class="end_date"
                id="date"
                name="end_date"
                placeholder="DD/MM/YYYY"
                value={this.state.end_date || ""}
                onChange={this.handleChange}
              />
            </div>
          </FormControl>
          <div className="pdf-upload" onClick={() => this.startUpload('upload_doc', 'pan', 'pan.pdf')}>
            <span className="plus-sign">
            <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
              <SVG
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
                }
                src={plus}
              />
              <SVG
              preProcessor={(code) =>
                code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
              }
              src={right_arrow}
            />
            </span>
            UPLOAD FILE
          </div>
        </div>
      </Container>
    );
  }
}

export default UploadBankStatements;
