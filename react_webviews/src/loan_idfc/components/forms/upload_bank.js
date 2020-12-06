import React, { Component } from "react";
import Container from "../../common/Container";
import { nativeCallback } from "utils/native_callback";
import Attention from "../../../common/ui/Attention";
import { initialize } from "../../common/functions";
import { bytesToSize } from "utils/validators";
import { getConfig } from "utils/functions";
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
      documents: [],
      password: "",
      confirmed: true,
      editId: null,
      count: 1,
      form_data: {},
      bankOptions: [],
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

  onload = async () => {
    try {
      this.setState({
        show_loader: true,
      });

      const res = await Api.get("relay/api/loan/idfc/perfios/institutionlist");

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        let banklist = result.data;

        let bankOptions = banklist.map((item) => {
          return { name: item.institution_name, value: item.institution_id };
        });

        this.setState({
          bankOptions: bankOptions,
        });
      } else {
        toast(result.error || result.message || "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }

    this.setState({
      show_loader: false,
    });
  };

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

  startUpload(method_name) {
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

    let { documents, editId, count } = this.state;
    file.doc_type = file.type;
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
      confirmed: false,
      editId: null,
      count: count,
    });
  };

  handleConfirm = async (id) => {
    let { documents, application_id } = this.state;

    var index = documents.findIndex((item) => item.id === id);

    var isedited = documents[index].edited;
    console.log(documents[index].edited);

    const data = new FormData();
    data.append("doc_type", "perfios_bank_statement");
    data.append("file", documents[index]);
    data.append("doc_id", id);

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/upload/document/${application_id}${
          isedited ? "?edit=true" : ""
        }`,
        data
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        documents[index].status = "confirmed";
        documents[index].document_id = result.document_id;
        this.setState({
          confirmed: true,
          documents: documents,
        });
        console.log(result.document_id);
        console.log(documents[index].document_id);
      }

      //   toast(result.error || result.message || "Something went wrong!");
      // }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, password } = this.state;

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(id);
      input.onkeyup = formatDate;
    }

    if (name === "password") {
      password = value;

      this.setState({
        password: password,
      });
    } else {
      form_data[name || id] = value;
      form_data[(name || id) + "_error"] = "";

      this.setState({
        form_data: form_data,
      });
    }
  };

  handleEdit = (id) => {
    console.log(id)
    this.setState({
      editId: id,
    });
    this.startUpload("upload_doc");
  };

  handleDelete = (id) => {
    let { documents } = this.state;
    let index = documents.findIndex((item) => item.id === id);

    documents.splice(index, 1);
    this.setState({
      documents: this.state.documents,
    });
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
    let { documents, confirmed } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={documents.length === 0}
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
                {item.status === "uploaded" && item.status !== "confirmed" && (
                  <DotDotLoader />
                )}
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
                  value={this.state.password || ""}
                  onChange={this.handleChange("password")}
                />
              </div>

              {item.status === "uploaded" && (
                <div
                  onClick={() => this.handleConfirm(item.id)}
                  className="generic-page-button-small"
                >
                  CONFIRM
                </div>
              )}

              {item.status === "confirmed" && (
                <div className="edit-or-delete">
                  <div
                    onClick={() => this.handleEdit(item.id)}
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
                onClick={() => this.startUpload("upload_doc")}
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
