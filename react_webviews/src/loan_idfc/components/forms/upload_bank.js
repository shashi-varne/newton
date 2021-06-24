import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import Attention from "../../../common/ui/Attention";
import { initialize } from "../../common/functions";
import { bytesToSize, dateOrdinal } from "utils/validators";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import toast from "../../../common/ui/Toast";
import $ from "jquery";
import DotDotLoader from "common/ui/DotDotLoader";
import Api from "utils/api";
import Input from "../../../common/ui/Input";
import { FormControl } from "material-ui/Form";
import { getUrlParams } from "utils/validators";
import Autosuggests from "../../../common/ui/Autosuggest";
import scrollIntoView from "scroll-into-view-if-needed";

class UploadBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      fileUploaded: false,
      screen_name: "bank_upload",
      documents: [],
      password: "",
      confirmed: true,
      editId: "",
      count: 1,
      form_data: {},
      bankOptions: [],
      params: getUrlParams(),
      doc_id: "",
      isApiRunning: false,
      adminPanel: false,
      date: ''
    };

    this.native_call_handler = this.native_call_handler.bind(this);
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let { params } = this.state;

    if (params.adminPanel) {
      this.setState({
        params: params,
      });
    }
  }

  componentDidMount() {
    let that = this;
    window.callbackWeb.add_listener({
      type: "native_receiver_image",
      show_loader: function (show_loader) {
        that.showLoaderNative();
      },
    });
  }

  showLoaderNative() {
    this.setState({
      show_loader: true,
    });
  }

  stopLoaderNative() {
    this.setState({
      show_loader: false,
    });
  }

  onload = () => {
    let lead = this.state.lead || {};
    let vendor_info = lead.vendor_info || {};
    let application_info = lead.application_info || {};
    let progressHeaderData = {
      title: "income details and loan offer",
      steps: [
        {
          title: "Income details",
          status: "init",
        },
        {
          title: "Loan offer",
          status: "pending",
        },
      ],
    };

    if (vendor_info.bt_eligible) {
      progressHeaderData.steps.splice(1, 0, {
        title: "Balance transfer details",
        status: "pending",
      });
    }

    let loaderData = {
      title: `Hang on, while IDFC FIRST Bank finishes analysing last 3 months’ bank statements`,
      subtitle: "It usually takes 10 to 15 seconds!",
    };

    let currentdate = new Date();
    let last3months = new Date(
      currentdate.setMonth(currentdate.getMonth() - 3)
    );
    var dd = dateOrdinal(1)
    var mm = last3months.toLocaleString("default", { month: "long" });
    var yyyy = last3months.getFullYear();

    let date = `${dd} ${mm}, ${yyyy}`

    this.setState({
      loaderData: loaderData,
      progressHeaderData: progressHeaderData,
      employment_type: application_info.employment_type || "",
      date: date
    });
  };

  renderNotes = () => {
    let notes = [
      "Provide the latest e-statements of salary account",
      "Attach e-statements of the last 3 months from this month",
      `E-statement's start date should be from ${this.state.date} or prior to that`,
      "The end date must not be 3 days prior to the current date",
      "Upload bank generated e-statements in PDF format only",
      "Multiple statements of the same account can be uploaded",
    ];

    if (this.state.employment_type === "self_employed") {
      notes[0] = "Provide the latest e-statements of savings or current a/c";
    }

    return (
      <div style={{ lineHeight: "15px" }}>
        {notes.map((item, index) => (
          <div className="upload-statement-notes" key={index}>
            <div>{`${index + 1}. `}</div>
            <div style={{ marginLeft: "3px" }}>{`${item}`}</div>
          </div>
        ))}
      </div>
    );
  };

  sendEvents(user_action) {
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: "idfc_upload_bank_statement",
      properties: {
        user_action: user_action,
        files_uploaded: this.state.documents.length,
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  native_call_handler(method_name, doc_type) {
    let that = this;
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
              that.save(file);
              break;
            default:
              alert("Please select pdf file");
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

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type) {
    this.setState({
      type: method_name,
    });

    if (getConfig().html_camera) {
      this.openFileExplorer();
    } else {
      this.native_call_handler(method_name, doc_type);
    }
  }

  getPdf = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    if (!file) return

    if (file.size >= 6291456) {
      toast("Please select pdf file less than 6 MB only");
      return;
    }

    let acceptedType = ["application/pdf"];

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select pdf file only");
      return;
    }

    let { documents, editId, doc_id, count } = this.state;
    file.doc_type = file.type;
    file.status = "uploaded";
    file.uploaded = true;
    file.id = count++;

    let duplicate = documents.filter((item) => {
      return item.name === file.name;
    });

    if (editId === "") {
      duplicate.length === 0 && documents.push(file);
    } else if (duplicate.length === 0) {
      var index = documents.findIndex((item) => item.id === editId);
      file.curr_status = "edit";
      file.document_id = doc_id;
      documents[index] = file;
    }

    this.setState({
      fileUploaded: true,
      documents: documents,
      confirmed: false,
      editId: "",
      count: count,
    });
  };

  save(file) {
    let acceptedType = ["application/pdf"];
    if (!file) return

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

    let { documents, editId, doc_id, count } = this.state;
    file.doc_type = file.type;

    file.status = "uploaded";
    file.name = !file.file_name
      ? `bank statement ${count + 1}`
      : `${file.file_name}`;
    file.id = count++;

    if (!file.name.includes(".pdf")) {
      file.name = `${file.name}.pdf`;
    }

    let duplicate = documents.filter((item) => {
      return item.name === file.name;
    });

    if (editId === "") {
      duplicate.length === 0 && documents.push(file);
    } else if (duplicate.length === 0) {
      var index = documents.findIndex((item) => item.id === editId);
      file.curr_status = "edit";
      file.document_id = doc_id;
      documents[index] = file;
    }

    this.setState({
      fileUploaded: true,
      documents: documents,
      show_loader: false,
      confirmed: false,
      editId: "",
      count: count,
    });
  }

  handleConfirm = async (id, curr_status = {}) => {
    let { documents, application_id } = this.state;

    var index = documents.findIndex((item) => item.id === id);

    documents[index].showDotLoader = true;
    this.setState({
      documents: documents,
      isApiRunning: true,
    });

    if (curr_status.status === "delete") {
      documents[index].curr_status = "delete";
    }

    const data = new FormData();
    data.append("doc_type", "perfios_bank_statement");

    if (curr_status.status !== "delete") {
      data.append("file", documents[index], documents[index].name);
      data.append("password", documents[index].password);
    }

    if (
      documents[index].curr_status === "edit" ||
      curr_status.status === "delete"
    ) {
      data.append("doc_id", documents[index].document_id);
    }

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/upload/document/${application_id}
        ${documents[index].curr_status === "edit" ? "?edit=true" : ""}
        ${documents[index].curr_status === "delete" ? "?delete=true" : ""}`,
        data
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        documents[index].showDotLoader = false;
        documents[index].status = "confirmed";
        documents[index].document_id = result.document_id;
        if (documents[index].curr_status === "edit") {
          documents[index].showButton = false;
          this.setState({
            confirmed: true,
          });
        } else if (documents[index].curr_status === "delete") {
          documents.splice(index, 1);
        } else {
          documents[index].showButton = true;
          this.setState({
            confirmed: true,
          });
        }

        this.setState(
          {
            isApiRunning: false,
            documents: documents,
          },
          () => this.handleScroll("upload")
        );
      } else {
        toast(result.error || result.message || "Something went wrong")
      }
    } catch (err) {
      console.log(err);
      documents[index].showDotLoader = false;
      this.setState({
        show_loader: false,
        documents: documents
      });
      toast("Something went wrong");
    }
  };

  handleEdit = (id, doc_id) => {
    this.setState({
      editId: id,
      doc_id: doc_id,
    });

    this.startUpload("open_file", "bank_statement");
  };

  handleDelete = (id) => {
    this.handleConfirm(id, { status: "delete" });
  };

  handleChange = (name, doc_id = "") => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, documents } = this.state;

    if (name === "password") {
      var index = documents.findIndex((item) => item.id === doc_id);

      documents[index].password = value;

      this.setState({
        documents: documents,
      });
    } else {
      form_data[name || id] = value;
      form_data[(name || id) + "_error"] = "";

      this.setState({
        form_data: form_data,
      });
    }
  };

  handleScroll = (id) => {
    setTimeout(function () {
      let element = document.getElementById(id);
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

  handleClick = async () => {
    this.sendEvents("next");
    let { form_data, bankOptions } = this.state;

    let canSubmit = true;
    let error = "";
    let errorType = "";

    if (!form_data.bank_name) {
      form_data.bank_name_error = "Please select bank name";
      canSubmit = false;
    }

    this.setState({
      form_data: form_data,
      showError: false,
    });

    if (canSubmit) {
      let bank = bankOptions.filter(
        (item) => item.value === form_data.bank_name
      );

      if (bank.length === 0) {
        toast("Please select bank name from the provided list");
        return;
      }

      try {
        this.setState({
          show_loader: true,
          loaderWithData: true,
        });

        const res = await Api.get(
          `relay/api/loan/idfc/perfios/upload/${this.state.application_id}?institution_id=${bank[0].key}`
        );

        const { result, status_code: status } = res.pfwresponse;

        let { params } = this.state;

        if (result) {
          if (params.adminPanel) {
            if (status === 200) {
              window.location.href = this.state.params.redirect_url;
            } else {
              toast(result.error || result.message || "Something went wrong");
              this.setState({
                show_loader: false,
                loaderWithData: false,
              });
            }
          } else {
            this.navigate("perfios-status");
          }
        }
      } catch (err) {
        console.log(err);
        this.setState({
          show_loader: false,
          loaderWithData: false
        });
        // toast("Something went wrong");
        this.setErrorData("submit");
        error = true;
        errorType = "form";
      }

      if (error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error,
            type: errorType,
          },
          showError: true,
        });
      }
    }
  };

  goBack = () => {
    let { params } = this.state;

    if (params.adminPanel) {
      window.location.href = this.state.params.redirect_url;
    } else {
      this.sendEvents("back");
      this.navigate("income-details");
    }
  };

  setErrorData = (type) => {
    this.setState({
      showError: false,
    });
    if (type) {
      let mapper = {
        onload: {
          handleClick1: this.getOrCreate,
          title1: this.state.title1,
          button_text1: "Retry",
        },
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
    let {
      documents,
      confirmed,
      isApiRunning,
      params,
      bankOptions,
    } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={documents.length === 0 || !confirmed || isApiRunning}
        headerData={{
          progressHeaderData: (!params.adminPanel && (!this.state.showError || !this.state.loaderWithData))
            ? this.state.progressHeaderData
            : "",
          icon: params.adminPanel ? "close" : "",
          goBack: this.goBack,
        }}
        handleClick={this.handleClick}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
        showError={this.state.showError}
        errorData={this.state.errorData}
      >
        <div className="upload-bank-statement">
          <Attention content={this.renderNotes()} />
          <FormControl fullWidth>
            <div className="InputField">
              {bankOptions.length > 0 && (
                <Autosuggests
                  parent={this}
                  width="40"
                  placeholder="Search for bank"
                  options={bankOptions}
                  id="bank_name"
                  label="Bank name"
                  name="bank_name"
                  error={this.state.form_data.bank_name_error ? true : false}
                  helperText={this.state.form_data.bank_name_error}
                  value={this.state.form_data.bank_name || ""}
                  onChange={this.handleChange("bank_name")}
                />
              )}
            </div>
          </FormControl>

          {documents.map((item, index) => (
            <div
              className="bank-statement"
              key={index + 1}
              id={item.id}
              style={{ marginBottom: "30px" }}
            >
              <div className="title">
                {index + 1}. Bank statement
                {item.showDotLoader && <DotDotLoader />}
              </div>
              <div className="sub-title" style={{ marginLeft: "12px" }}>
                <div style={{ marginBottom: "30px" }}>
                  <img
                    style={{ margin: "0 5px 0 0" }}
                    src={require("assets/tool.svg")}
                    alt=""
                  />
                  <span style={{wordBreak: 'break-all', width:'70%'}}>{item.name}</span>
                  <span className="bytes">{bytesToSize(item.size)}</span>
                </div>

                <div className="InputField">
                  <Input
                    type="password"
                    width="40"
                    label="Enter password (if any)"
                    class="password"
                    id="password"
                    name="password"
                    placeholder="XXXXXXX"
                    value={item.password || ""}
                    onChange={this.handleChange("password", item.id)}
                    disabled={item.showButton}
                  />
                </div>

                {item.status === "uploaded" && (
                  <div
                    onClick={() =>
                      !item.showDotLoader && this.handleConfirm(item.id)
                    }
                    className="generic-page-button-small"
                    style={{
                      opacity: `${item.showDotLoader ? "0.5" : "1"}`,
                    }}
                  >
                    CONFIRM
                  </div>
                )}
                {item.showButton && (
                  <div
                    className="edit-or-delete"
                    style={{
                      opacity: `${item.showDotLoader ? "0.5" : "1"}`,
                    }}
                  >
                    <div
                      onClick={() =>
                        !item.showDotLoader &&
                        this.handleEdit(item.id, item.document_id)
                      }
                      className="generic-page-button-small"
                    >
                      EDIT
                    </div>

                    <div
                      onClick={() =>
                        !item.showDotLoader && this.handleDelete(item.id)
                      }
                      className="generic-page-button-small"
                    >
                      DELETE
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {confirmed && (
            <div className="upload-bank-statement" id="upload">
              <div
                className="pdf-upload"
                onClick={() => this.startUpload("open_file", "bank_statement")}
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
                      code.replace(
                        /fill=".*?"/g,
                        "fill=" + getConfig().styles.secondaryColor
                      )
                    }
                    src={plus}
                  />
                </span>
                {documents.length !== 0 ? "ADD FILE" : "UPLOAD FILE"}
                {documents.length === 0 && (
                  <span className="sub-text">Max file size 6 mb</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default UploadBank;
