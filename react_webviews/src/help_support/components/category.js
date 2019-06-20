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

class Category extends Component {
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

	componentDidMount() {
		start_time = new Date();
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

	backButtonEvent() {
    let eventObj = {
      "event_name": 'help_n_support',
      "properties": {
        "user_action": 'back',
				"screen_name": 'sub_category',
				'time_spent': ''
      }
    };

		return eventObj;
  }

	navigate = (pathname, data) => {
		let eventObj = {
			"event_name": "help_n_support",
			"properties": {
				"screen_name": 'sub_category',
				"user_action": 'next',
				'sub_category_clicked': data.name,
				'time_spent': this.calcReadtime(new Date())
			}
		};

		nativeCallback({ events: eventObj });

    if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
				search: getConfig().searchParams,
				state: {
					questions: data,
					category: this.props.location.state.category,
					subcategory: {
						id: data.subcategory_id,
						name: data.name
					}
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

	renderSubCategories() {
		return this.props.location.state.subcategories.sub_category.map((item, i) => {
			return (
				<div className="combine-card" key={i}>
					<Grid container spacing={24} alignItems="center" className="HelpGrid"  onClick={() => this.navigate('/help/questions', item)}>
						<Grid item xs={12}>
							<div className="card-title">{item.name}</div>
						</Grid>
					</Grid>
				</div>
			)
		});
	}

	calcReadtime = (endtime) => {
		var new_date = new Date(endtime - start_time);
		return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
	}

	render() {
		const subcategories = this.props.location.state.subcategories;

		return (
			<Container
        title={'Help & Support'}
				type={this.state.type}
				noFooter={true}
				events={this.backButtonEvent()}
      >
				<div className="Help pad20">
					<div className="section-head">
						<div className="main-title">
							{subcategories.name}
						</div>
						<div className="sub-title">
							Your query is related to
						</div>
					</div>
					<div className="section-card">
						{subcategories && this.renderSubCategories()}
					</div>
				</div>
				{this.renderDialog()}
			</Container>
		);
	}
}

export default Category;