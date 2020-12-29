import React from "react";
import camera_green from "assets/take_pic_green.svg";
import gallery_green from "assets/go_to_gallery_green.svg";
import camera_grey from "assets/take_pic_grey.svg";

export function renderHtmlCamera(type) {
    let { image_data } = this.state;

    return (
      <div className = 'render-html-camera'>
        {!image_data[type] && (
          <div className = 'block1 render-camera'
            // style={{
            //   border: "1px dashed #e1e1e1",
            //   padding: "10px 0px 0px 0px",
            //   textAlign: "center",
            //   fontWeight: 600,
            // }}
          >
            <div>upload document</div>
            <div
            className='info' 
            // style={{ margin: "20px 0 20px 0", cursor: "pointer" }}
            >
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                // style={{
                //   textAlign: "center",
                //   cursor: "pointer",
                // }}
                className='center'
              >
                <input
                  type="file"
                  // style={{ display: "none" }}
                  className='input'
                  onChange={this.getPhoto}
                  id={type ? type : "myFile"}
                />
                <img src={camera_green} alt=""></img>
                <div 
                // style={{ color: "#28b24d" }}
                className='text'
                >Click here to upload</div>
              </div>
            </div>
          </div>
        )}
        {image_data[type] && image_data[type].uploaded && (
          <div
            // style={{
            //   border: "1px dashed #e1e1e1",
            //   padding: "0px 0px 0px 0px",
            //   textAlign: "center",
            // }}
            className='block2 render-camera'
          >
            <div>
              <img
                className='img'
                // style={{ width: "100%", height: 150 }}
                src={image_data[type].imageBaseFile || ""}
                alt=""
              />
            </div>
            <div 
            className='info'
            // style={{ margin: "20px 0 20px 0", cursor: "pointer" }}
            >
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                // style={{
                //   textAlign: "center",
                // }}
                className='center'
              >
                <input
                  type="file"
                  // style={{ display: "none" }}
                  className='input'
                  onChange={this.getPhoto}
                  id={type ? type : "myFile"}
                />
                <img src={camera_grey} alt=""></img>
                <div 
                className='upload-text'
                // style={{ color: "#b4b4b4" }}
                >Click here to upload new</div>
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
      <div className='render-native-camera'>
        {!image_data[type] && (
          <div
          className='render-camera'
            // style={{
            //   border: "1px dashed #e1e1e1",
            //   padding: "10px 0px 0px 0px",
            //   textAlign: "center",
            // }}
          >
            <div>Front side of document</div>
            <div
              // style={{
              //   margin: "20px 0 20px 0",
              //   fontSize: "12px",
              //   lineHeight: "20px",
              // }}
              className='content'
            >
              <div
                onClick={() => this.startUpload("open_camera", type)}
                // style={{
                //   width: "50%",
                //   float: "left",
                //   textAlign: "center",
                //   borderRight: "1px solid #e1e1e1",
                // }}
                className='camera'
              >
                <img src={camera_green} alt="OTM"></img>
                <div 
                className='text'
                // style={{ color: "#28b24d", fontWeight: 600 }}
                >
                  OPEN CAMERA
                </div>
              </div>
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                // style={{ textAlign: "center" }}
                className='center'
              >
                <img src={gallery_green} alt="OTM"></img>
                <div 
                className='text'
                // style={{ color: "#28b24d", fontWeight: 600 }}
                >
                  GO TO GALLERY
                </div>
              </div>
            </div>
          </div>
        )}
        {image_data[type] && (
          <div
            className='render-camera'
            // style={{
            //   border: "1px dashed #e1e1e1",
            //   padding: "0px 0px 0px 0px",
            //   textAlign: "center",
            // }}
          >
            <div>
              <img
                // style={{ width: "100%", height: 150 }}
                className='img'
                src={image_data[type].imageBaseFile || ""}
                alt=""
              />
            </div>
            <div
            className='content'
              // style={{
              //   margin: "20px 0 20px 0",
              //   fontSize: "12px",
              //   lineHeight: "20px",
              // }}
            >
              <div
                onClick={() => this.startUpload("open_camera", type)}
                className='camera'
                // style={{
                //   width: "50%",
                //   float: "left",
                //   textAlign: "center",
                //   borderRight: "1px solid #e1e1e1",
                // }}
              >
                <div 
                className='text'
                // style={{ color: "#28b24d", fontWeight: 600 }}
                >
                  OPEN CAMERA
                </div>
              </div>
              <div
                onClick={() => this.startUpload("open_gallery", type)}
                // style={{ textAlign: "center" }}
                className='center'
              >
                <div 
                className='text'
                // style={{ color: "#28b24d", fontWeight: 600 }}
                >
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
          className='render-camera'
            // style={{
              // border: "1px dashed #e1e1e1",
              // padding: "10px 0px 0px 0px",
              // textAlign: "center",
              // fontWeight: 600,
            // }}
          >
            <div 
            className='info'
            // style={{ margin: "20px 0 20px 0", cursor: "pointer" }}
            >
              <div
                onClick={() => this.startUpload("open_file", type + '_pdf')}
                // style={{
                //   textAlign: "center",
                //   cursor: "pointer",
                // }}
                className='center'
              >
                <input
                  type="file"
                  // style={{ display: "none" }}
                  className='input'
                  onChange={this.getPdf}
                  id={type + '_pdf'}
                />
                <img src={camera_green} alt=""></img>
                <div 
                className='text'
                // style={{ color: "#28b24d" }}
                >Click here to upload</div>
              </div>
            </div>
          </div>
    );
  }

  export function renderMultipleNativeCamera(type) {

    return (
      <div
      className='render-camera'
      // style={{
      //   border: "1px dashed #e1e1e1",
      //   padding: "10px 0px 0px 0px",
      //   textAlign: "center",
      // }}
    >
      <div
      className='content'
        // style={{
        //   margin: "20px 0 20px 0",
        //   fontSize: "12px",
        //   lineHeight: "20px",
        // }}
      >
        <div
          onClick={() => this.startUpload("open_camera", type + '_pdf')}
          // style={{
          //   width: "50%",
          //   float: "left",
          //   textAlign: "center",
          //   borderRight: "1px solid #e1e1e1",
          // }}
          className='camera'
        >
          <img src={camera_green} alt="OTM"></img>
          <div 
          className='text'
          // style={{ color: "#28b24d", fontWeight: 600 }}
          >
            OPEN CAMERA
          </div>
        </div>
        <div
          onClick={() => this.startUpload("open_file", type + '_pdf')}
          // style={{ textAlign: "center" }}
          className='center'
        >
          <img src={gallery_green} alt="OTM"></img>
          <div 
          className="text"
          // style={{ color: "#28b24d", fontWeight: 600 }}
          >
            UPLOAD FROM DEVICE
          </div>
        </div>
      </div>
    </div>
    );
  }
