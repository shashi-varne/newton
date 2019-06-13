import React, { Component } from 'react';

import qs from 'qs';
import Grid from '@material-ui/core/Grid';
import Container from '../common/Container';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

let start_time = '';

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
	}

	navigate = (pathname, data=[]) => {
		if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
				search: getConfig().searchParams,
				state: {
					answer: data,
					title: this.props.location.state.questions.name,
					category: this.props.location.state.category,
					subcategory: this.props.location.state.subcategory
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

	renderQuestions() {
		return this.props.location.state.questions.questions.map((item, i) => {
			return (
				<div className="combine-list" key={i}>
					<Grid container spacing={24} alignItems="center" className="HelpGrid" onClick={() => {this.navigate('/help/answer', item); this.sendQuestionEvent(item.question_id)}}>
						<Grid item xs={12}>
							<div className="card-title">{item.name}</div>
						</Grid>
					</Grid>
				</div>
			)
		});
	}

	backButtonEvent() {
    let eventObj = {
      "event_name": 'help_n_support',
      "properties": {
        "user_action": 'back',
				"screen_name": 'questions',
				'time_spent': ''
      }
    };

		return eventObj;
  }

	sendQuestionEvent(id) {
		let eventObj = {
			"event_name": "help_n_support",
			"properties": {
				"screen_name": 'questions',
				"user_action": 'next',
				'question_clicked': id,
				'time_spent': this.calcReadtime(new Date())
			}
		};

		nativeCallback({ events: eventObj });
	}

	sendEvent() {
		let eventObj = {
			"event_name": "help_n_support",
			"properties": {
				"screen_name": 'questions',
				"user_action": 'unable_to_find_clicked',
				'time_spent': this.calcReadtime(new Date())
			}
		};

		nativeCallback({ events: eventObj });
	}

	calcReadtime = (endtime) => {
		var new_date = new Date(endtime - start_time);
		return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
	}

	render() {
		const questions = this.props.location.state.questions;

		return (
			<Container
        title={'Help & Support'}
				type={this.state.type}
				background="white"
				noFooter={true}
				events={this.backButtonEvent()}
      >
				<div className="Help pad20">
					<div className="section-head">
						<div className="main-title dark">
							{questions.name}
						</div>
					</div>
				</div>
				<div className="section-card no-margin">
					{questions && this.renderQuestions()}
				</div>
				<div className="cta">
					<button onClick={() => {this.navigate('/help/writetous'); this.sendEvent();}}>
						Unable to find my query
					</button>
				</div>
				{this.renderDialog()}
			</Container>
		);
	}
}

export default Question;