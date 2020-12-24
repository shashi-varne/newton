import React from "react";
import camera_green from "assets/take_pic_green.svg";
import gallery_green from "assets/go_to_gallery_green.svg";
import camera_grey from "assets/take_pic_grey.svg";

export function renderHtmlCamera(type) {
    let { image_data } = this.state;

    return (
      <div>
        {!image_data[type] && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "10px 0px 0px 0px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            <div>upload document</div>
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
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "0px 0px 0px 0px",
              textAlign: "center",
            }}
          >
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

  export function renderNativeCamera(type) {

    let { image_data } = this.state;
    return (
      <div>
        {!image_data[type] && (
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "10px 0px 0px 0px",
              textAlign: "center",
            }}
          >
            <div>Front side of document</div>
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
          <div
            style={{
              border: "1px dashed #e1e1e1",
              padding: "0px 0px 0px 0px",
              textAlign: "center",
            }}
          >
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