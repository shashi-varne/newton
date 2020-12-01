import React, { Component } from "react";
import toast from "../../../common/ui/Toast";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import DropdownWithoutIcon from "../../../common/ui/SelectWithoutIcon";
import { storageService } from "utils/validators";
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

class DocumentUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      docListOptions: [],
      form_data: {},
      totalUpload: "",
    };
  }

  componentWillMount() {
    // this.initialize();
    this.onload();
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
    let doc_list = [
      {
        category: "Cat1",
        category_name: "Address Proof",
        docs: [
          {
            doc_display_name: "Latest Bank Statement",
            pages: null,
          },
          {
            doc_display_name: "Driving License",
            pages: null,
          },
          {
            doc_display_name: "Aadhaar Card",
            pages: "2",
          },
          {
            doc_display_name: "Pension or Family Pension Payment Orders (PPOs)",
            pages: null,
          },
          {
            doc_display_name:
              "Letter of Allotment of Accommodation from Employer - issued by State Government or Central Government Departments",
            pages: null,
          },
          {
            doc_display_name: "Property or Municipal Tax Receipt",
            pages: null,
          },
          {
            doc_display_name: "Latest Passbook of scheduled commercial Bank",
            pages: null,
          },
          {
            doc_display_name: "Rent Agreement",
            pages: null,
          },
        ],
        doc_checklist: [
          // {
          //     "subtype": "Aadhaar card",
          //     docs:[
          //         {
          //             "doc_id": <doc_id>,
          //             "doc_url": <doc_url>,
          //             "extension": <extension>
          //             "doc_type": <doc_type>
          //         },
          //         {
          //             "doc_id": <doc_id>,
          //             "doc_url": <doc_url>,
          //             "extension": <extension>,
          //             "doc_type": <doc_type>
          //         }
          //     ]
          // }
          null,
        ],
      },
      {
        category: "Cat2",
        category_name: "Identity Proof (PAN)",
        docs: ["PAN"],
        doc_checklist: [null],
      },
      {
        category: "Cat3",
        category_name: "Salary Slip / Employment Proof",
        docs: ["3 Months Salary Slip"],
        doc_checklist: [null],
      },
      {
        category: "Cat4",
        category_name: "Bank Account Statement",
        docs: ["Last 3 months Bank Account Statement"],
        doc_checklist: [null],
      },
      {
        category: "Cat5",
        category_name: "Ownership Proof (Either Home Or Office)",
        docs: ["Electricity Bill", "Sale Deed"],
        doc_checklist: [null],
      },
    ];

    let category = storageService().get("category");

    let selectedIndex = doc_list.findIndex(
      (item) => item.category === category
    );

    let docs = doc_list[selectedIndex].docs.map((item) => {
      return {
        name: item.doc_display_name,
        value: item.pages || "3",
      };
    });

    this.setState({
      selectedIndex: selectedIndex,
      doc_list: doc_list[selectedIndex],
      docs: docs,
    });
  };

  renderHtmlCamera(id) {
    return (
      <div>
        {!this.state.fileUploaded && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "10px 0px 0px 0px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            <div>Upload PAN card</div>
            <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
              <div
                onClick={() =>
                  this.startUpload("open_camera", "pan", "pan.jpg")
                }
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.getPhoto}
                  id={id}
                />
                <img src={camera_green} alt="PAN"></img>
                <div style={{ color: "#28b24d" }}>Click here to upload</div>
              </div>
            </div>
          </div>
        )}
        {this.state.fileUploaded && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "0px 0px 0px 0px",
              textAlign: "center",
            }}
          >
            <div>
              <img
                style={{ width: "100%", height: 300 }}
                src={this.state.imageBaseFileShow || this.state.document_url}
                alt="PAN"
              />
            </div>
            <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
              <div
                onClick={() =>
                  this.startUpload("open_camera", "pan", "pan.jpg")
                }
                style={{
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.getPhoto}
                  id={id}
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

  conversionCallBack = async () => {
    let body = {
      request_type: "conversion",
    };

    let resultData = await this.callBackApi(body);
    if (resultData.callback_status) {
      this.navigate("upload-documents", {
        params: {
          fromPanScreen: true,
        },
      });
    } else {
      let searchParams = getConfig().searchParams + "&status=sorry";
      this.navigate("instant-kyc-status", { searchParams: searchParams });
    }
  };

  checkNextState = () => {
    if (this.state.vendor_info.dmi_loan_status === "opportunity") {
      this.navigate("upload-documents", {
        params: {
          fromPanScreen: true,
        },
      });
    } else {
      this.conversionCallBack();
    }
  };

  async uploadDocs(file) {
    this.setState({
      show_loader: true,
    });
    this.sendEvents("next");

    var uploadurl = "/relay/api/loan/document/upload";
    const data = new FormData();
    data.append("res", file);
    data.append("doc_type", "pan");
    data.append("application_id", this.state.application_id);

    try {
      const res = await Api.post(uploadurl, data);

      var resultData = res.pfwresponse.result || {};
      if (res.pfwresponse.status_code === 200 && resultData.message) {
        this.checkNextState();
      } else {
        this.setState({
          show_loader: false,
        });

        toast(resultData.error || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  }

  mergeDocs(file) {
    this.setState({
      imageBaseFile: file,
      fileUploaded: true,
      show_loader: true,
    });

    let that = this;
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img,
      });
    });

    setTimeout(
      function () {
        this.setState({
          show_loader: false,
        });
      }.bind(this),
      1000
    );
  }

  showLoaderNative() {
    this.setState({
      show_loader: true,
    });
  }

  native_call_handler(method_name, doc_type, doc_name, doc_side) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: "doc",
        doc_type: doc_type,
        doc_name: doc_name,
        doc_side: doc_side,
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

      window.callbackWeb.add_listener({
        type: "native_receiver_image",
        show_loader: function (show_loader) {
          that.setState({
            show_loader: true,
          });
          that.showLoaderNative();
        },
      });
    }
  }

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {
    this.setState({
      type: method_name,
    });

    if (getConfig().html_camera) {
      this.openCameraWeb();
    } else {
      this.native_call_handler(method_name, doc_type, doc_name, doc_side);
    }
  }

  getPhoto = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    let id = e.target.id;
    console.log(id)

    let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    if (acceptedType.indexOf(file.type) === -1) {
      toast("Please select image file only");
      return;
    }

    let that = this;
    file.doc_type = file.type;
    this.setState({
      imageBaseFile: file,
    });
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img,
        fileUploaded: true,
      });
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event;

    let { form_data, totalUpload } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
      totalUpload: value,
    });
  };

  handleClick = () => {
    this.sendEvents("next");
    this.setState({
      show_loader: true,
    });

    if (this.state.imageBaseFile) {
      this.uploadDocs(this.state.imageBaseFile);
    } else {
      this.checkNextState();
    }
  };

  render() {
    let { doc_list, selectedIndex, docs, totalUpload } = this.state;
    console.log(this.state.doc_list)
    return (
      <Container
        showLoader={this.state.show_loader}
        title={this.state.doc_list.category_name}
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
              dataType="AOB"
              onChange={this.handleChange("doc_name")}
            />
          </div>

          {totalUpload === "2" && (
            <div className="loan-mandate-pan">
              {getConfig().html_camera && this.renderHtmlCamera()}
              {!getConfig().html_camera && this.renderNativeCamera()}
            </div>
          )}

          {totalUpload === "3" && (
            <div>
              <div className="loan-mandate-pan">
                {getConfig().html_camera && this.renderHtmlCamera(1)}
                {!getConfig().html_camera && this.renderNativeCamera(1)}
              </div>
              <div className="loan-mandate-pan">
                {getConfig().html_camera && this.renderHtmlCamera(2)}
                {!getConfig().html_camera && this.renderNativeCamera(2)}
              </div>
            </div>
          )}

          {totalUpload === "3" && (
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
                {/* {documents.length !== 0 ? "ADD FILE" : "UPLOAD FILE"} */}
                UPLOAD FILE
              </div>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default DocumentUpload;
