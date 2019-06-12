import React, { Component } from 'react';

import qs from 'qs';
import Container from '../common/Container';
import Api from 'utils/api';
import { ToastContainer } from 'react-toastify';
import toast from '../../common/ui/Toast';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import file from 'assets/file.svg';
import '../../utils/native_listner_otm';
import { nativeCallback } from 'utils/native_callback';

let start_time = '';

class Writetous extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show_loader: false,
			subcategory: '',
			query: '',
			type: '',
			openDialog: false,
			params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0
		}
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
	}

	componentDidMount() {
		start_time = new Date();
		this.setState({
			subcategory: this.props.location.state.subcategory.name
		});
	}

	navigate = (pathname) => {
    if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
				search: '?base_url=' + this.state.params.base_url
      });
    } else {
      this.setState({
        openDialog: true
      });
    }
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
		
		if (this.state.query) {
			
			try {
				let bodyFormData = new FormData();
				bodyFormData.set('category_id', this.props.location.state.category.i);
				bodyFormData.set('subcategory_id', this.props.location.state.subcategory.id);
				bodyFormData.set('question_id', '');
				bodyFormData.set('question', '');
				bodyFormData.set('category', this.props.location.state.category.name);
				bodyFormData.set('subcategory', this.props.location.state.subcategory.name);
				bodyFormData.set('user_query', this.state.query);
				bodyFormData.set('query_subject', this.state.subcategory);
				if (this.state.fileUploaded) {
					bodyFormData.append('res', this.state.imageBaseFile);
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

				nativeCallback({ action: 'acknowledge_feedback' });
			} catch (error) {
				this.setState({
					show_loader: false
				});
				toast('Something went wrong');
			}
		}
	}

	handleChange = () => event => {
		this.setState({
			query: event.target.value
		});
	}

	saveFile(file) {
    this.setState({
      imageBaseFile: file,
      fileUploaded: true
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
							toast('Please select image file');
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
		this.native_call_handler('open_gallery', 'help_support');
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

	render() {
		return (
			<Container
				showLoader={this.state.show_loader}
        title={'Write to us'}
				type={this.state.type}
				buttonTitle="Send"
				handleClick={this.handleClick}
				events={this.backButtonEvent()}
      >
				<div className="Help pad20">
					<div className="InputField">
						<div className="label">Subject</div>
						<input type="text" value={this.state.subcategory} readOnly />
					</div>
					<div className="InputField">
						<div className="label">Write the query/feedback</div>
						<textarea rows="8" value={this.state.query} onChange={this.handleChange()}></textarea>
					</div>
					<div className="InputField">
						<div className="upload" onClick={() => this.handleImage()}>
							<img src={file} alt=""/>
							<span>Upload attachments</span>
						</div>
					</div>
				</div>
				{this.renderDialog()}
				<ToastContainer autoClose={3000} />
			</Container>
		);
	}
}

export default Writetous;