import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import camera_green from 'assets/take_pic_green.svg';
import camera_finity from 'assets/finity/take_pic_finity.svg';
import camera_grey from 'assets/take_pic_grey.svg';
import gallery_green from 'assets/go_to_gallery_green.svg';
import gallery_grey from 'assets/go_to_gallery_grey.svg';
import correct from 'assets/correct_otm_sample_image.svg';
import incorrect from 'assets/incorrect_otm_sample_image.svg';
import '../../../utils/native_listner_otm';
import $ from 'jquery';

import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
// import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { getBase64 } from 'utils/functions';
import { nativeCallback } from '../../../utils/native_callback';
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      openDialog: false,
      fileUploaded: false,
      openDialogOldClient: false,
      productName: getConfig().productName
    }
    this.handleContinue = this.handleContinue.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showLoaderNative = this.showLoaderNative.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
  }

  componentWillMount() {

    if (!getConfig().campaign_version && !getConfig().html_camera) {
      this.setState({
        openDialogOldClient: true
      })
    }
  }

  componentDidMount() {
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.setState({
            openDialog: false
          });
        }
      });

      window.callbackWeb.add_listener({
        type: 'native_receiver_image',
        show_loader: function (show_loader) {

          that.showLoaderNative();
        }
      });
    } else {
      window.PaymentCallback.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.setState({
            openDialog: false
          });
        }
      });

      window.PaymentCallback.add_listener({
        type: 'native_receiver_image',
        show_loader: function (show_loader) {

          that.showLoaderNative();
        }
      });
    }
  }

  navigate = (pathname) => {
    if (pathname === 'send-email') {
      this.sendEvents('resend otm');
    }
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Upload',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Upload Form',
        'form_image': !this.state.fileUploaded ? 'empty' : this.state.method_name === 'open_camera' ? 'camera' : 'gallery'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  sendEventsPopup(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Upload',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Instruction Popup'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {

    if (!this.state.imageBaseFile) {
      return;
    }
    this.uploadDocs(this.state.imageBaseFile);
  }

  mergeDocs(file) {

    this.setState({
      openDialog: false,
      imageBaseFile: file,
      fileUploaded: true,
      show_loader: true
    })

    let that = this
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img
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

  showLoaderNative() {
    this.setState({
      show_loader: true
    })
  }

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
              openDialog: false,
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
    } else {
      window.PaymentCallback[method_name]({
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
              openDialog: false,
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
            }
          } catch (e) {
            // 
          }
        }
      });

      window.PaymentCallback.add_listener({
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

  startUpload(method_name, doc_type, doc_name, doc_side) {
    if (this.state.cameraOpened && !getConfig().Android) {
      this.setState({
        cameraOpened: false
      })
      return;
    }
    this.sendEvents(method_name);
    this.setState({
      openDialog: true,
      method_name: method_name,
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side
    })

  }


  async uploadDocs(file) {

    this.setState({
      show_loader: true
    })
    this.sendEvents('next');
    var uploadurl = '/api/mandate/upload/image/' + this.state.params.key;
    const data = new FormData()
    data.append('res', file, file.doc_type)

    try {
      const res = await Api.post(uploadurl, data);
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.result.message === 'success') {
        this.navigate('upload-success');
      } else {

        toast(res.pfwresponse.result.error || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }

  handleClose() {
    this.sendEventsPopup('back');
    this.setState({
      openDialog: false,
      show_loader: false
    });

    if (this.state.openDialogOldClient) {
      nativeCallback({ action: 'exit' });
    }
  }

  openCameraWeb() {
    $("input").trigger("click");
    this.setState({
      cameraOpened: false
    })
  }

  handleContinue() {
    this.sendEventsPopup('next');
    if (this.state.openDialogOldClient) {
      if (getConfig().Android) {
        nativeCallback({ action: 'exit' });
      } else {
        nativeCallback({ action: 'exit' });
      }

      return;
    }
    this.setState({
      openDialog: false,
      cameraOpened: true
    })
    setTimeout(
      function () {
        if (getConfig().html_camera) {
          this.openCameraWeb();
        } else {
          this.native_call_handler(this.state.method_name, this.state.doc_type, this.state.doc_name, this.state.doc_side);
        }
      }
        .bind(this),
      100
    );

  }


  renderHtmlCamera() {
    return (
      <div>
        {!this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
          textAlign: 'center', fontWeight: 600
        }}>
          <div>Upload OTM Form</div>
          <div style={{ margin: '20px 0 20px 0' }}>
            <div onClick={() => this.startUpload('open_camera', 'otm', 'otm.jpg')} style={{
              textAlign: 'center',
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
              <img src={this.state.productName !== 'fisdom' ? camera_finity : camera_green} alt="OTM"></img>
              <div style={{ color: getConfig().secondary }}>Click here to upload</div>
            </div>
          </div>
        </div>}
        {this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '0px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>
            <img style={{ width: '100%', height: 300 }} src={this.state.imageBaseFileShow} alt="OTM" />
          </div>
          <div style={{ margin: '20px 0 20px 0' }}>
            <div onClick={() => this.startUpload('open_camera', 'otm', 'otm.jpg')} style={{
              textAlign: 'center'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
              <img src={camera_grey} alt="OTM"></img>
              <div style={{color: getConfig().secondary }}>Click here to upload</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  renderNativeCamera() {
    return (
      <div>
        {!this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
          textAlign: 'center', fontWeight: 600
        }}>
          <div>Upload OTM Form</div>
          <div style={{ margin: '20px 0 20px 0' }}>
            <div onClick={() => this.startUpload('open_camera', 'otm', 'otm.jpg')} style={{
              width: '50%', float: 'left',
              textAlign: 'center', borderRight: '1px solid #e1e1e1'

            }}>
              <img src={this.state.productName !== 'fisdom' ? camera_finity : camera_green} alt="OTM"></img>
              <div style={{ color: '#28b24d' }}>Open Camera</div>
            </div>
            <div onClick={() => this.startUpload('open_gallery', 'otm', 'otm.jpg')} style={{ textAlign: 'center' }}>
              <img src={gallery_green} alt="OTM"></img>
              <div style={{ color: '#28b24d' }}>Open Gallery</div>
            </div>
          </div>
        </div>}
        {this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '0px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>
            <img style={{ width: '100%', height: 300 }} src={this.state.imageBaseFileShow} alt="OTM" />
          </div>
          <div style={{ margin: '20px 0 20px 0' }}>
            <div onClick={() => this.startUpload('open_camera', 'otm', 'otm.jpg')} style={{
              width: '50%', float: 'left',
              textAlign: 'center', borderRight: '1px solid #e1e1e1'
            }}>
              <img src={camera_grey} alt="OTM"></img>
              <div style={{ color: '#b4b4b4' }}>Open Camera</div>
            </div>
            <div onClick={() => this.startUpload('open_gallery', 'otm', 'otm.jpg')} style={{ textAlign: 'center' }}>
              <img src={gallery_grey} alt="OTM"></img>
              <div style={{ color: '#b4b4b4' }}>Open Gallery</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  renderDialog() {
    return (
      <Dialog
        fullWidth={true}
        id="succes"
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="payment-dialog" id="alert-dialog-description">
            <div style={{
              color: '#4a4a4a', fontSize: 16, margin: '10px 0 10px 0',
              fontWeight: 600, textAlign: 'center'
            }}>
              Upload signed OTM form
            </div>
            <div style={{ color: '#878787', fontSize: 16, marginBottom: 8 }}>
              Two important things to consider:
            </div>
            <div style={{ color: '#878787', fontSize: 16, marginBottom: 8 }}>
              1. Please make sure that the uploaded image is in
  landscape format
            </div>
            <div style={{ color: '#878787', fontSize: 16, marginBottom: 8 }}>
              2. Ensure that the edges are NOT cropped
            </div>
            <div style={{ display: 'inline-flex' }}>
              <img style={{ width: '48%', marginRight: 7 }} src={correct} alt="OTM" />
              <img style={{ width: '48%' }} src={incorrect} alt="OTM" />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth={true}
            variant="raised"
            size="large"
            color="secondary"
            onClick={this.handleContinue}
            autoFocus>Continue
      </Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderDialogOldClient() {
    return (
      <Dialog
        fullWidth={true}
        id="succes"
        open={this.state.openDialogOldClient}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="payment-dialog" id="alert-dialog-description">
            <div style={{
              color: '#4a4a4a', fontSize: 16, margin: '10px 0 10px 0',
              fontWeight: 600, textAlign: 'center'
            }}>
              Upload/Send signed OTM form
            </div>
            <div style={{ color: '#878787', fontSize: 16, marginBottom: 8 }}>
              This version of Finity app doesn’t support upload feature.
              {getConfig().Android && <span>Either go to Play store and update your app to the latest version to upload,
              or you can courier the signed bank mandate form to the following address.</span>}
              {getConfig().iOS && <span>Either go to App store and update your app to the latest version to upload,
              or you can courier the signed bank mandate form to the following address.</span>}
            </div>
            <div className="process-address">
              <div className="process-address1">Courier to:</div>
              <div className="process-address2">
                Queens Paradise, No. 16/1, 1st Floor, Curve Road, Shivaji Nagar,
                 Bengaluru, Karnataka 560051
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth={true}
            variant="raised"
            size="large"
            color="secondary"
            onClick={this.handleContinue}
            autoFocus>Ok
      </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getPhoto(e) {

    e.preventDefault();

    let file = e.target.files[0];

    let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];

    if (acceptedType.indexOf(file.type) === -1) {
      toast('Please select image file only');
      return;
    }

    let that = this;
    file.doc_type = file.type;
    this.setState({
      imageBaseFile: file
    })
    getBase64(file, function (img) {
      that.setState({
        imageBaseFileShow: img,
        fileUploaded: true
      })
    });

  }

  renderMainUi() {
    if (!this.state.openDialog && !this.state.openDialogOldClient) {
      return (

        <div>
          {getConfig().html_camera && this.renderHtmlCamera()}
          {!getConfig().html_camera && this.renderNativeCamera()}
          <div style={{ margin: '20px 0 20px 0', textAlign: 'center', display: 'flex' }}>
            <div style={{ borderBottom: '1px solid #e1e1e1', width: '100%' }}></div>
            {/* <span style={{
              backgroundColor: 'white', width: '12%',
              top: 6, position: 'relative'
            }}>OR</span> */}
            {/* <div style={{ borderBottom: '1px solid #e1e1e1', width: '45%' }}></div> */}
          </div>
          <div style={{
            border: '1px dashed #e1e1e1', padding: '30px 0px 30px 0px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#4a4a4a', fontSize: 14, fontWeight: 600 }}>
              Didn’t recieve my OTM form?
            </div>
            <div onClick={() => this.navigate('send-email')} style={{ color: getConfig().secondary, fontSize: 14, fontWeight: 500, marginTop: 10 }}>
              Send me again.
          </div>
          </div>
        </div>
      )
    }
    return null;
  }


  render() {
    return (
      // <div>
      //   {this.renderMainUi()}
      //   {this.renderDialog()}
      //   {this.renderDialogOldClient()}
      // </div>

      <Container
        showLoader={this.state.show_loader}
        title="Upload Bank Mandate(OTM) Form"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save and Continue"
        isDisabled={!this.state.imageBaseFile}
        popupOpen={this.state.openDialog}
        noFooter={this.state.openDialog}
        noHeader={this.state.openDialog}
        events={this.sendEvents('just_set_events')}
      >
        {this.renderMainUi()}
        {this.renderDialog()}
        {this.renderDialogOldClient()}

      </Container >
    );
  }
}

export default Upload;
