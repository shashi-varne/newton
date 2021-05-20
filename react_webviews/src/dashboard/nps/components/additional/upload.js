import React, { Component } from "react";
import Container from "../../../common/Container";
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
      skelton: 'g',
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
    let kyc_app = storageService().getObject(
      "kyc_app"
    );
    let { address } = kyc_app;

    if (address) {
      this.setState({
        address: address.meta_data || '',
        skelton: false
      });
    }
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
      <div className="image-prev-container" data-aid='nps-image-prev-block'>
        <div className='title' data-aid='nps-title'>{side} side of the address proof</div>
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
              <div data-aid='nps-upload-file'>
                <div className="image-upload-container"
                  onClick={() => this.startUpload('open_camera', 'address', 'address.jpg', side)}>
                  <div className="icon">
                    <img
                      src={require("assets/fa_camera.svg")}
                      alt="Document"
                      width="30"
                    />
                    <div className="text-center label" data-aid={`nps-label-camera-${side}`}>Camera</div>
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
                    <div className="text-center label" data-aid={`nps-label-gallery-${side}`}>Gallery</div>
                  </div>
                </div>
              </div>
            )}
            {getConfig().Web && (
              <div
                data-aid='nps-upload-file'
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
                  <span className="text-center label" data-aid={`nps-label-gallery-${side}`}>Gallery</span>
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
  }

  bannerText = () => {
    return (
      <span data-aid='nps-banner-text'>
        Please upload the <span className="bold">proof</span> for updated
            address: <br />
            <span>
              <b>Address:</b> {this.state.address.addressline}
            </span>
      </span>
    );
  }

  render() {
    return (
      <Container
        data-aid='nps-upload-address-proof'
        fullWidthButton
        buttonTitle="PROCEED"
        title="Upload Address Proof"
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        showError={this.state.showError}
        errorData={this.state.errorData}
        banner={true}
        bannerText={this.bannerText()}
      >

        <div className="nps-upload" data-aid='nps-upload'>
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
