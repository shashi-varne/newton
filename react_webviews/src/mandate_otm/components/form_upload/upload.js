import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import camera from 'assets/take_pic_green.svg';
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
      type: ''
    }
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

    this.setState({
      imageBaseFile: file
    })
    this.getBase64(file, function (img) {
      document.getElementById('single').setAttribute('src', img);
    });
    this.uploadDocs(file);
  };

  native_call_handler(method_name, doc_type, doc_name, doc_side) {

    window.PlutusSdk[method_name]({
      type: 'doc',
      doc_type: doc_type,
      doc_name: doc_name,
      doc_side: doc_side,

      // callbacks from native
      upload: function upload(file) {

        try {
          this.setState({
            docType: this.doc_type,
            docName: this.docName,
            doc_side: this.doc_side
          })
          switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/bmp':
              this.mergeDocs(file);
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

  startCamera = function (doc_type, doc_name, doc_side) {
    console.log("start camera");
    this.native_call_handler('open_camera', doc_type, doc_name, doc_side);
  }

  fileSelect(doc_type, doc_name, doc_side) {
    console.log("upload file");
    this.native_call_handler('open_gallery', doc_type, doc_name, doc_side);
  }

  async uploadDocs(file) {

    this.setState({
      show_loader: true
    })

    var uploadurl = '/api/mandate/upload/image/' + this.state.params.key;
    var data = {
      res: file
    }

    const res = await Api.post(uploadurl, data);

    if (res.pfwresponse.result.message === 'success') {

    }

  }


  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Upload Bank Mandate(OTM) Form"
        handleClick={this.handleClick}
        edit={this.props.edit}
        type={this.state.type}
        noFooter={true}
      >
        <div style={{
          border: '1px dashed #e1e1e1', padding: '10px 0px 10px 20px',
          textAlign: 'center'
        }}>
          <div>Upload OTM Form</div>
          <div style={{ margin: '20px 0 20px 0' }}>
            <div onClick={() => this.startCamera('otm', 'otm.jpg')} style={{ width: '50%', float: 'left', textAlign: 'center' }}>
              <img src={camera} alt="OTM"></img>
              <div>Open Camera</div>
            </div>
            <div onClick={() => this.fileSelect('files', 'otm')} style={{ textAlign: 'center' }}>
              <img src={camera} alt="OTM"></img>
              <div>Open Gallery</div>
            </div>
          </div>
        </div>
        <div style={{ margin: '20px 0 20px 0', textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid grey' }}></div>
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
          <div>
            Didn’t recieve my OTM form?
          </div>
          <div>
            Send me again.
          </div>
        </div>

      </Container>
    );
  }
}

export default Upload;
