import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../../common/functions";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import Attention from "../../../common/ui/Attention";
import { formatDate, dobFormatTest } from "utils/validators";
import { bytesToSize } from "utils/validators";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import toast from "../../../common/ui/Toast";
import $ from "jquery";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: "none",
  },
});

class UploadBankStatements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      fileUploaded: false,
      form_data: {},
      total_documents_uploaded: 0,
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: "Application form",
      steps: [
        {
          title: "Income details",
          status: "init",
        },
        {
          title: "BT transfer details",
          status: "pending",
        },
        {
          title: "Loan offer",
          status: "pending",
        },
      ],
    };

    this.setState({
      progressHeaderData: progressHeaderData,
    });
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
      show_loader: true,
    });
  }

  renderNotes = () => {
    let notes = [
      "1. Attach latest bank statements of the same account where your salary gets credited every month",
      "2. Ensure the bank statements are of the last 3 months from this month",
      "3. Files must be original and should be uploaded in a PDF format",
      "4. Share respective passwords if your statements are password protected",
      "5. Upload multiple statements of the same bank account with each file not exceeding 6 MB",
    ];

    return (
      <div style={{ lineHeight: "15px" }}>
        {notes.map((item, index) => (
          <div style={{marginTop: '20px', background:'green'}} key={index}>
            {item}
          </div>
        ))}
      </div>
    );
  };

  native_call_handler(method_name, doc_type, doc_name) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: "doc",
        doc_type: doc_type,
        doc_name: doc_name,
        // callbacks from native
        upload: function upload(file) {
          try {
            that.setState({
              docType: this.doc_type,
              docName: this.docName,
              doc_side: this.doc_side,
              show_loader: true,
            });
            switch (file.type) {
              case "application/pdf":
                that.mergeDocs(file);
                break;
              default:
                alert("Please select image file");
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

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type, doc_name) {
    this.setState({
      type: method_name,
    });

    this.openFileExplorer();
  }

  getPdf = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    let acceptedType = ["application/pdf"];

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select pdf file only");
      return;
    }

    file.doc_type = file.type;
    let { total_documents_uploaded } = this.state;
    this.setState({
      pdfFile: file,
      fileUploaded: true,
      total_documents_uploaded: total_documents_uploaded + 1,
    });
  };

  uploadFile = () => {};

  // handleChange = (e) => {
  //   this.setState({
  //     password: e.target.value,
  //   });
  // };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data } = this.state;

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(id);
      input.onkeyup = formatDate;
    }

    form_data[name || id] = value;
    form_data[(name || id) + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  render() {
    let { fileUploaded, pdfFile } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        // disable={true}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
      >
        <div className="upload-bank-statement">
          <Attention content={this.renderNotes()} />
          <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.bank_name_error}
                helperText={this.state.form_data.bank_name_error}
                type="text"
                width="40"
                label="Bank name"
                class="bank_name"
                id="name"
                name="bank_name"
                value={this.state.form_data.bank_name || ""}
                onChange={this.handleChange("bank_name")}
              />
            </div>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.start_date_error}
                // helperText={this.state.form_data.start_date_error}
                helperText="This date must be 3 months from the current date"
                type="text"
                width="40"
                label="Start date"
                class="start_date"
                maxLength={10}
                id="start_date"
                name="start_date"
                placeholder="DD/MM/YYYY"
                value={this.state.form_data.start_date || ""}
                onChange={this.handleChange()}
              />
            </div>
            <div className="InputField">
              <Input
                error={!!this.state.form_data.end_date_error}
                helperText="This date must be 3 days before the current date"
                type="text"
                width="40"
                label="End date"
                class="end_date"
                maxLength={10}
                id="end_date"
                name="end_date"
                placeholder="DD/MM/YYYY"
                value={this.state.form_data.end_date || ""}
                onChange={this.handleChange()}
              />
            </div>
          </FormControl>

          {fileUploaded && (
            <div className="bank-statement" style={{ marginBottom: "70px" }}>
              <div className="title">1. Bank statement</div>
              <div className="sub-title">
                <img
                  style={{ margin: "0 5px 0 12px" }}
                  src={require("assets/tool.svg")}
                  alt=""
                />
                {pdfFile && pdfFile.name}
                <span className="bytes">
                  {bytesToSize(
                    this.state.pdfFile ? this.state.pdfFile.size : ""
                  )}
                </span>
              </div>

              <div className="InputField">
                <Input
                  // error={!!this.state.end_date_error}
                  // helperText="This date must be 3 days before the current date"
                  type="password"
                  width="40"
                  label="Enter password (if any)"
                  class="password"
                  id="password"
                  name="password"
                  placeholder="XXXXXXX"
                  value={this.state.password || ""}
                  onChange={this.handleChange}
                />
              </div>
              <Button
                variant="raised"
                size="large"
                color="secondary"
                className="upload-button"
              >
                EDIT
              </Button>
              <Button variant="raised" size="large" color="secondary">
                DELETE
              </Button>
            </div>
          )}

          <div
            className="pdf-upload"
            onClick={() => this.startUpload("upload_doc", "pan", "pan.pdf")}
          >
            <span className="plus-sign">
              <input
                type="file"
                style={{ display: "none" }}
                onChange={this.getPdf}
                id="myFile"
              />
              <SVG
                preProcessor={(code) =>
                  code.replace(/fill=".*?"/g, "fill=" + getConfig().secondary)
                }
                src={plus}
              />
            </span>
            {fileUploaded ? "ADD FILE" : "UPLOAD FILE"}
          </div>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(UploadBankStatements);
