import React, { Component } from "react";
import Container from "./container";
import "./Style.scss";
import Button from "material-ui/Button";
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from "utils/functions";
import $ from "jquery";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
    };
    this.native_call_handler = this.native_call_handler.bind(this);
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
        //   that.showLoaderNative();
        }
      });
    }
  }

  openCameraWeb() {
      $('input').trigger('click');
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {
      console.log('hi')
      if (getConfig.html_camera) {
          console.log('hi');
          this.openCameraWeb();
      } else {
          console.log(method_name, doc_type, doc_name, doc_side)
          this.native_call_handler(method_name, doc_type, doc_name, doc_side);
      }
  }

  getPhoto = (e) => {}

  render() {

    const dialog = (
        <React.Fragment>
          <div className="wr-welcome">
            {/* <img src={require(`assets/fisdom/ic-profile-avatar.svg`)} alt="" /> */}
            {/* <img src={require(`assets/fisdom/ic-mob-add-pic.svg`)} alt="" style={{marginLeft:'-27px'}} /> */}
  
            {/* <div onClick={() => this.startUpload('open_camera', 'pan', 'pan.jpg')} style={{
                textAlign: 'center',
              }}>
                <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
                <img src="" alt="PAN"></img>
                <div style={{ color: '#28b24d' }}>Click here to upload</div>
              </div> */}

            <div style={{textAlign:'center'}} onClick={() => this.startUpload('open_camera', 'profile', 'image.jpg')}>
              <input type="file" style={{display:'none'}} onChange={this.getPhoto} id="myFile" />
              <img src={require(`assets/fisdom/ic-profile-avatar.svg`)} alt="avatar" />
              <img src={require(`assets/fisdom/ic-mob-add-pic.svg`)} alt="camera" style={{marginLeft:'-27px'}} />
            </div>
              
              {/* <input type="file" style={{display: 'inherit'}} /> */}
              {/* <img src={require(`assets/fisdom/ic-profile-avatar.svg`)} alt="" /> */}
              {/* <img src={require(`assets/fisdom/ic-mob-add-pic.svg`)} alt="" style={{marginLeft:'-27px'}} /> */}
              
  
  
            <div className="wr-head">Welcome</div>
            <div className="wr-number">+91 92374 82739</div>
          </div>
  
          <Button
            fullWidth={true}
            style={{
              background: "#f3cece",
              height: "47px",
              color: "#e02020",
              marginTop: "15px",
            }}
            className="wr-logout"
          >
            <img src={require(`assets/fisdom/ic-mob-logout.svg`)} alt="" />
            Logout
          </Button>
        </React.Fragment>
      );

    return (
      <Container
        dialogContent={dialog}
        openPopup={true}
      >
          <Button>Logout</Button>
      </Container>
    );
  }
}

export default ImageUpload;
