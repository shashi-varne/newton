import React from "react";
import camera_green from "assets/take_pic_green.svg";
import gallery_green from "assets/go_to_gallery_green.svg";
import camera_grey from "assets/take_pic_grey.svg";
import { getBase64 } from "utils/functions";
import toast from "../../../common/ui/Toast";

export function renderHtmlCamera(type, side) {
  let { image_data } = this.state;

  return (
    <div className="Camera">
      {!image_data[type] && (
        <div className="block1">
          <div>{side} side of the document</div>
          <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
            <div
              onClick={() => this.startUpload("open_gallery", type)}
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={this.getPhoto}
                id={type ? type : "myFile"}
              />
              <img src={camera_green} alt=""></img>
              <div style={{ color: "#28b24d" }}>Click here to upload</div>
            </div>
          </div>
        </div>
      )}
      {image_data[type] && image_data[type].uploaded && (
        <div className="block2">
          <div>
            <img
              style={{ width: "100%", height: 150 }}
              src={image_data[type].imageBaseFile || ""}
              alt=""
            />
          </div>
          <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
            <div
              onClick={() => this.startUpload("open_gallery", type)}
              style={{
                textAlign: "center",
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={this.getPhoto}
                id={type ? type : "myFile"}
              />
              <img src={camera_grey} alt=""></img>
              <div style={{ color: "#b4b4b4" }}>Click here to upload new</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function renderNativeCamera(type, side) {
  let { image_data } = this.state;
  return (
    <div className="Camera">
      {!image_data[type] && (
        <div className="block1">
          <div>{side} side of document</div>
          <div
            style={{
              margin: "20px 0 20px 0",
              fontSize: "12px",
              lineHeight: "20px",
            }}
          >
            <div
              onClick={() => this.startUpload("open_camera", type)}
              style={{
                width: "50%",
                float: "left",
                textAlign: "center",
                borderRight: "1px solid #e1e1e1",
              }}
            >
              <img src={camera_green} alt="OTM"></img>
              <div style={{ color: "#28b24d", fontWeight: 600 }}>
                OPEN CAMERA
              </div>
            </div>
            <div
              onClick={() => this.startUpload("open_gallery", type)}
              style={{ textAlign: "center" }}
            >
              <img src={gallery_green} alt="OTM"></img>
              <div style={{ color: "#28b24d", fontWeight: 600 }}>
                GO TO GALLERY
              </div>
            </div>
          </div>
        </div>
      )}
      {image_data[type] && (
        <div className="block2">
          <div>
            <img
              style={{ width: "100%", height: 150 }}
              src={image_data[type].imageBaseFile || ""}
              alt=""
            />
          </div>
          <div
            style={{
              margin: "20px 0 20px 0",
              fontSize: "12px",
              lineHeight: "20px",
            }}
          >
            <div
              onClick={() => this.startUpload("open_camera", type)}
              style={{
                width: "50%",
                float: "left",
                textAlign: "center",
                borderRight: "1px solid #e1e1e1",
              }}
            >
              <div style={{ color: "#28b24d", fontWeight: 600 }}>
                OPEN CAMERA
              </div>
            </div>
            <div
              onClick={() => this.startUpload("open_gallery", type)}
              style={{ textAlign: "center" }}
            >
              <div style={{ color: "#28b24d", fontWeight: 600 }}>
                GO TO GALLERY
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function renderMultipleHtmlCamera(type) {
  return (
    <div
      style={{
        border: "1px dashed #e1e1e1",
        padding: "10px 0px 0px 0px",
        textAlign: "center",
        fontWeight: 600,
      }}
    >
      <div>Upload document</div>
      <div style={{ margin: "20px 0 20px 0", cursor: "pointer" }}>
        <div
          onClick={() => this.startUpload("open_file", type + "_pdf")}
          style={{
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            onChange={this.getPdf}
            id={type + "_pdf"}
          />
          <img src={camera_green} alt=""></img>
          <div style={{ color: "#28b24d" }}>Click here to upload</div>
        </div>
      </div>
    </div>
  );
}

export function renderMultipleNativeCamera(type) {
  return (
    <div
      style={{
        border: "1px dashed #e1e1e1",
        padding: "10px 0px 0px 0px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          margin: "20px 0 20px 0",
          fontSize: "12px",
          lineHeight: "20px",
        }}
      >
        <div
          onClick={() => this.startUpload("open_camera", type + "_pdf")}
          style={{
            width: "50%",
            float: "left",
            textAlign: "center",
            borderRight: "1px solid #e1e1e1",
          }}
        >
          <img src={camera_green} alt="OTM"></img>
          <div style={{ color: "#28b24d", fontWeight: 600 }}>OPEN CAMERA</div>
        </div>
        <div
          onClick={() => this.startUpload("open_file", type + "_pdf")}
          style={{ textAlign: "center" }}
        >
          <img src={gallery_green} alt="OTM"></img>
          <div style={{ color: "#28b24d", fontWeight: 600 }}>
            UPLOAD FROM DEVICE
          </div>
        </div>
      </div>
    </div>
  );
}

export function getPhoto(e) {
  e.preventDefault();

  let { image_data, category, doc_type } = this.state;
  image_data[doc_type] = {};
  let doc_name = this.state.form_data.doc_name;

  let file = e.target.files[0];

  if (file.size > 5000000) {
    toast("Please select file less than 5mb");
    this.setState({
      show_loader: false,
    });
    return;
  }

  file.doc_name = doc_name;
  file.category_id = category;
  file.checklist_doc_type =
    doc_type.length === 4 ? doc_type : doc_type.slice(0, 4);

  let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

  if (acceptedType.indexOf(file.type) === -1) {
    toast("Please select image file only");
    return;
  }

  let that = this;
  file.doc_type = doc_type;

  getBase64(file, function (img) {
    file.imageBaseFile = img;
    file.uploaded = true;
    image_data[doc_type] = file;
    // that.uploadDocument(image_data[doc_type], doc_type);

    that.setState({
      image_data: image_data,
    });
  });
}

export function getPdf(e) {
  e.preventDefault();
  let file = e.target.files[0] || {};

  if (file.size > 5000000) {
    toast("Please select file less than 5mb");
    this.setState({
      show_loader: false,
    });
    return;
  }

  let doc_name = this.state.form_data.doc_name;

  let { category, doc_type } = this.state;

  file.doc_name = doc_name;
  file.category_id = category;
  file.checklist_doc_type = doc_type.length === 4 ? doc_type : doc_type.slice(0, 4);

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
    toast("Please select pdf/img file only");
    return;
  }

  let { documents, count } = this.state;
  if (Object.keys(file).length !== "0") {
    file.doc_type = file.type;
    file.id = count++;

    let that = this;
    getBase64(file, function (img) {
      file.imageBaseFile = img;

      let duplicate = documents.filter(item => {
        return item.name === file.name
      })

      if (duplicate.length === 0) {
        that.uploadDocument(file);
        documents.push(file);
      }

      that.setState({
        documents: documents,
        add_file: true
      });
    });
  }
};