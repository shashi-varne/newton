import React, { Component } from "react";
import toast from "../../../common/ui/Toast";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { getConfig } from "../../../utils/functions";
import { getBase64 } from "utils/functions";
import Api from "utils/api";
// import DotDotLoader from "common/ui/DotDotLoader";
import $ from "jquery";
import { storageService } from "../../../utils/validators";
import { nativeCallback } from "utils/native_callback";

import {
  renderHtmlCamera,
  renderNativeCamera,
  renderMultipleHtmlCamera,
  renderMultipleNativeCamera,
} from "./render_camera";

class DocumentUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "document_upload",
      form_data: {},
      image_data: {},
      totalUpload: "",
      docList: [],
      documents: [],
      disbableButton: true,
      docs: [],
      category: "",
      doc_type: "",
      doc_id: "",
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
    this.renderHtmlCamera = renderHtmlCamera.bind(this);
    this.renderNativeCamera = renderNativeCamera.bind(this);
    this.renderMultipleHtmlCamera = renderMultipleHtmlCamera.bind(this);
    this.renderMultipleNativeCamera = renderMultipleNativeCamera.bind(this);
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

  onload = () => {
    let category = storageService().get("category");
    let docList = this.state.docList;

    if (docList.length !== 0) {
      let selectedIndex = docList.findIndex(
        (item) => item.category === category
      );

      let docs = docList[selectedIndex].docs.map((item) => {
        return item.doc_display_name;
      });

      let { form_data, totalUpload, image_data, documents } = this.state;

      let docsMap = docList[selectedIndex].docs.map((item) => {
        return {
          name: item.doc_display_name,
          value: item.pages || "3",
          form_data: form_data,
        };
      });

      form_data.doc_name =
        (docList[selectedIndex].doc_checklist[0] &&
          docList[selectedIndex].doc_checklist[0].subtype) ||
        "";

      let doc_checklist =
        (docList[selectedIndex].doc_checklist[0] &&
          docList[selectedIndex].doc_checklist[0].docs) ||
        [];

      docsMap.forEach((item) => {
        if (item.name === form_data.doc_name) {
          totalUpload = item.value;
        }
      });

      if (doc_checklist.length !== 0) {
        let file1, file2, file3;
        for (var i = doc_checklist.length - 1; i >= 0; i--) {
          if (
            doc_checklist[i].doc_type === "doc1" &&
            (!image_data.doc1 || documents.length === 2)
          ) {
            if (totalUpload < 3) {
              image_data.doc1 = {
                uploaded: true,
                integrated: true,
                imageBaseFile: doc_checklist[i].doc_url,
              };
            } else {
              file1 = {
                uploaded: true,
                integrated: true,
                imageBaseFile: doc_checklist[i].doc_url,
                category_id: category,
                id: doc_checklist[i].doc_id,
                checklist_doc_type: doc_checklist[i].doc_type,
                name:
                  doc_checklist[i].display_name +
                  "." +
                  doc_checklist[i].extension,
              };

              documents.push(file1);
            }
          }

          if (
            doc_checklist[i].doc_type === "doc2" &&
            (!image_data.doc2 || documents.length === 1)
          ) {
            if (totalUpload < 3) {
              image_data.doc2 = {
                uploaded: true,
                integrated: true,
                imageBaseFile: doc_checklist[i].doc_url,
              };
            } else {
              file2 = {
                uploaded: true,
                integrated: true,
                imageBaseFile: doc_checklist[i].doc_url,
                category_id: category,
                id: doc_checklist[i].doc_id,
                checklist_doc_type: doc_checklist[i].doc_type,
                name:
                  doc_checklist[i].display_name +
                  "." +
                  doc_checklist[i].extension,
              };

              documents.push(file2);
            }
          }

          if (doc_checklist[i].doc_type === "doc3" && documents.length === 0) {
            file3 = {
              uploaded: true,
              integrated: true,
              imageBaseFile: doc_checklist[i].doc_url,
              category_id: category,
              id: doc_checklist[i].doc_id,
              checklist_doc_type: doc_checklist[i].doc_type,
              name:
                doc_checklist[i].display_name +
                "." +
                doc_checklist[i].extension,
            };

            documents.push(file3);
          }
        }

        this.setState({
          disbableButton: false,
        });
      }

      this.setState({
        docList: docList[selectedIndex],
        docs: docs,
        docsMap: docsMap,
        documents: documents,
        totalUpload: totalUpload,
        category: category,
      });
    }
  };

  sendEvents(user_action) {
    let type = (this.state.type === "open_camera" ? "camera" : "gallery") || "";
    let eventObj = {
      event_name: "idfc_lending",
      properties: {
        user_action: user_action,
        screen_name: `${this.state.docList.category_name} doc` || "doc_upload",
        doc_type: this.state.form_data.doc_name,
        type: type,
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
              docName: this.doc_name,
              show_loader: true,
            });
            switch (file.type) {
              case "application/pdf":
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
              case "image/bmp":
                that.save(file, this.doc_name);
                break;
              default:
                alert("Please select pdf/img file");
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

  showLoaderNative() {
    this.setState({
      show_loader: true,
    });
  }

  handleChange = (name) => (event) => {
    let value = event.target ? event.target : event;

    let { form_data, docsMap, totalUpload } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    docsMap.forEach((item) => {
      if (item.name === value) {
        totalUpload = item.value;
      }
    });

    this.setState({
      form_data: form_data,
      totalUpload: totalUpload,
    });
  };

  openCameraWeb(id = "") {
    if (!id) {
      $("input").trigger("click");
    } else {
      $(`#${id}`).trigger("click");
    }
  }

  startUpload(method_name, type = "", name = "", id = "") {
    this.setState({
      type: method_name,
      doc_type: type,
    });

    if (id) {
      this.setState({
        doc_id: id,
      });
    }

    if (getConfig().html_camera && method_name !== "open_file") {
      this.openCameraWeb(type);
    } else if (getConfig().html_camera && method_name === "open_file") {
      this.openCameraWeb();
    } else {
      this.native_call_handler(method_name, type, name);
    }
  }

  save = (file, name) => {
    let document = this.state.form_data.doc_name;

    let { category, doc_type, documents, totalUpload, image_data } = this.state;

    let ext = file.type.split("/")[1];

    if (file.file_name === undefined) {
      name = "Image_" + doc_type.substring(3, 1) + "." + ext;
    }
    

    if (!file.file_name.includes(ext)) {
      name = file.file_name + "." + ext;
    }

    file.name = name;
    file.category_id = category;
    file.checklist_doc_type = doc_type;
    file.doc_name = document;
    file.doc_type = file.type;

    let that = this;
    getBase64(file, function (img) {
      file.imageBaseFile = img;
      that.uploadDocument(file, doc_type);

      if (totalUpload < 3) {
        image_data[doc_type] = file;
      } else {
        documents.push(file);
      }

      that.setState({
        documents: documents,
        image_data: image_data,
        show_loader: false,
        fileUploaded: true,
        disbableButton: true,
      });
    });
  };

  getPdf = (e) => {
    e.preventDefault();
    let file = e.target.files[0] || {};
    let doc_name = this.state.form_data.doc_name;

    let { category, doc_type, doc_id } = this.state;

    file.doc_name = doc_name;
    file.category_id = category;
    file.checklist_doc_type = doc_type;

    let acceptedType = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/bmp",
    ];

    if (
      Object.keys(file).length !== "0" &&
      acceptedType.indexOf(file.type) === -1
    ) {
      toast("Please select pdf file only");
      return;
    }

    let { documents, count } = this.state;
    if (Object.keys(file).length !== "0") {
      file.doc_type = file.type;
      file.status = "uploaded";
      file.id = count++;

      let that = this;
      getBase64(file, function (img) {
        file.imageBaseFile = img;

        if (doc_id === "") {
          that.uploadDocument(file);
          documents.push(file);
        } else {
          var index = documents.findIndex(
            (item) => item.document_id === doc_id
          );
          file.document_id = doc_id;
          that.editDocument(file);
          documents[index] = file;
        }

        that.setState({
          fileUploaded: true,
          documents: documents,
          disbableButton: true,
          doc_id: "",
        });
      });
    }
  };

  getPhoto = (e) => {
    e.preventDefault();

    let { image_data, category, doc_type } = this.state;
    image_data[doc_type] = {};
    let doc_name = this.state.form_data.doc_name;

    let file = e.target.files[0];

    file.doc_name = doc_name;
    file.category_id = category;
    file.checklist_doc_type = doc_type;

    let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select image file only");
      return;
    }

    let that = this;
    file.doc_type = doc_type;

    getBase64(file, function (img) {
      file.imageBaseFile = img;
      file.uploaded = true;
      image_data[doc_type] = file;
      that.uploadDocument(image_data[doc_type], doc_type);

      that.setState({
        image_data: image_data,
      });
    });
  };

  uploadDocument = async (file, type) => {
    let {
      image_data,
      totalUpload,
      disbableButton,
      documents,
      category,
    } = this.state;

    const data = new FormData();
    data.append("doc_type", file.doc_name);
    data.append("file", file, file.name);
    data.append("category_id", category);
    data.append("checklist_doc_type", file.checklist_doc_type);

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/upload/document/${this.state.application_id}`,
        data
      );

      const { status_code: status, result } = res.pfwresponse;

      if (status === 200) {
        if (totalUpload < 3) {
          image_data[type].integrated = true;
        } else {
          let index = documents.findIndex(
            (item) => item.checklist_doc_type === file.checklist_doc_type
          );
          documents[index].id = result.document_id;

          disbableButton = false;
        }

        this.setState({
          image_data: image_data,
          documents: documents,
          disbableButton: disbableButton,
        });
      }
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }
  };

  deleteDocument = async (index, file) => {
    let { documents } = this.state;

    const data = new FormData();
    data.append("doc_type", file.doc_type);
    data.append("doc_id", file.id);
    data.append("category_id", file.category_id);
    data.append("checklist_doc_type", file.checklist_doc_type);

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/upload/document/${this.state.application_id}?delete=true`,
        data
      );

      const { status_code: status, result } = res.pfwresponse;

      if (status === 200) {
        let index = documents.findIndex(
          (item) => item.checklist_doc_type === file.checklist_doc_type
        );
        documents.splice(index, 1);

        this.setState({
          documents: documents,
        });
      } else {
        toast(result.error);
      }
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }
  };

  handleClick = () => {
    this.sendEvents("next");
    this.navigate("doc-list");
  };

  render() {
    let { image_data, documents, totalUpload, disbableButton } = this.state;

    if (totalUpload < 3 && Object.keys(image_data).length !== totalUpload) {
      for (var i in image_data) {
        if (!image_data[i].integrated) {
          disbableButton = true;
        } else {
          disbableButton = false;
        }
      }
    }

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title={this.state.docList.category_name}
        buttonTitle="CONTINUE"
        disable={disbableButton}
        handleClick={this.handleClick}
      >
        <div className="idfc-document-upload">
          <div className="InputField">
            <DropdownWithoutIcon
              width="40"
              options={this.state.docs}
              id="doc_name"
              label="Select proof type"
              error={this.state.form_data.doc_name_error ? true : false}
              helperText={this.state.form_data.doc_name_error}
              value={this.state.form_data.doc_name || ""}
              name="doc_name"
              onChange={this.handleChange("doc_name")}
            />
          </div>

          {totalUpload === "1" && (
            <div className="loan-mandate-pan" style={{ marginBottom: "50px" }}>
              {getConfig().html_camera && this.renderHtmlCamera("doc1")}
              {!getConfig().html_camera && this.renderNativeCamera("doc1")}
            </div>
          )}

          {totalUpload === "2" && (
            <div>
              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera("doc1")}
                {!getConfig().html_camera && this.renderNativeCamera("doc1")}
              </div>

              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera("doc2")}
                {!getConfig().html_camera && this.renderNativeCamera("doc2")}
              </div>
            </div>
          )}

          {totalUpload === "3" && (
            <div>
              {documents.map((item, index) => (
                <div key={index}>
                  <div
                    className="multiple-upload"
                    key={index + 1}
                    style={{ marginBottom: "30px" }}
                  >
                    <div className="sub-title">
                      <img
                        style={{ margin: "0 5px 0 12px" }}
                        src={require("assets/tool.svg")}
                        alt=""
                      />
                      {item.name}
                      <span
                        style={{ float: "right" }}
                        onClick={() => this.deleteDocument(index, item)}
                      >
                        <img
                          id={item.doc_type}
                          src={require(`assets/deleted.svg`)}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {documents.length < 3 && (
                <div className="upload-bank-statement">
                  {/* <div
                    className="pdf-upload"
                    onClick={() =>
                      this.startUpload(
                        "open_file",
                        `doc${documents.length + 1}`,
                        `document_${documents.length + 1}`
                      )
                    }
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
                  </div> */}
                  <div
                    className="loan-mandate-pan"
                    style={{ marginBottom: "50px" }}
                  >
                    {getConfig().html_camera &&
                      this.renderMultipleHtmlCamera(
                        `doc${documents.length + 1}`
                      )}
                    {!getConfig().html_camera &&
                      this.renderMultipleNativeCamera(
                        `doc${documents.length + 1}`
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default DocumentUpload;
