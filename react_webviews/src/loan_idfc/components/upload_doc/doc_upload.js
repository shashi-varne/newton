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
      count: 1,
      docs: [],
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();
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

      let docsMap = docList[selectedIndex].docs.map((item) => {
        return {
          name: item.doc_display_name,
          value: item.pages || "3",
        };
      });

      this.setState({
        docList: docList[selectedIndex],
        docs: docs,
        docsMap: docsMap,
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
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
              case "image/bmp":
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

  handleChange = (name) => (event) => {
    let value = event.target ? event.target : event;

    let { form_data, docsMap, totalUpload } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    docsMap.forEach((item) => {
      if (item.name === value) {
        totalUpload = item.value
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

  startUpload(method_name, id) {

    this.setState({
      type: method_name,
    });

    this.openCameraWeb(id);
  }

  getPdf = (e) => {
    e.preventDefault();
    console.log('hi')
    let file = e.target.files[0] || {};

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
        documents.push(file);

        that.setState({
          fileUploaded: true,
          documents: documents,
          count: count,
        });
      });
    }
  };

  getPhoto = (e) => {

    e.preventDefault();
    
    let image_data = this.state.image_data;
    let id = e.target.id;
    image_data[id] = {};

    let file = e.target.files[0];

    let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];

    if (acceptedType.indexOf(file.type) === -1) {
      toast('Please select image file only');
      return;
    }

    let that = this;
    file.doc_type = file.type;

    getBase64(file, function (img) {
      image_data[id].img = img;
      image_data[id].uploaded = true;
      
      
      that.setState({
        image_data: image_data
      })
    });
  }

  uploadDocument = async () => {

  }


  renderHtmlCamera(side) {
    console.log(this.state.image_data[side])
    let { image_data } = this.state;

    return (
      <div>
        {!image_data[side] && <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
          textAlign: 'center', fontWeight: 600
        }}>
          <div>Upload PAN card</div>
          <div style={{ margin: '20px 0 20px 0', cursor: 'pointer'  }}>
            <div onClick={() => this.startUpload('open_camera', side)} style={{
              textAlign: 'center', cursor: 'pointer'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id={side ? side : "myFile"} />
              <img src={camera_green} alt="PAN"></img>
              <div style={{ color: '#28b24d' }}>Click here to upload</div>
            </div>
          </div>
        </div>}
        {image_data[side] && image_data[side].uploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '0px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>
            <img style={{ width: '100%', height: 150 }} src={image_data[side].img || this.state.document_url || ""} alt="PAN" />
          </div>
          <div style={{ margin: '20px 0 20px 0', cursor: 'pointer' }}>
            <div onClick={() => this.startUpload('open_camera', side)} style={{
              textAlign: 'center'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id={side ? side : "myFile"}  />
              <img src={camera_grey} alt="PAN"></img>
              <div style={{ color: '#b4b4b4' }}>Click here to upload new</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  render() {
    let { docList, selectedIndex, documents, docs, totalUpload } = this.state;

    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.docList.category_name}
        buttonTitle="CONTINUE"
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
              // dataType="AOB"
              onChange={this.handleChange("doc_name")}
            />
          </div>

          {totalUpload === "1" && (
            <div className="loan-mandate-pan" style={{ marginBottom: "50px" }}>
              {getConfig().html_camera && this.renderHtmlCamera('single')}
              {!getConfig().html_camera && this.renderNativeCamera()}
            </div>
          )}

          {totalUpload === "2" && (
            <div>
              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera('front')}
                {/* {!getConfig().html_camera && this.renderNativeCamera()} */}
              </div>

              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera('back')}
                {/* {!getConfig().html_camera && this.renderNativeCamera()} */}
              </div>

              <div
                className="loan-mandate-pan"
                style={{ display: 'none' }}
              >
                {getConfig().html_camera && this.renderHtmlCamera()}
                {/* {!getConfig().html_camera && this.renderNativeCamera()} */}
              </div>
            </div>
          )}

          {totalUpload === "3" && (
            <div>
              {documents.map((item, index) => (
                <div>
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
                      <span className="bytes">{bytesToSize(item.size)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {documents.length < 3 && (
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
          )}
        </div>
      </Container>
    );
  }
}

export default DocumentUpload;
