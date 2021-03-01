import React, { Component } from "react";
// import toast from "../../../common/ui/Toast";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { getConfig } from "../../../utils/functions";
import DotDotLoader from "common/ui/DotDotLoader";
import { getBase64 } from "utils/functions";
import Api from "utils/api";
import $ from "jquery";
import { storageService } from "../../../utils/validators";
import { nativeCallback } from "utils/native_callback";
import {
  renderHtmlCamera,
  renderNativeCamera,
  renderMultipleHtmlCamera,
  renderMultipleNativeCamera,
  getPhoto, getPdf
} from "./render_camera";
import SVG from "react-inlinesvg";
import plus from "assets/plus.svg";
import { getUrlParams } from "utils/validators";

class DocumentUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: "document_upload",
      form_data: {},
      image_data: {},
      docList: [],
      disableButton: true,
      docs: [],
      documents: [],
      add_file: true,
      params: getUrlParams(),
    };

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
    this.renderHtmlCamera = renderHtmlCamera.bind(this);
    this.renderNativeCamera = renderNativeCamera.bind(this);
    this.renderMultipleHtmlCamera = renderMultipleHtmlCamera.bind(this);
    this.renderMultipleNativeCamera = renderMultipleNativeCamera.bind(this);
    this.getPhoto = getPhoto.bind(this);
    this.getPdf = getPdf.bind(this);
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
  }

  sendEvents(user_action) {
    let type = (this.state.type === "open_camera" ? "camera" : "gallery") || "";
    let eventObj = {
      event_category: "Lending IDFC",
      event_name: this.state.docList.category_name || "doc_upload",
      properties: {
        user_action: user_action,
        doc_type: this.state.form_data.doc_name,
        type: type,
        event_name: this.state.docList.category_name || "doc_upload",
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
            if (file.size > 5000000) {
              alert("Please select file less than 5mb");
              that.setState({
                show_loader: false,
              });
              return;
            }
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

  save = (file, name) => {
    let document = this.state.form_data.doc_name;

    let { category, doc_type, documents, totalUpload, image_data } = this.state;
    let ext = file.type.split("/")[1];

    if (file.file_name === undefined) {
      name = "Image_" + doc_type.split('')[3] + "." + ext;
    }
    
    if (file.file_name !== undefined && !file.file_name.includes(ext)) {
      name = file.file_name + "." + ext;
    }
    

    file.name = name || file.file_name;
    file.category_id = category;
    file.checklist_doc_type = doc_type.length === 4 ? doc_type : doc_type.slice(0, 4);
    file.doc_name = document;
    file.doc_type = file.type;
    console.log(file)

    let that = this;
    getBase64(file, function (img) {
      file.imageBaseFile = img;

      let duplicate = documents.filter(item => {
        return item.checklist_doc_type === file.checklist_doc_type
      })

      if (duplicate.length === 0) {
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
          disableButton: true,
        });
      } else {
        that.setState({
          show_loader: false,
        });
      }
      
    });
  };

  openCameraWeb(type) {
    $(`#${type}`).trigger("click")
  }

  startUpload(method_name, type) {
    this.setState({
      type: method_name,
      doc_type: type
    });

    if (getConfig().html_camera) {
      this.openCameraWeb(type);
    } else {
      this.native_call_handler(method_name, type)
    }
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
      add_file: true
    });
  };

  uploadDocument = async (file) => {
    let { totalUpload, documents, category } = this.state;
    this.setErrorData("submit");
    let error = "";
    let errorType = "";

    this.setState({
      isApiRunning: true
    })

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
        if (totalUpload > 2) {
          let index = documents.findIndex(
            (item) => item.checklist_doc_type === file.checklist_doc_type
          );
  
          documents[index].id = result.document_id;
          this.setState({
            documents: documents,
            isApiRunning: false
          })
        } else {
          return result;
        }
        
      } else {
        // toast(result.error || result.message || "Something went wrong")
        let title1 = result.error[0] || "Something went wrong!";
        this.setState({
          show_loader: false,
          isApiRunning: false,
          skelton: false,
          title1: title1,
        });

        this.setErrorData("submit");
        error = true;
        errorType = "form";
      }
    } catch (err) {
      console.log(err);
      // toast("Something went wrong");
      this.setState({
        show_loader: false,
        isApiRunning: false,
        skelton: false
      });
      error = true;
      errorType = "form";
    }

    if (error) {
      this.setState({
        show_loader: false,
        isApiRunning: false,
        documents: documents,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType,
        },
        showError: true,
      });
    }
  }

  deleteDocument = async (index, file) => {
    let { documents } = this.state;
    this.setErrorData("submit");
    let error = "";
    let errorType = "";

    documents[index].show_loader = true;
    this.setState({
      documents: documents,
      isApiRunning: true
    })

    const data = new FormData();
    data.append("doc_type", this.state.form_data.doc_name);
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
          isApiRunning: false,
        });
      } else {
        // toast(result.error);
        let title1 = result.error[0] || "Something went wrong!";
        this.setState({
          show_loader: false,
          loaderWithData: false,
          skelton: false,
          title1: title1,
        });

        this.setErrorData("submit");
        error = true;
        errorType = "form";
        documents[index].show_loader = false;
      }
    } catch (err) {
      console.log(err);
      // toast("Something went wrong");
      error = true;
      errorType = "form";
      documents[index].show_loader = false;
    }

    if (error) {
      this.setState({
        show_loader: false,
        isApiRunning: false,
        documents: documents,
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType,
        },
        showError: true,
      });
    }
  };

  handleClick = async () => {
    this.sendEvents("next");
    let { totalUpload, image_data, params } = this.state;
    let current_params = '';

    if (this.state.params.adminPanel) {
      current_params = 'base_url=' + params.base_url + '&adminPanel=' + params.adminPanel + '&user=' + params.user + '&redirect_url=' + params.redirect_url;
    }

    this.setState({
      // show_loader: true,
      skelton: 'g'
    })
    if (totalUpload < 3) {
      let count = 0;
      if (!image_data.doc1.doc_name) { 
        this.navigate('doc-list', {
          searchParams: current_params
        })
      } else {
        for (var item in image_data) {
          let res = await this.uploadDocument(image_data[item]);
          if (res) {
            count++
          }
        }
      }

      // eslint-disable-next-line radix
      if (count === parseInt(totalUpload)) {
        this.navigate('doc-list', {
          searchParams: current_params
        })
      }
    } else {
      this.navigate('doc-list', {
        searchParams: current_params
      })
    }
    
  }

  openUploadInput = () => {
    this.setState({
      add_file: false
    })
  }

  goBack = () => {
    this.sendEvents('back')
    let { params } = this.state;
    let current_params = '';

    if (this.state.params.adminPanel) {
      current_params = 'base_url=' + params.base_url + '&adminPanel=' + params.adminPanel + '&user=' + params.user + '&redirect_url=' + params.redirect_url;
    }
    
    this.navigate('doc-list', {
      searchParams: current_params
    })
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
          handleClick1: () => {
            this.setState({
              showError: false,
            });
          },
          button_text1: "Dismiss",
        },
      };

      this.setState({
        errorData: { ...mapper[type], setErrorData: this.setErrorData },
      });
    }
  };

  render() {
    let { image_data, documents, totalUpload, disableButton, isApiRunning } = this.state;
    // eslint-disable-next-line radix
    if (totalUpload < 3 && Object.keys(image_data).length !== parseInt(totalUpload)) {
      disableButton = true;
    } else if (totalUpload > 2 && (documents.length === 0 || isApiRunning)) {
      disableButton = true;
    } else {
      disableButton = false;
    }

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        showLoader={this.state.show_loader}
        title={this.state.docList.category_name}
        buttonTitle="CONTINUE"
        disable={disableButton}
        handleClick={this.handleClick}
        headerData={{
          goBack: this.goBack,
        }}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
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
              {getConfig().html_camera && this.renderHtmlCamera("doc1", "Front")}
              {!getConfig().html_camera && this.renderNativeCamera("doc1", "Front")}
            </div>
          )}

          {totalUpload === "2" && (
            <div>
              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera("doc1", "Front")}
                {!getConfig().html_camera && this.renderNativeCamera("doc1", "Front")}
              </div>

              <div
                className="loan-mandate-pan"
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera("doc2", "Back")}
                {!getConfig().html_camera && this.renderNativeCamera("doc2", "Back")}
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
                      {item.id && !item.show_loader ? <span
                        style={{ float: "right" }}
                        onClick={() => this.deleteDocument(index, item)}
                      >
                        <img
                          id={item.doc_type}
                          src={require(`assets/deleted.svg`)}
                          alt=""
                        />
                      </span> : <DotDotLoader style={{ float: "right" }}/>}
                    </div>
                  </div>
                </div>
              ))}

              {documents.length < 3 && (
                <div className="upload-bank-statement">
                  {this.state.add_file && <div className="pdf-upload"
                  onClick={() => this.openUploadInput()}>
                    <span className="plus-sign">
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
                  </div>}

                  {!this.state.add_file && <div
                    className="loan-mandate-pan"
                    style={{ marginBottom: "50px" }}
                  >
                    {getConfig().html_camera && this.renderMultipleHtmlCamera(`doc${documents.length + 1}`)}
                    {!getConfig().html_camera && this.renderMultipleNativeCamera(`doc${documents.length + 1}`)}
                  </div>}
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