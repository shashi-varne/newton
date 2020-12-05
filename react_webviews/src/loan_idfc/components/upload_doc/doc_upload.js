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
      form_data: {},
      totalUpload: "",
      docList: [],
      documents: [],
      screen_name: 'document_upload',
      count: 1,
    };

    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.onload();
  }

  onload = () => {
    // let docList = this.state.docList;
    // let docList = [
    //   {
    //     category: "Cat1",
    //     category_name: "Address Proof",
    //     docs: [
    //       {
    //         doc_display_name: "Latest Bank Statement",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Driving License",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Aadhaar Card",
    //         pages: "2",
    //       },
    //       {
    //         doc_display_name: "Pension or Family Pension Payment Orders (PPOs)",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name:
    //           "Letter of Allotment of Accommodation from Employer - issued by State Government or Central Government Departments",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Property or Municipal Tax Receipt",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Latest Passbook of scheduled commercial Bank",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Rent Agreement",
    //         pages: null,
    //       },
    //     ],
    //     doc_checklist: [null],
    //   },
    //   {
    //     category: "Cat2",
    //     category_name: "Identity Proof (PAN)",
    //     docs: [
    //       {
    //         doc_display_name: "PAN",
    //         pages: "1",
    //       },
    //     ],
    //     doc_checklist: [null],
    //   },
    //   {
    //     category: "Cat3",
    //     category_name: "Salary Slip / Employment Proof",
    //     docs: [
    //       {
    //         doc_display_name: "3 Months Salary Slip",
    //         pages: null,
    //       },
    //     ],
    //     doc_checklist: [null],
    //   },
    //   {
    //     category: "Cat4",
    //     category_name: "Bank Account Statement",
    //     docs: [
    //       {
    //         doc_display_name: "Last 3 months Bank Account Statement",
    //         pages: null,
    //       },
    //     ],
    //     doc_checklist: [null],
    //   },
    //   {
    //     category: "Cat5",
    //     category_name: "Ownership Proof (Either Home Or Office)",
    //     docs: [
    //       {
    //         doc_display_name: "Electricity Bill",
    //         pages: null,
    //       },
    //       {
    //         doc_display_name: "Sale Deed",
    //         pages: null,
    //       },
    //     ],
    //     doc_checklist: [null],
    //   },
    // ];

    // let category = storageService().get("category");

    // let selectedIndex = docList.findIndex((item) => item.category === category);

    // let docs = docList[selectedIndex].docs.map((item) => {
    //   return {
    //     name: item.doc_display_name,
    //     value: item.pages || "3",
    //   };
    // });

    // this.setState({
    //   docList: docList[selectedIndex],
    //   docs: docs,
    // });
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
    let value = event.target ? event.target.value : event;

    let { form_data } = this.state;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
      totalUpload: value,
    });
  };

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload(method_name) {
    this.setState({
      type: method_name,
    });

    this.openCameraWeb();
  }

  getPdf = (e) => {
    e.preventDefault();

    let file = e.target.files[0] || {};
    console.log(file);

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

  render() {
    let { docList, selectedIndex, documents, docs, totalUpload } = this.state;
    console.log(documents.length);
    console.log(totalUpload);
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
              dataType="AOB"
              onChange={this.handleChange("doc_name")}
            />
          </div>

          {totalUpload < "3" &&
            Array.apply(null, { length: totalUpload }).map((e, index) => (
              <div
                className="loan-mandate-pan"
                key={index}
                style={{ marginBottom: "50px" }}
              >
                {getConfig().html_camera && this.renderHtmlCamera(index)}
                {!getConfig().html_camera && this.renderNativeCamera()}
              </div>
            ))}

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
                  

                  {/* {item.doc_type !== "application/pdf" && (
                    <div
                      style={{
                        border: "1px dashed #e1e1e1",
                        padding: "0px 0px 0px 0px",
                        textAlign: "center",
                        marginBottom: "30px",
                      }}
                      key={index}
                    >
                      <div>
                        <img
                          style={{ width: "100%", height: 200 }}
                          src={item.imageBaseFile || this.state.document_url}
                          alt="PAN"
                        />
                      </div>
                    </div>
                  )} */}
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
