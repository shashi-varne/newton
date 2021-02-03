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
import { formatDate, dobFormatTest, calculateAge, IsFutureDate } from "utils/validators";
import { FormControl } from "material-ui/Form";
import { getUrlParams, isValidDate } from "utils/validators";
import Autosuggests from "../../../common/ui/Autosuggest";

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
      title: "Income and loan offer",
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
        title: "BT details",
        status: "pending",
      });
    }

    let loaderData = {
      title: `Hang on, while IDFC finishes analysing your last 3 months' bank statements`,
      subtitle: "It may take 10 to 15 seconds!",
    };

    if (this.state.params.adminPanel) {
      this.setState({
        application_id: this.state.params.application_id,
      });
    }

    this.setState({
      loaderData: loaderData,
      progressHeaderData: progressHeaderData,
      employment_type: application_info.employment_type || '',
    });
  };

  renderNotes = () => {
    let notes = [
      "Attach latest bank statements of the same account where your salary gets credited every month",
      "Ensure the bank statements are of the last 3 months from this month",
      "Files must be original and should be uploaded in a PDF format",
      "Share respective passwords if your statements are password protected",
      "Upload multiple statements of the same bank account with each file not exceeding 6 MB",
    ];

    if (this.state.employment_type === 'self_employed') {
      notes[0] = "Provide your latest bank statements from your savings or current account to get the best loan offer"
    }

    return (
      <div style={{ lineHeight: "15px" }}>
        {notes.map((item, index) => (
          <div style={{ marginTop: index !== 0 && "20px" }} key={index}>
            {`${index + 1}. ${item}`}
          </div>
        ))}
      </div>
    );
  };

  sendEvents(user_action) {
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: "upload bank statement",
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

    let duplicate = documents.filter(item => {
      return item.name === file.name
    })
    
    if (editId === "") {
      duplicate.length === 0 && documents.push(file) 
    } else if (duplicate.length === 0) {
      var index = documents.findIndex((item) => item.id === editId);
      file.curr_status = "edit";
      file.document_id = doc_id;
      documents[index] = file;
    }

    this.setState({
      fileUploaded: true,
      documents: documents,
      confirmed: (duplicate.length !== 0) ? true : false,
      editId: "",
      count: count,
    });
  };

  save(file) {
    let acceptedType = ["application/pdf"];

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select pdf file only");
      return;
    }

    let { documents, editId, doc_id, count } = this.state;
    file.doc_type = file.type;

    file.status = "uploaded";
    file.name = !file.file_name ? `bank statement ${count}` : `${file.file_name}`;
    file.id = count++;

    if (!file.name.includes(".pdf")) {
      file.name = `${file.name}.pdf`;
    }

    let duplicate = documents.filter(item => {
      return item.name === file.name
    })

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
      confirmed: (duplicate.length !== 0) ? true : false,
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

        this.setState({
          isApiRunning: false,
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

    this.startUpload("open_file", "bank_statement");
  };

  handleDelete = (id) => {
    this.handleConfirm(id, { status: "delete" });
  };

  handleChange = (name, doc_id = "") => (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, documents } = this.state;

    if (!name) {
      if (!dobFormatTest(value)) {
        return;
      }

      let input = document.getElementById(id);
      input.onkeyup = formatDate;
    }

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

  handleClick = async () => {
    this.sendEvents("next");
    let { form_data, bankOptions } = this.state;

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
      } else  if(key_check.indexOf('date') >= 0 && !isValidDate(form_data[key_check]))  {
          canSubmit = false;
          form_data[key_check + "_error"] = first_error + "valid " + keysMapper[key_check];
      } else  if(
        key_check === 'start_date' && 
        (
          calculateAge(form_data['start_date'], true).days < 90 
          // calculateAge(form_data['start_date'], true).days > 97
        )
        )  {
          canSubmit = false;
          
          form_data[key_check + "_error"] = keysMapper[key_check] + " must be 3 months from the current date";
      } else if(
        key_check === 'end_date' && 
        form_data[key_check]
         && 
        (
          calculateAge(form_data['end_date'], true).days < 0
        //   // || 
        //   // calculateAge(form_data['end_date'], true).days > 4
        )
        ) {
          canSubmit = false;
          console.log(calculateAge(form_data['end_date'], true).days)
          form_data[key_check + "_error"] = keysMapper[key_check] + " must be 3 days before the current date";
      }
    }

    let startDate_month = calculateAge(form_data.start_date, true).months >= 3;
    let endDate_days = calculateAge(form_data.end_date, true).days <= 3;

    let month = calculateAge(form_data.start_date, true).months;
    // eslint-disable-next-line radix
    let startDate = form_data.start_date.substring(0, 2) === "01";

    if (!startDate_month || (month === 3 && !startDate) || form_data.start_date.length !== 10) {
      form_data.start_date_error = "This date must be 3 months prior to the current month.";
      canSubmit = false;
    }

    if (!endDate_days || form_data.end_date.length !== 10 || IsFutureDate(form_data.end_date)) {
      form_data.end_date_error = "This date must be 3 days prior to the current date.";
      canSubmit = false;
    }

    this.setState({
      form_data: form_data,
    });

    if (canSubmit) {
      let bank = bankOptions.filter((item) => item.value === form_data.bank_name);

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
              window.location.href = this.state.params.redirect;
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
        });
        toast("Something went wrong");
      }
    }
  };

  goBack = () => {
    
    let { params } = this.state;

    if (params.adminPanel) {
      window.location.href = this.state.params.redirect;
    } else {
      this.sendEvents('back');
      this.navigate("income-details");
    }
  };

  render() {
    let { documents, confirmed, isApiRunning, params, bankOptions } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={documents.length === 0 || !confirmed || isApiRunning}
        headerData={{
          progressHeaderData: !params.adminPanel
            ? this.state.progressHeaderData
            : "",
          icon: params.adminPanel ? "close" : "",
          goBack: this.goBack,
        }}
        handleClick={this.handleClick}
        loaderWithData={this.state.loaderWithData}
        loaderData={this.state.loaderData}
      >
        <div className="upload-bank-statement">
          <Attention content={this.renderNotes()} />
          <FormControl fullWidth>
            <div className="InputField">
              {bankOptions.length > 0  && <Autosuggests
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
                />}
            </div>

            <div className="InputField">
              <Input
                error={!!this.state.form_data.start_date_error}
                helperText={this.state.form_data.start_date_error || "This date must be 3 months prior to the current month."}
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
                helperText={this.state.form_data.end_date_error || "This date must be 3 days prior to the current date."}
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
          ))}

          {confirmed && (
            <div className="upload-bank-statement">
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