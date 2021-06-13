import React, { Component } from "react";
import Container from "../../../common/Container";
import Input from "common/ui/Input";
import toast from "common/ui/Toast";
import RadioOptions from "common/ui/RadioOptions";
import person from "assets/person.png";
import { initialize } from "../../common/commonFunctions";
import { getConfig, getBase64 } from "utils/functions";
import { storageService } from "utils/validators";
import $ from "jquery";
import { validateAlphabets } from "../../../../utils/validators";

const marital_status_options = [
  {
    name: "Single",
    value: "single",
  },
  {
    name: "Married",
    value: "married",
  },
];

class NpsIdentity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      skelton: 'g',
      screen_name: 'nps-identity',
      form_data: {},
      nps_details: {},
      selfie_needed: false,
      uploaded: false,
      canSubmit: false,
      img: "",
      file: "",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
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

  mergeDocs(file) {

    this.setState({
      show_loader: true
    })

    let that = this
    getBase64(file, function (img) {
      that.setState({
        img: img,
        file: file,
        uploaded: true
      })
    });

    setTimeout(
      function () {
        this.setState({
          show_loader: false
        })
      }
        .bind(this),
      1000
    );

  };

  onload = () => {
    let nps_additional_details = storageService().getObject(
      "nps_additional_details"
    );
    let { nps_details, selfie_needed, mother_name, is_married, spouse_name } = nps_additional_details;
    let { form_data } = this.state;

    form_data = {
      mother_name: mother_name || '',
      marital_status: is_married ? 'married' : 'single',
      spouse_name: spouse_name || ''
    }

    this.setState({
      nps_details: nps_details,
      selfie_needed: selfie_needed,
      skelton: false,
      form_data: form_data,
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target.value;
    let { form_data } = this.state;
    if (value && name.includes("name") && !validateAlphabets(value)) return;

    form_data[name] = value;
    form_data[name + "_error"] = "";

    this.setState({
      form_data: form_data,
    });
  };

  handleClick = async () => {
    let { form_data } = this.state;

    let keys_to_check = ["mother_name", "marital_status"];

    if (form_data.marital_status !== "single") {
      keys_to_check.push("spouse_name");
    }

    let canSubmit = this.formCheckUpdate(keys_to_check, form_data);

    if (canSubmit) {
      let queryParams = `is_married=${form_data.marital_status === "married"
        }&mother_name=${form_data.mother_name}${form_data.marital_status === "married"
          ? "&spouse_name=" + form_data.spouse_name
          : ""
        }`;

      if (this.state.selfie_needed) {
        let result = await this.uploadDocs(this.state.file);

        if (result)
          this.nps_register(queryParams, "/nps/nominee");

      } else {
        this.nps_register(queryParams, "/nps/nominee");
      }
    }
  };

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {
    this.setState({
      type: method_name,
    });

    if (getConfig().Web) {
      this.openFileExplorer();
    } else {
      this.native_call_handler(method_name, doc_type, doc_name, doc_side);
    }
  }

  getPhoto = (e) => {
    e.preventDefault();

    let file = e.target.files[0] || {};

    let acceptedType = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/bmp",
    ];

    if (file.length !== "0" && acceptedType.indexOf(file.type) === -1) {
      toast("Please select image only");
      return;
    }

    let that = this;

    getBase64(file, function (img) {
      file.imageBaseFile = img;

      that.setState({
        img: file.imageBaseFile,
        file: file,
        uploaded: true,
      });
    });
  };

  native_call_handler(method_name, doc_type, doc_name, doc_side) {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb[method_name]({
        type: 'doc',
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
              show_loader: true
            })
            switch (file.type) {
              case 'image/jpeg':
              case 'image/jpg':
              case 'image/png':
              case 'image/bmp':
                that.mergeDocs(file);
                break;
              default:
                alert('Please select image file');
                that.setState({
                  docType: this.doc_type,
                  show_loader: false
                })
            }
          } catch (e) {
            // 
          }
        }
      });

      window.callbackWeb.add_listener({
        type: 'native_receiver_image',
        show_loader: function (show_loader) {
          that.setState({
            show_loader: true
          })
          that.showLoaderNative();
        }
      });
    }
  }

  bannerText = () => {
    return (
      <span>
        Please <b>confirm</b> your personal details.
      </span>
    );
  }

  render() {
    let { form_data, selfie_needed, uploaded, img } = this.state;

    return (
      <Container
        data-aid='nps-additional-detais-screen'
        buttonTitle="PROCEED"
        title="Additional Details"
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        showError={this.state.showError}
        errorData={this.state.errorData}
        handleClick={this.handleClick}
        disable={selfie_needed && !uploaded ? true : false}
        banner={true}
        bannerText={this.bannerText()}
      >
        {!selfie_needed && (
          <div className="image-prev-container" data-aid='nps-image-prev-block'>
            <div className="heading" data-aid='nps-share-your-selfie'>Share your selfie</div>
            <div className="display-flex">
              <img
                className={uploaded ? "uploaded" : "upload-img"}
                src={uploaded ? img : require("assets/pickup.png")}
                alt="Document"
              />
              <div className="display-flex">
                {!getConfig().Web && (
                  <div data-aid='nps-upload-file'>
                    <div
                      className="image-upload-container"
                      onClick={() =>
                        this.startUpload(
                          "open_camera",
                          "address",
                          "address.jpg"
                        )
                      }
                    >
                      <div className="icon">
                        <img
                          src={require("assets/fa_camera.svg")}
                          alt="Document"
                          width="30"
                        />
                        <div className="text-center label" data-aid='nps-label-camera'>Camera</div>
                      </div>
                    </div>
                    <div
                      className="image-upload-container"
                      onClick={() =>
                        this.startUpload(
                          "open_gallery",
                          "address",
                          "address.jpg"
                        )
                      }
                    >
                      <div className="icon">
                        <img
                          src={require("assets/fa_image.svg")}
                          alt="Document"
                          width="30"
                        />
                        <div className="text-center label" data-aid='nps-label-gallery'>Gallery</div>
                      </div>
                    </div>
                  </div>
                )}
                {getConfig().Web && (
                  <div
                    data-aid='nps-upload-file'
                    className="image-upload-container"
                    onClick={() =>
                      this.startUpload("open_file", "bank_statement")
                    }
                  >
                    <div className="icon">
                      <img
                        src={require("assets/fa_image.svg")}
                        alt="Document"
                        width="30"
                      />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={this.getPhoto}
                      />
                      <span className="text-center label" data-aid='nps-label-gallery'>Gallery</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="nps-identity" data-aid='nps-identity'>
          <div className="InputField">
            <Input
              icon={person}
              type="text"
              width="30"
              id="name"
              label="Mother's name"
              error={form_data.mother_name_error ? true : false}
              helperText={form_data.mother_name_error}
              value={form_data.mother_name || ""}
              onChange={this.handleChange("mother_name")}
            />
          </div>

          <div className="InputField">
            <RadioOptions
              icon_type="blue_icon"
              width="40"
              label="Marital Status"
              error={form_data.marital_status_error ? true : false}
              helperText={form_data.marital_status_error}
              value={form_data.marital_status || ""}
              options={marital_status_options}
              onChange={this.handleChange("marital_status")}
            />
          </div>

          {form_data.marital_status === "married" && (
            <div className="InputField">
              <Input
                icon={person}
                type="text"
                width="30"
                id="name"
                label="Spouse's name"
                error={form_data.spouse_name_error ? true : false}
                helperText={form_data.spouse_name_error}
                value={form_data.spouse_name || ""}
                onChange={this.handleChange("spouse_name")}
              />
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default NpsIdentity;
