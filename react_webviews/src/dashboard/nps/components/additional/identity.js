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
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: "native_receiver_image",

        // show_loader: function (show_loader) {
        //   that.showLoaderNative();
        // },
      });
    }
  }

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

      if (this.state.selfie_needed) {
        const data = new FormData();
        data.append("file", this.state.file);

        this.nps_register(queryParams, "nominee", data);
      } else {
        this.nps_register(queryParams, "nominee");
      }
    }
  };

  openFileExplorer() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type) {
    this.setState({
      type: method_name,
    });

    if (getConfig().Web) {
      this.openFileExplorer();
    } else {
      this.native_call_handler(method_name, doc_type);
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

        {selfie_needed && (
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
                    <div className="image-upload-container">
                      <div className="icon">
                        <img
                          src={require("assets/fa_camera.svg")}
                          alt="Document"
                          width="30"
                        />
                        <div className="text-center label">Camera</div>
                      </div>
                    </div>
                    <div className="image-upload-container">
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
