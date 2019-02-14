import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import camera_green from 'assets/take_pic_green.svg';
import camera_grey from 'assets/take_pic_grey.svg';
import gallery_green from 'assets/go_to_gallery_green.svg';
import gallery_grey from 'assets/go_to_gallery_grey.svg';
import sample from 'assets/mandate_pending_icon.svg';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
// import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      openDialog: false,
      fileUploaded: false
    }
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
    try {

      // let score = JSON.parse(window.localStorage.getItem('score'));
      let score;
      const res = await Api.get('/api/risk/profile/user/recommendation');
      if (res.pfwresponse.Upload.score) {
        score = res.pfwresponse.Upload.score;
        this.setState({
          score: score,
          show_loader: false
        });
      } else {
        this.navigate('intro');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

    // window.PaymentCallback.add_listener({
    //   type: 'upload_doc',
    //   upload: function (file) {
    //     console.log("file from native");
    //     console.log(file)
    //     // that.historyGoBack();
    //   }
    // });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {

    this.navigate('recommendation');
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
    this.uploadDocs(file);
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
        that.mergeDocs(file);
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

    // this.setState({
    //   openDialog: true,
    //   doc_type: doc_type,
    //   doc_name: doc_name,
    //   doc_side: doc_side
    // })

    this.native_call_handler(method_name, doc_type, doc_name, doc_side);
  }


  async uploadDocs(file) {

    // this.setState({
    //   show_loader: true
    // })
    console.log('uploadDocs')
    var uploadurl = '/api/mandate/upload/image/' + this.state.params.key;
    var data = {
      res: file
    }

    // const res = await Api.post(uploadurl, data);

    // if (res.pfwresponse.result.message === 'success') {

    // }

  }

  handleClose() {
    this.setState({
      openDialog: false
    });
  }

  handleContinue() {
    // this.setState({
    //   openDialog: false
    // });
    this.native_call_handler(this.state.method_name, this.state.doc_type, this.state.doc_name, this.state.doc_side);
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
              <img src={sample} alt="OTM" />
              <img style={{ marginLeft: 20 }} src={sample} alt="OTM" />
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
    if (!this.state.openDialog) {
      return (
        <Container
          showLoader={this.state.show_loader}
          title="Upload Bank Mandate(OTM) Form"
          handleClick={this.handleClick}
          edit={this.props.edit}
          type={this.state.type}
          noFooter={true}
        >
          {!this.state.fileUploaded && <div style={{
            border: '1px dashed #e1e1e1', padding: '10px 0px 10px 30px',
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
            border: '1px dashed #e1e1e1', padding: '10px 0px 10px 30px',
            textAlign: 'center'
          }}>
            <div style={{ marginRight: 30 }}>
              <img style={{ width: 308, height: 84 }} src={sample} id="single" alt="Aa" />
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
          <div style={{ margin: '20px 0 20px 0', textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #e1e1e1' }}></div>
            <span style={{
              position: 'absolute', backgroundColor: 'white', width: '8%',
              marginTop: '-10px'
            }}>OR</span>
            <div></div>
          </div>
          <div style={{
            border: '1px dashed #e1e1e1', padding: '30px 0px 30px 20px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#4a4a4a', fontSize: 14, fontWeight: 500 }}>
              Didn’t recieve my OTM form?
          </div>
            <div style={{ color: '#28b24d', fontSize: 14, fontWeight: 500, marginTop: 10 }}>
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
      </div>
    );
  }
}

export default Upload;
