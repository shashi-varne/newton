import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import camera_green from 'assets/take_pic_green.svg';
import camera_grey from 'assets/take_pic_grey.svg';
import gallery_green from 'assets/go_to_gallery_green.svg';
import gallery_grey from 'assets/go_to_gallery_grey.svg';
import correct from 'assets/correct_otm_sample_image.svg';
import incorrect from 'assets/incorrect_otm_sample_image.svg';

import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
// import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from '../../../utils/native_callback';
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      openDialog: false,
      fileUploaded: false,
      openDialogOldClient: false
    }
    this.handleContinue = this.handleContinue.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway',
        link: 'https://go.onelink.me/6fHB/b750d9ac'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime',
        link: 'https://go.onelink.me/OFQN/FisdomPrime'
      });
    } else {
      this.setState({
        type: 'fisdom',
        link: 'http://m.onelink.me/32660e84'
      });
    }

    if (!getConfig().campaign_version) {
      this.setState({
        openDialogOldClient: true
      })
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {

    this.uploadDocs(this.state.imageBaseFile);
  }

  getBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callback(reader.result);
    };
    reader.onerror = function (error) {
      callback(null);
    };
  }

  mergeDocs(file) {

    console.log("mergedocs");
    this.setState({
      imageBaseFile: file,
      fileUploaded: true
    })
    this.getBase64(file, function (img) {
      document.getElementById('single').setAttribute('src', img);
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
    window.PaymentCallback[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,
      // callbacks from native
      upload: function upload(file) {
        console.log("file uploaded");
        console.log(file.type);
        try {
          that.setState({
            docType: this.doc_type,
            docName: this.docName,
            doc_side: this.doc_side
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
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {

    this.setState({
      openDialog: true,
      method_name: method_name,
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side
    })

    // this.native_call_handler(method_name, doc_type, doc_name, doc_side);
  }


  async uploadDocs(file) {

    this.setState({
      show_loader: true
    })
    console.log('uploadDocs')
    var uploadurl = '/api/mandate/upload/image/' + this.state.params.key;
    const data = new FormData()
    data.append('res', file, file.doc_type)

    try {
      const res = await Api.post(uploadurl, data);
      console.log(JSON.stringify(res.pfwresponse.result));
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
    this.setState({
      openDialog: false
    });

    if (this.state.openDialogOldClient) {
      nativeCallback({ action: 'exit' });
    }
  }

  handleContinue() {
    // this.setState({
    //   openDialog: false
    // });
    if (this.state.openDialogOldClient) {
      if (getConfig().Android) {
        nativeCallback({
          action: 'open_in_browser', message: {
            url: this.state.link
          }
        });
      } else {
        nativeCallback({ action: 'exit' });
      }

      return;
    }
    this.setState({
      openDialog: false,
      show_loader: true
    })
    setTimeout(
      function () {
        this.native_call_handler(this.state.method_name, this.state.doc_type, this.state.doc_name, this.state.doc_side);
      }
        .bind(this),
      1000
    );
    // this.native_call_handler(this.state.method_name, this.state.doc_type, this.state.doc_name, this.state.doc_side);
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
              fontWeight: 500, textAlign: 'center'
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
              fontWeight: 500, textAlign: 'center'
            }}>
              Upload/Send signed OTM form
            </div>
            <div style={{ color: '#878787', fontSize: 16, marginBottom: 8 }}>
              This version of MyWay app doesn’t support upload feature.
              {getConfig().Android && <span>Either update your app to the latest version to upload,
              or you can courier the signed bank mandate form to the following address.</span>}
              {getConfig().iOS && <span>You can courier the signed bank mandate form to the following address.</span>}
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
            autoFocus>Continue
      </Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderMainUi() {
    if (!this.state.openDialog && !this.state.openDialogOldClient) {
      return (
        <Container
          showLoader={this.state.show_loader}
          title="Upload Bank Mandate(OTM) Form"
          handleClick={this.handleClick}
          edit={this.props.edit}
          type={this.state.type}
          buttonTitle="Save and Continue"
        >
          {!this.state.fileUploaded && <div style={{
            border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
            textAlign: 'center'
          }}>
            <div>Upload OTM Form</div>
            <div style={{ margin: '20px 0 20px 0' }}>
              <div onClick={() => this.startUpload('open_camera', 'otm', 'otm.jpg')} style={{
                width: '50%', float: 'left',
                textAlign: 'center', borderRight: '1px solid #e1e1e1'
              }}>
                <img src={camera_green} alt="OTM"></img>
                <div style={{ color: '#28b24d' }}>Open Camera</div>
              </div>
              <div onClick={() => this.startUpload('open_gallery', 'otm', 'otm.jpg')} style={{ textAlign: 'center' }}>
                <img src={gallery_green} alt="OTM"></img>
                <div style={{ color: '#28b24d' }}>Open Gallery</div>
              </div>
            </div>
          </div>}
          {this.state.fileUploaded && <div style={{
            border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
            textAlign: 'center'
          }}>
            <div>
              {this.state.imageBaseFile &&
                <img style={{ width: 300, height: 300 }} src="" id="single" alt="OTM" />}
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
          <div style={{ margin: '20px 0 20px 0', textAlign: 'center', display: 'flex' }}>
            <div style={{ borderBottom: '1px solid #e1e1e1', width: '45%' }}></div>
            <span style={{
              backgroundColor: 'white', width: '12%',
              top: 6, position: 'relative'
            }}>OR</span>
            <div style={{ borderBottom: '1px solid #e1e1e1', width: '45%' }}></div>
          </div>
          <div style={{
            border: '1px dashed #e1e1e1', padding: '30px 0px 30px 0px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#4a4a4a', fontSize: 14, fontWeight: 500 }}>
              Didn’t recieve my OTM form?
          </div>
            <div onClick={() => this.navigate('send-email')} style={{ color: '#28b24d', fontSize: 14, fontWeight: 500, marginTop: 10 }}>
              Send me again.
          </div>
          </div>

        </Container >
      )
    }
    return null;
  }


  render() {
    return (
      <div>
        {this.renderMainUi()}
        {this.renderDialog()}
        {this.renderDialogOldClient()}
      </div>
    );
  }
}

export default Upload;
