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
import { numDifferentiationInr } from 'utils/validators';
import Api from 'utils/api';
import camera_grey from 'assets/take_pic_grey.svg';
import $ from 'jquery';

class MandatePan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      withProvider: true,
      fileUploaded: false,
      get_lead: true,
      getLeadBodyKeys: ['personal_info', 'vendor_info', 'document_info'],
      personal_info: {},
      application_info: {}
    }

    this.initialize = initialize.bind(this);
    this.native_call_handler = this.native_call_handler.bind(this);
  }

  componentWillMount() {
    this.initialize();
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
    let lead = this.state.lead;

    let vendor_info = lead.vendor_info || {};
    let bottomButtonData = {
      leftTitle: 'Personal loan',
      leftSubtitle: numDifferentiationInr(vendor_info.approved_amount_decision)
    }

    let document_info = lead.document_info || {};
    let document_url = document_info.pan ?  document_info.pan.serving_url : '';
    let fileUploaded = !!document_url;

    this.setState({
      personal_info: lead.personal_info || {},
      application_info: lead.application_info || {},
      bottomButtonData: bottomButtonData,
      vendor_info: vendor_info,
      document_url: document_url,
      document_info: document_info,
      fileUploaded: fileUploaded
    })

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'pan upload',
        "type": this.state.type === 'open_camera' ? 'camera' : this.state.type === 'open_gallery' ? 'gallery' : 'none',
        "pan_uploaded": this.state.fileUploaded ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  conversionCallBack = async () => {
    let body = {
      "request_type": "conversion"
    }

    let resultData = await this.callBackApi(body);
    if (resultData.callback_status) {
      this.navigate('bank', {
        params: {
          fromPanScreen: true
        }
      });
    } else {
      let searchParams = getConfig().searchParams + '&status=sorry';
      this.navigate('instant-kyc-status', { searchParams: searchParams });
    }
  }

  checkNextState = () => {
    if (this.state.vendor_info.dmi_loan_status === 'opportunity') {
      this.navigate('bank', {
        params: {
          fromPanScreen: true
        }
      });
    } else {
      this.conversionCallBack();
    }
  }

  async uploadDocs(file) {

    this.setState({
      show_loader: true
    })
    this.sendEvents('next');

    var uploadurl = '/relay/api/loan/document/upload';
    const data = new FormData()
    data.append('res', file);
    data.append('doc_type', 'pan');
    data.append('application_id', this.state.application_id);

    try {
      const res = await Api.post(uploadurl, data);


      var resultData = res.pfwresponse.result || {};
      if (res.pfwresponse.status_code === 200 && resultData.message) {

        this.checkNextState();

      } else {

        this.setState({
          show_loader: false
        });

        toast(resultData.error || 'Something went wrong');
      }
    } catch (err) {
      console.log(err);
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

  openCameraWeb() {
    $("input").trigger("click");
  }

  startUpload(method_name, doc_type, doc_name, doc_side) {
    this.setState({
      type: method_name
    })

    if (getConfig().html_camera) {
      this.openCameraWeb();
    } else {
      this.native_call_handler(method_name, doc_type, doc_name, doc_side);
    }

  }

  getPhoto = (e) => {

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


  renderHtmlCamera() {
    return (
      <div>
        {!this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 0px 0px',
          textAlign: 'center', fontWeight: 600
        }}>
          <div>Front side of PAN card</div>
          <div style={{ margin: '20px 0 20px 0', cursor: 'pointer'  }}>
            <div onClick={() => this.startUpload('open_camera', 'pan', 'pan.jpg')} style={{
              textAlign: 'center', cursor: 'pointer'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
              <img src={camera_green} alt="PAN"></img>
              <div style={{ color: '#28b24d' }}>Click here to upload</div>
            </div>
          </div>
        </div>}
        {this.state.fileUploaded && <div style={{
          border: '1px dashed #e1e1e1', padding: '0px 0px 0px 0px',
          textAlign: 'center'
        }}>
          <div>
            <img style={{ width: '100%', height: 300 }} src={this.state.imageBaseFileShow || this.state.document_url} alt="PAN" />
          </div>
          <div style={{ margin: '20px 0 20px 0', cursor: 'pointer' }}>
            <div onClick={() => this.startUpload('open_camera', 'pan', 'pan.jpg')} style={{
              textAlign: 'center'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={this.getPhoto} id="myFile" />
              <img src={camera_grey} alt="PAN"></img>
              <div style={{ color: '#b4b4b4' }}>Click here to upload new</div>
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
            <img style={{ width: '100%', height: 300 }} src={this.state.imageBaseFileShow || this.state.document_url} alt="PAN" />
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

    if (this.state.imageBaseFile) {
      this.uploadDocs(this.state.imageBaseFile);
    } else {
      this.checkNextState();
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload PAN"
        events={this.sendEvents('just_set_events')}
        disable={!this.state.fileUploaded}
        handleClick={this.handleClick}
        buttonTitle="CONTINUE"
        withProvider={this.state.withProvider}
        buttonData={this.state.bottomButtonData}
      >
        <div className="common-top-page-subtitle">
          PAN Card: {this.state.personal_info.pan_no}
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
          {getConfig().html_camera && this.renderHtmlCamera()}
          {!getConfig().html_camera && this.renderNativeCamera()}
        </div>
      </Container>
    );
  }
}

export default MandatePan;
