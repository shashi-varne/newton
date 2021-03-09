import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../../common/commonFunctions";
import SelectWithoutIcon from "common/ui/SelectWithoutIcon";
import { storageService } from "utils/validators";
import { getConfig, getBase64 } from "utils/functions";
import toast from "common/ui/Toast";
import $ from "jquery";

let options = [
  'Passport',
  'Driving License',
  'Utility Bill',
  'Bank Statement',
  'Aadhar Card',
  'Voter ID',
]

class uploadAddressProof extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      proof_type: "",
      address: "",
      isSelected: false,
      sides: 1,
      doc_side: '',
    };
    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let nps_additional_details = storageService().getObject(
      "nps_additional_details"
    );
    // let { nps_details } = nps_additional_details;

    // let { address } = nps_details;

    this.setState({
      // address: address || '',
    });
  };

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
        [that.state.doc_side]: img,
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
              doc_type: this.doc_type,
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

  openFileExplorer(side) {
    $(`#${side}`).trigger("click");
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {
    this.setState({
      type: method_name,
      doc_side: doc_side
    });

    if (getConfig().Web) {
      this.openFileExplorer(doc_side);
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
        [that.state.doc_side]: file.imageBaseFile,
        [`${[that.state.doc_side]}_file`]: file,
        uploaded: that.state.doc_side,
      });
    });
  };

  handleChange = (event) => {
    let value = event || "";
    let sides = 1;
    if (value === 'Utility Bill' || value === 'Bank Statement') {
      sides = 2
    }

    this.setState({
      proof_type: value,
      isSelected: true,
      sides: sides
    });
  };

  renderCamera = (side) => {
    return (
      <div className="image-prev-container">
        <div className='title'>{side} side of the address proof</div>
        <div className="display-flex">
          <img
            className={this.state.uploaded ? "uploaded" : "upload-img"}
            src={
              this.state[side] || require("assets/pickup.png")
            }
            alt="Document"
          />
          <div className="display-flex">
            {!getConfig().Web && (
              <div>
                <div className="image-upload-container"
                  onClick={() => this.startUpload('open_camera', 'address', 'address.jpg', side)}>
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
                  onClick={() => this.startUpload('open_gallery', 'address', 'address.jpg', side)}>
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
                onClick={() => this.startUpload("open_file", 'address', 'address.jpg', side)}
              >
                <div className="icon">
                  <img
                    src={require("assets/fa_image.svg")}
                    alt="Document"
                    width="30"
                  />
                  <input
                    type="file"
                    id={side}
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
    );
  }

  handleClick = async () => {

    if (this.state.sides === 2) {
      await this.uploadDocs(this.state.Front_file);
      await this.uploadDocs(this.state.Back_file);
    } else {
      await this.uploadDocs(this.state.Front_file);
    }

    this.navigate('success');
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="PROCEED"
        hideInPageTitle
        hidePageTitle
        title="Upload Address Proof"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        classOverRideContainer="pr-container"
      >
        <div className="page-heading">
          <img src={require("assets/hand_icon.png")} alt="" width="50" />
          <div className="text">
            Please upload the <span className="bold">proof</span> for updated
            address: <br />
            <span>
              <b>Address:</b> {this.state.address.addressline}
            </span>
          </div>
        </div>

        <div className="nps-upload">
          <div className="InputField">
            <SelectWithoutIcon
              width="30"
              id="name"
              label="Address Proof Type"
              value={this.state.proof_type}
              options={options}
              onChange={this.handleChange}
            />
          </div>
        </div>

        {this.state.isSelected && this.renderCamera('Front')}
        {this.state.isSelected && (this.state.proof_type === 'Utility Bill' ||
          this.state.proof_type === 'Bank Statement') && this.renderCamera('Back')}
      </Container>
    );
  }
}

export default uploadAddressProof;
