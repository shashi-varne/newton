import React, { Component } from 'react';

import qs from 'qs';
import Container from '../common/Container';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import file from 'assets/file.svg';
import cancel from 'assets/cancel.svg';
import '../../utils/native_listner_otm';
import { nativeCallback } from 'utils/native_callback';
import { isMobile, getConfig } from 'utils/functions';

let start_time = '';

class Writetous extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBaseFile: '',
      fileUploaded: false,
      fileName: '',
      show_loader: false,
      subcategory: '',
      query: '',
      openDialog: false,
      emptyForm: '',
      params: qs.parse(props.history.location.search.slice(1)),
    }
  }

  componentDidMount() {
    start_time = new Date();
    if (this.props.location.state.from === 'answer') {
      this.setState({
        subcategory: this.props.location.state.answer.name
      });
    } else {
      this.setState({
        subcategory: this.props.location.state.title
      });
    }
  }

  navigate = (pathname, data) => {
    if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        state: {
          user: data
        }
      });
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClick = async () => {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'write_to_us',
        'user_action': 'next',
        'query_edit': this.state.query ? 'yes' : 'no',
        'add_attachment': this.state.fileUploaded ? 'yes' : 'no',
        'time_spent': this.calcReadtime(new Date())
      }
    };

    nativeCallback({ events: eventObj });

    if (!this.state.query.trim()) {
      this.setState({
        emptyForm: 'Query/feedback cannot be empty'
      });
      return;
    } else if (this.state.query.trim().length < 10) {
      this.setState({
        emptyForm: 'Minimum 10 characters required'
      });
      return;
    } else if (this.state.query || this.state.fileUploaded) {

      try {
        let bodyFormData = new FormData();
        bodyFormData.set('category_id', this.props.location.state.category.id);
        bodyFormData.set('subcategory_id', this.props.location.state.subcategory.id);
        bodyFormData.set('question_id', (this.props.location.state.from === 'answer') ? this.props.location.state.question.id : '');
        bodyFormData.set('question', (this.props.location.state.from === 'answer') ? this.props.location.state.question.name : '');
        bodyFormData.set('category', this.props.location.state.category.name);
        bodyFormData.set('subcategory', this.props.location.state.subcategory.name);
        bodyFormData.set('user_query', this.state.query.trim());
        bodyFormData.set('query_subject', this.state.subcategory);
        if (this.state.fileUploaded) {
          bodyFormData.append('res', this.state.imageBaseFile, this.state.imageBaseFile.doc_type);
        }

        this.setState({
          show_loader: true
        });
        const feedback = await Api.post('/api/helpandsupport/writetous', bodyFormData);

        if (feedback.pfwresponse.status_code === 200) {
          this.setState({
            query: ''
          });
        }
        this.setState({
          show_loader: false
        });

        this.navigate('/help/thankyou', feedback.pfwresponse.result);
      } catch (error) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    } else {
      this.setState({
        emptyForm: 'Query/feedback cannot be empty'
      })
    }
  }


  handleChange = () => event => {
    this.setState({
      query: event.target.value,
      emptyForm: ''
    });
  }

  saveFile(file) {
    this.setState({
      imageBaseFile: file,
      fileUploaded: true,
      show_loader: false,
      fileName: '1 file attached',
      emptyForm: ''
    });
  }

  native_call_handler(method_name, doc_type) {
    let that = this;
    window.callbackWeb[method_name]({
      type: 'doc',
      doc_type: doc_type,
      // callbacks from native
      upload: function upload(file) {
        try {
          that.setState({
            show_loader: true
          })
          switch (file.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/bmp':
            case 'application/pdf':
              that.saveFile(file);
              break;
            default:
              toast('Please select an image/pdf file');
              that.setState({
                show_loader: false
              })
          }
        } catch (e) {
          // 
        }
      }
    });
  }

  handleImage = () => {
    this.native_call_handler('open_file', 'help_support');
  }

  backButtonEvent() {
    let eventObj = {
      "event_name": 'help_n_support',
      "properties": {
        "user_action": 'back',
        "screen_name": 'write_to_us',
        'time_spent': ''
      }
    };

    return eventObj;
  }

  calcReadtime = (endtime) => {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
  }

  getPhoto = (e) => {
    e.preventDefault();
    let file = e.target.files[0];

    if (file) {
      let acceptedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'application/pdf'];

      if (acceptedType.indexOf(file.type) === -1) {
        toast('Please select image file only');
        return;
      }

      file.doc_type = file.type;

      this.setState({
        imageBaseFile: file,
        fileUploaded: true,
        fileName: file.name,
        emptyForm: ''
      });
    }
  }

  clearFile() {
    this.setState({
      imageBaseFile: null,
      fileName: '',
      fileUploaded: false
    });
  }

  renderAttachment = () => {
    if (isMobile.iOS()) {
      return (
        <div className="InputField">
          <div className="upload">
            <img src={file} alt="" />
            <span>Upload attachments</span>
            <input type="file" onChange={(e) => this.getPhoto(e)} id="myFile" />
          </div>
          {this.state.fileName &&
            <div className="filenameContainer">
              <span className="filename">{this.state.fileName}</span>
              <span><img onClick={() => this.clearFile()} src={cancel} alt="" /></span>
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="InputField">
          <div className="upload" onClick={() => this.handleImage()}>
            <img src={file} alt="" />
            <span>Upload attachments</span>
          </div>
          {this.state.fileName &&
            <div className="filenameContainer">
              <span className="filename">{this.state.fileName}</span>
              <span><img onClick={() => this.clearFile()} src={cancel} alt="" /></span>
            </div>
          }
        </div>
      );
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Write to us'}
        buttonTitle="Send"
        handleClick={this.handleClick}
        events={this.backButtonEvent()}
        classOverRideContainer={'HelpContainer'}
      >
        <div className="Help Form pad20">
          <div className="InputField">
            <div className="label">Subject</div>
            <div className="subject">{this.state.subcategory}</div>
          </div>
          <div className="InputField">
            <div className="label">Write the query/feedback</div>
            <textarea rows="8" value={this.state.query} onChange={this.handleChange()}></textarea>
          </div>
          {this.renderAttachment()}
          <div className="error">{this.state.emptyForm}</div>
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Writetous;