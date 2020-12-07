import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import Attention from "../../../common/ui/Attention";
import { initialize } from "../../common/functions";
import { bytesToSize } from "utils/validators";
import { getConfig } from "utils/functions";
import { getBase64 } from 'utils/functions';
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import toast from "../../../common/ui/Toast";
import $ from "jquery";
import DotDotLoader from "common/ui/DotDotLoader";
import Api from "utils/api";
import Input from "../../../common/ui/Input";
import { formatDate, dobFormatTest } from "utils/validators";
import { FormControl } from "material-ui/Form";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";

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
      doc_id: "",
      isApiRunning: false
    };

    this.native_call_handler = this.native_call_handler.bind(this);
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();

    let progressHeaderData = {
      title: "Income and loan offer",
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

  componentDidMount() {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: 'native_receiver_image',
        show_loader: function (show_loader) {

          that.showLoaderNative();
        }
      });
    }
  }

  showLoaderNative() {
    this.setState({
      show_loader: true
    })
  }

  onload = () => {};

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
          <div style={{ marginTop: index !== 0 && "20px" }} key={index}>
            {item}
          </div>
        ))}
      </div>
    );
  };

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

  

  native_call_handler(method_name, doc_type) {
    console.log(doc_type)
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
  }

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type) {
    console.log(doc_type)
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
    console.log(file);

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

    if (editId === "") {
      documents.push(file);
    } else {
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
    console.log(file)

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select pdf file only");
      return;
    }

    let { documents, editId, count } = this.state;
    file.doc_type = file.type;
    file.name = `Bank_statement_${count}.pdf`
    file.status = "uploaded";
    file.id = count++;

    if (editId !== null) {
      var index = documents.findIndex((item) => item.id === editId);
      file.id = editId;
      file.edited = true;
      documents[index] = file;
    }

    if (editId === undefined || editId === null) {
      documents.push(file);
    }

    this.setState({
      fileUploaded: true,
      documents: documents,
      show_loader: false,
      confirmed: false,
      editId: null,
      count: count,
    });
  }

  handleConfirm = async (id, curr_status = {}) => {
    let { documents, application_id } = this.state;

    var index = documents.findIndex((item) => item.id === id);

    documents[index].showDotLoader = true;
    this.setState({
      documents: documents,
      isApiRunning: true
    });

    console.log(documents[index]);

    if (curr_status.status === "delete") {
      documents[index].curr_status = "delete";
    }

    const data = new FormData();
    data.append("doc_type", "perfios_bank_statement");

    if (curr_status.status !== "delete") {
      data.append("file", documents[index]);
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
        } else if (documents[index].curr_status === "delete") {
          documents.splice(index, 1);
        } else {
          documents[index].showButton = true;
        }

        this.setState({
          confirmed: true,
          documents: documents,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  };

  handleEdit = (id, doc_id) => {
    this.setState({
      editId: id,
      doc_id: doc_id,
    });

    this.startUpload("open_gallery");
  };

  handleDelete = (id) => {
    this.handleConfirm(id, { status: "delete" });
  };

  handleChange = (name, doc_id = "") => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, password, documents } = this.state;

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(id);
      input.onkeyup = formatDate;
    }

    if (name === "password") {
      var index = documents.findIndex((item) => item.id === doc_id);

      documents[index].password = value

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

  handleClick = async () => {
    let { form_data } = this.state;

    let { bank_name, start_date, end_date } = this.state.form_data;
    let keys_to_check = ["bank_name", "start_date", "end_date"];

    let keysMapper = {
      bank_name: "bank name",
      start_date: "start date",
      end_date: "end date",
    };
    let canSubmit = true;

    let selectTypeInput = ["bank_name"];

    for (var i = 0; i < keys_to_check.length; i++) {
      let key_check = keys_to_check[i];
      let first_error =
        selectTypeInput.indexOf(key_check) !== -1
          ? "Please select "
          : "Please enter ";
      if (!form_data[key_check]) {
        form_data[key_check + "_error"] = first_error + keysMapper[key_check];
        canSubmit = false;
      }
    }

    this.setState({
      form_data: form_data,
    });

    if (canSubmit) {
      try {
        this.setState({
          show_loader: true,
        });

        const res = await Api.get(
          `relay/api/loan/idfc/perfios/upload/${this.state.application_id}?institution_id=${bank_name}`
        );

        const { result, status_code: status } = res.pfwresponse;

        if (result) {
          console.log(result);
          this.navigate("perfios-status");
          // } else {
          // toast(result.error || result.message || "Something went wrong!");
          // this.onload();
        }
      } catch (err) {
        console.log(err);
        toast("Something went wrong");
      }
    }
  };

  render() {
    let { documents, confirmed, count, isApiRunning } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={documents.length === 0 || isApiRunning}
        headerData={{
          progressHeaderData: this.state.progressHeaderData,
        }}
        handleClick={this.handleClick}
      >
        <div className="upload-bank-statement">
          <Attention content={this.renderNotes()} />
          <FormControl fullWidth>
            <div className="InputField">
              <DropdownWithoutIcon
                width="40"
                options={this.state.bankOptions}
                id="bank_name"
                label="Bank name"
                dataType="AOB"
                error={this.state.form_data.bank_name_error ? true : false}
                helperText={this.state.form_data.bank_name_error}
                value={this.state.form_data.bank_name || ""}
                name="bank_name"
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
              <div className="sub-title">
                <img
                  style={{ margin: "0 5px 0 12px" }}
                  src={require("assets/tool.svg")}
                  alt=""
                />
                {item.name}
                <span className="bytes">{bytesToSize(item.size)}</span>
              </div>

              <div className="InputField">
                <Input
                  // error={!!this.state.password_error}
                  // helperText={this.state.password}
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
                    onClick={() => this.handleEdit(item.id, item.document_id)}
                    className="generic-page-button-small"
                  >
                    EDIT
                  </div>

                  <div
                    onClick={() => this.handleDelete(item.id)}
                    className="generic-page-button-small"
                  >
                    DELETE
                  </div>
                </div>
              )}
            </div>
          ))}

          {confirmed && (
            <div className="upload-bank-statement">
              <div
                className="pdf-upload"
                onClick={() => this.startUpload("open_file", 'bank_statement'+count)}
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
                        "fill=" + getConfig().secondary
                      )
                    }
                    src={plus}
                  />
                </span>
                {documents.length !== 0 ? "ADD FILE" : "UPLOAD FILE"}
              </div>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default UploadBank;
