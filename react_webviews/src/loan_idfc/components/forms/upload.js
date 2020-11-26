import React, { Component } from "react";
import Container from "../../common/Container";
// import { nativeCallback } from "utils/native_callback";
import { bytesToSize } from "utils/validators";
import { getConfig } from "utils/functions";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import toast from "../../../common/ui/Toast";
import $ from "jquery";
import DotDotLoader from "common/ui/DotDotLoader";
import Api from "utils/api";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      fileUploaded: false,
      documents: [],
      confirmed: true,
      editId: null,
      application_id: 774,
      count: 1
    };

    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {}

  onload = () => {};

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

    if (editId >= 0) {
      documents[editId] = file;
    }

    if (editId === undefined || editId === null) {
      documents.push(file);
    }

    this.setState({
      fileUploaded: true,
      documents: documents,
      confirmed: false,
      editId: null,
    });
  };

  handleConfirm = async (id) => {
    let { documents, application_id } = this.state;
    console.log(id)

    var index = documents.findIndex(item => item.id === id)

    const data = new FormData();
    data.append("doc_type", "perfios_bank_statement");
    data.append("file", documents[index]);
    data.append("doc_id", id);

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/document/upload/${application_id}`,
        data
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200 && result.message) {
        documents[id].status = "confirmed";

        this.setState({
          confirmed: true,
          documents: documents,
        });
      } else {
        this.setState({
          show_loader: false,
        });

        toast(result.error || result.message || "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  };

  handleEdit = (id) => {
    let { documents } = this.state;
    this.setState({
      editId: id,
    });
    this.startUpload("upload_doc");
  };

  handleDelete = (id) => {
    this.state.documents.splice(id, 1);
    this.setState({
      documents: this.state.documents,
    });
  };

  render() {
    let { documents, confirmed } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload bank statements"
        buttonTitle="SUBMIT AND CONTINUE"
        disable={true}
      >
        <div className="upload-bank-statement">
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

              {item.status === "uploaded" && (
                <div
                  disable
                  onClick={() => this.handleConfirm(item.id)}
                  className="generic-page-button-small"
                >
                  CONFIRM
                </div>
              )}
              {item.status === "confirmed" && (
                <div className="edit-or-delete">
                  <div
                    onClick={() => this.handleEdit(index)}
                    className="generic-page-button-small"
                  >
                    EDIT
                  </div>

                  <div
                    onClick={() => this.handleDelete(index)}
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

export default Upload;
