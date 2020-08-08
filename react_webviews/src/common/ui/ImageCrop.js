import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "material-ui/Button";

class Crops extends PureComponent {
  state = {
    src: this.props.image,
    crop: {
      unit: "%",
      width: 30,
      aspect: 9 / 9,
    },
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ src: reader.result });
        console.log(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            style={{ height: "40%", width: "50%" }}
          />
        )}
        {croppedImageUrl && (
          <Button
            onClick={() => this.props.getImage(croppedImageUrl)}
            style={{backgroundColor:'green', color:'white', marginTop:'5px'}}
          >
            save
          </Button>
        )}
      </div>
    );
  }
}

export default Crops;
