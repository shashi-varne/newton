import React, { Component } from "react";
import toast from "../../../common/ui/Toast";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { StorageService } from "utils/validators";
import { getConfig } from "../../../utils/functions";
import camera_green from "assets/take_pic_green.svg";
import gallery_green from "assets/go_to_gallery_green.svg";
import text_error_icon from "assets/text_error_icon.svg";
import { nativeCallback } from "utils/native_callback";
import { getBase64 } from "utils/functions";
import Api from "utils/api";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import camera_grey from "assets/take_pic_grey.svg";
import $ from "jquery";
import { storageService } from "../../../utils/validators";
import { bytesToSize } from "utils/validators";
import Input from "../../../common/ui/Input";

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
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
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

      form_data.doc_name = docList[selectedIndex].doc_checklist[0].subtype;

      let doc_checklist = docList[selectedIndex].doc_checklist[0].docs;

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
            (!image_data.doc1 || documents.length === 0)
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
                name: doc_checklist[i].doc_type + "." +doc_checklist[i].extension,
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
                name: doc_checklist[i].doc_type + "." +doc_checklist[i].extension,
              };

              documents.push(file2);
            }
          }

          if (doc_checklist[i].doc_type === "doc3" && documents.length === 2) {
            file3 = {
              uploaded: true,
              integrated: true,
              name: doc_checklist[i].doc_type + "." +doc_checklist[i].extension,
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
        category: category,
        documents: documents,
        totalUpload: totalUpload,
      });
    }
  };

  native_call_handler(method_name, doc_type, doc_name) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: "doc",
        doc_type: doc_type,
        doc_name: doc_name,
        // doc_side: side,
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

    console.log(value);

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

  startUpload(method_name, type = "", name = "") {
    this.setState({
      type: method_name,
      doc_type: type,
    });

    if (getConfig().html_camera) {
      this.openCameraWeb(type);
    } else {
      // this.native_call_handler(method_name, type, name, id);
    }
  }

  save = (file, name) => {
    let document = this.state.form_data.doc_name;

    let { category, doc_type, documents, totalUpload, image_data } = this.state;
    console.log(file);
    let ext = file.type.split("/")[1];
    name = document.split(" ").join("_") + "." + ext;

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

    let { category, doc_type } = this.state;

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
        that.uploadDocument(file);
        console.log(file);
        documents.push(file);

        that.setState({
          fileUploaded: true,
          documents: documents,
          disbableButton: true,
        });
      });
    }
  };

  getPhoto = (e) => {
    e.preventDefault();

    let { image_data, category, doc_type } = this.state;
    let id = e.target.id;
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
      console.log(file);
      that.uploadDocument(image_data[doc_type], doc_type);

      that.setState({
        image_data: image_data,
      });
    });
  };

  uploadDocument = async (file, type) => {
    let { image_data, totalUpload, disbableButton } = this.state;

    let ext = file.type.split("/")[1];

    const data = new FormData();
    data.append("doc_type", file.doc_name);
    data.append("file", file, file.name + ext);
    data.append("category_id", file.category_id);
    data.append("checklist_doc_type", file.checklist_doc_type);

    try {
      const res = await Api.post(
        `relay/api/loan/idfc/upload/document/${this.state.application_id}`,
        data
      );

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        if (totalUpload < 3) {
          image_data[type].integrated = true;
        } else {
          disbableButton = false;
        }

        this.setState({
          image_data: image_data,
          disbableButton: disbableButton,
        });
      }
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }
  };

  renderHtmlCamera(type) {
    let { image_data } = this.state;

    return (
      <div>
        {!image_data[type] && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "10px 0px 0px 0px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            <div>upload document</div>
            <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
              <div
                onClick={() => this.startUpload("open_camera", type)}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.getPhoto}
                  id={type ? type : "myFile"}
                />
                <img src={camera_green} alt="PAN"></img>
                <div style={{ color: "#28b24d" }}>Click here to upload</div>
              </div>
            </div>
          </div>
        )}
        {image_data[type] && image_data[type].uploaded && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "0px 0px 0px 0px",
              textAlign: "center",
            }}
          >
            <div>
              <img
                style={{ width: "100%", height: 150 }}
                src={image_data[type].imageBaseFile || ""}
                alt="PAN"
              />
            </div>
            <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
              <div
                onClick={() => this.startUpload("open_camera", type)}
                style={{
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.getPhoto}
                  id={type ? type : "myFile"}
                />
                <img src={camera_grey} alt="PAN"></img>
                <div style={{ color: "#b4b4b4" }}>Click here to upload new</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderNativeCamera(type) {
    let { image_data } = this.state;
    return (
      <div>
        {!image_data[type] && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "10px 0px 0px 0px",
              textAlign: "center",
            }}
          >
            <div>Front side of document</div>
            <div
              style={{
                margin: "20px 0 20px 0",
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              <div
                onClick={() => this.startUpload("open_camera", type)}
                style={{
                  width: "50%",
                  float: "left",
                  textAlign: "center",
                  borderRight: "1px solid #e1e1e1",
                }}
              >
                <img src={camera_green} alt="OTM"></img>
                <div style={{ color: "#28b24d", fontWeight: 600 }}>
                  OPEN CAMERA
                </div>
              </div>
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                style={{ textAlign: "center" }}
              >
                <img src={gallery_green} alt="OTM"></img>
                <div style={{ color: "#28b24d", fontWeight: 600 }}>
                  GO TO GALLERY
                </div>
              </div>
            </div>
          </div>
        )}
        {image_data[type] && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "0px 0px 0px 0px",
              textAlign: "center",
            }}
          >
            <div>
              <img
                style={{ width: "100%", height: 150 }}
                src={
                  image_data[type].imageBaseFile ||
                  ""
                }
                alt="PAN"
              />
            </div>
            <div
              style={{
                margin: "20px 0 20px 0",
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              <div
                onClick={() => this.startUpload("open_camera", type)}
                style={{
                  width: "50%",
                  float: "left",
                  textAlign: "center",
                  borderRight: "1px solid #e1e1e1",
                }}
              >
                <div style={{ color: "#28b24d", fontWeight: 600 }}>
                  OPEN CAMERA
                </div>
              </div>
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                style={{ textAlign: "center" }}
              >
                <div style={{ color: "#28b24d", fontWeight: 600 }}>
                  GO TO GALLERY
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  handleClick = () => {
    this.navigate("doc-list");
  };

  render() {
    let {
      docList,
      selectedIndex,
      image_data,
      documents,
      docs,
      totalUpload,
      disbableButton,
    } = this.state;

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

              <div style={{ display: "none" }}>
                {getConfig().html_camera && this.renderHtmlCamera()}
                {!getConfig().html_camera && this.renderNativeCamera()}
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
                      {/* <span className="bytes">{bytesToSize(item.size)}</span> */}
                    </div>
                  </div>
                </div>
              ))}

              {documents.length < 3 && (
                <div className="upload-bank-statement">
                  <div
                    className="pdf-upload"
                    onClick={() =>
                      this.startUpload(
                        "open_file",
                        "",
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
