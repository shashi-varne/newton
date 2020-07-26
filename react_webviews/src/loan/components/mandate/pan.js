import React, { Component } from 'react';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import camera_green from 'assets/take_pic_green.svg';
import gallery_green from 'assets/go_to_gallery_green.svg';
import text_error_icon from 'assets/text_error_icon.svg';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getConfig } from 'utils/functions';
import { getBase64 } from 'utils/functions';
import { storageService, numDifferentiationInr } from 'utils/validators';
import Api from 'utils/api';

class MandatePan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      withProvider: true,
      fileUploaded: false
    }

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(200000)
    }

    this.setState({
      bottomButtonData: bottomButtonData
    })
  }

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

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  // conversionCallBack = () => {
  //   let body = {
  //     "request_type": "conversion"
  //   }

  //   let resultData = await this.callBackApi(body);
  //   if (resultData.callback_status) {
  //     // upload pan and redirect to e-mandate
  //   } else {
  //     let searchParams = getConfig().searchParams + '&status=sorry';
  //     this.navigate('instant-kyc-status', { searchParams: searchParams });
  //   }
  // }

  async uploadDocs(file) {

    this.setState({
      show_loader: true
    })
    this.sendEvents('next');
    let application_id = storageService().get('loan_application_id')
    var uploadurl = '/api/document/loan/upload'
    const data = new FormData()
    data.append('res', file, file.doc_type, application_id)

    try {
      const res = await Api.post(uploadurl, data);
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.result.message === 'success') {
        this.navigate('bank');
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

  mergeDocs(file) {

    this.setState({
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

  startUpload(method_name, doc_type, doc_name, doc_side) {
    this.sendEvents(method_name);
    this.native_call_handler(method_name, doc_type, doc_name, doc_side);

  }

  renderNativeCamera() {
    return (
      <div>
        {!this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>Front side of PAN card</div>
          <div style={{ margin: '20px 0 20px 0', fontSize: '12px', lineHeight: '20px' }}>
            <div onClick={() => this.startUpload('open_camera', 'pan', 'pan.jpg')} style={{
              width: '50%', float: 'left',
              textAlign: 'center', borderRight: '1px solid #e1e1e1'

            }}>
              <img src={camera_green} alt="OTM"></img>
              <div style={{ color: '#28b24d', fontWeight: 600 }}>OPEN CAMERA</div>
            </div>
            <div onClick={() => this.startUpload('open_gallery', 'pan', 'pan.jpg')} style={{ textAlign: 'center' }}>
              <img src={gallery_green} alt="OTM"></img>
              <div style={{ color: '#28b24d', fontWeight: 600 }}>GO TO GALLERY</div>
            </div>
          </div>
        </div>}
        {this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '0px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>
            <img style={{ width: '100%', height: 300 }} src={this.state.imageBaseFileShow} alt="PAN" />
          </div>
          <div style={{ margin: '20px 0 20px 0', fontSize: '12px', lineHeight: '20px' }}>
            <div onClick={() => this.startUpload('open_camera', 'pan', 'pan.jpg')} style={{
              width: '50%', float: 'left',
              textAlign: 'center', borderRight: '1px solid #e1e1e1'
            }}>
              <div style={{ color: '#28b24d', fontWeight: 600 }}>OPEN CAMERA</div>
            </div>
            <div onClick={() => this.startUpload('open_gallery', 'pan', 'pan.jpg')} style={{ textAlign: 'center' }}>
              <div style={{ color: '#28b24d', fontWeight: 600 }}>GO TO GALLERY</div>
            </div>
          </div>
        </div>}
      </div>
    );
  }

  handleClick = () => {
    this.sendEvents('next');

    this.setState({
      show_loader: true
    })

    if (!this.state.imageBaseFile) {
      return;
    }
    this.uploadDocs(this.state.imageBaseFile);
    // after api response hit this this.conversionCallBack();

  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload PAN"
        events={this.sendEvents('just_set_events')}
        isDisabled={!this.state.imageBaseFile}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        withProvider={this.state.withProvider}
        buttonData={this.state.bottomButtonData}
      >
        <div className="common-top-page-subtitle">
          PAN Card: CXIPP4122M
        </div>
        <div style={{ margin: '30px 0 20px 0', display: 'flex', position: 'relative', background: '#FDF5F6', alignItems: 'baseline' }} className="highlight-text highlight-color-info">
          <div>
            <img className="highlight-text11"
              src={text_error_icon}
              alt="info" />
          </div>

          <div>
            <div className="highlight-text1">
              <div className="highlight-text2" style={{ color: '#767E86', marginLeft: 7 }}>
                Photo of PAN should be clear and there should be no exposure of flash light.
              </div>
            </div>
          </div>
        </div>
        <div className="loan-mandate-pan">
          {this.renderNativeCamera()}
        </div>
      </Container>
    );
  }
}

export default MandatePan;
