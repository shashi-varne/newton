import React, { Component } from "react";
import { getBase64 } from "utils/functions";
import $ from "jquery";
import ImageCrop from "common/ui/ImageCrop";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      fileUploaded: false,
      croppedImageUrl: "",
      cropped: false,
    };
  }

  getImage = (url) => {
    this.setState({
      croppedImageUrl: url,
      cropped: true,
    });
    console.log(url);
  };

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload() {
    this.openCameraWeb();
  }

  getPhoto = (e) => {
    e.preventDefault();
    this.setState({
      fileUploaded: false,
      cropped: false,
    });

    let file = e.target.files[0];

    let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

    if (acceptedType.indexOf(file.type) === -1) {
      console.log("please select image file only");
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

  render() {
    return (
      <div onClick={() => this.startUpload()}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={this.getPhoto}
          id="myFile"
        />
        {this.props.children}
      </div>
    );
  }
}

export default ImageUpload;
