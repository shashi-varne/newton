import React, { Component } from "react";
import Container from "../../../common/Container";
import InputWithIcon from "common/ui/InputWithIcon";
import toast from "common/ui/Toast";
import RadioOptions from "common/ui/RadioOptions";
import person from "assets/person.png";
import { initialize } from "../../common/commonFunctions";
import { getConfig, getBase64 } from "utils/functions";
import { storageService } from "utils/validators";
import Grid from "material-ui/Grid";
import $ from "jquery";

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
      screen_name: 'nps-identity',
      form_data: {},
      nps_details: {},
      selfie_needed: "",
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
    let { nps_details, selfie_needed } = nps_additional_details;

    this.setState({
      nps_details: nps_details,
      selfie_needed: selfie_needed,
    });
  };

  handleChange = (name) => (event) => {
    let value = event.target.value;
    let { form_data } = this.state;

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
      let queryParams = `is_married=${
        form_data.marital_status === "married"
      }&mother_name=${form_data.mother_name}${
        form_data.marital_status === "married"
          ? "&spouse_name=" + form_data.spouse_name
          : ""
      }`;

      if (!this.state.selfie_needed) {
        await this.uploadDocs(this.state.file);

        this.nps_register(queryParams, "nominee");
        
      } else {
        this.nps_register(queryParams, "nominee");
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
      "application/pdf",
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

  render() {
    let { form_data, nps_details, selfie_needed, uploaded, img } = this.state;
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Additional Details"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please <span className="bold">confirm</span> your personal details.
          </div>
        </div>

        {!selfie_needed && (
          <div className="image-prev-container">
            <div className="heading">Share your selfie</div>
            <div className="display-flex">
              <img
                className={uploaded ? "uploaded" : "upload-img"}
                src={uploaded ? img : require("assets/pickup.png")}
                alt="Document"
              />
              <div className="display-flex">
                {!getConfig().Web && (
                  <div>
                    <div className="image-upload-container"
                      onClick={() => this.startUpload('open_camera', 'address', 'address.jpg')}
                    >
                      <div className="icon">
                        <img
                          src={require("assets/fa_camera.svg")}
                          alt="Document"
                          width="30"
                        />
                        <div className="text-center label">Camera</div>
                      </div>
                    </div>
                    <div className="image-upload-container"
                      onClick={() => this.startUpload('open_gallery', 'address', 'address.jpg')}
                    >
                      <div className="icon">
                        <img
                          src={require("assets/fa_image.svg")}
                          alt="Document"
                          width="30"
                        />
                        <div className="text-center label">Gallery</div>
                      </div>
                    </div>
                  </div>
                )}
                {getConfig().Web && (
                  <div
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
                      <span className="text-center label">Gallery</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="nps-identity">
          <div className="InputField">
            <InputWithIcon
              icon={person}
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
            <Grid container spacing={16} className="marital_status">
              <Grid item xs={2}>
                {""}
              </Grid>
              <Grid item xs={10}>
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
              </Grid>
            </Grid>
          </div>

          {form_data.marital_status === "married" && (
            <div className="InputField">
              <InputWithIcon
                icon={person}
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
