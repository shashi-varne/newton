import React, { Component } from 'react';

import qs from 'qs';
import Grid from '@material-ui/core/Grid';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Api from 'utils/api';
import Container from '../common/Container';
import Card from '../common/Card';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

let start_time = '';

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      categories: null,
      type: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  calcReadtime = (endtime) => {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  async componentDidMount() {
    start_time = new Date();

    try {
      await Api.get('/api/helpandsupport/category').then(res => {
        const { data: { category } } = res.pfwresponse.result;

        let questions_array = [];
        category.forEach((value) => {
          value['sub_category'].forEach((val) => {
            var ques = val['questions'];
            ques.forEach((v) => {
              var qObj = {};
              qObj['question_id'] = v['question_id'];
              qObj['question_detail'] = v;
              qObj['category_name'] = val['name'];
              questions_array.push(qObj);
            });
          })
        });

        window.sessionStorage.setItem('helpsupport_questions', JSON.stringify(questions_array));

        this.setState({
          show_loader: false,
          categories: category
        });
      }).catch(error => {
        this.setState({ show_loader: false });
      });
    } catch (error) {
      this.setState({ show_loader: false });
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

  backButtonEvent() {
    let eventObj = {
      "event_name": 'help_n_support',
      "properties": {
        "user_action": 'back',
        "screen_name": 'support_category',
        'time_spent': ''
      }
    };

    return eventObj;
  }

  navigate = (pathname, data) => {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'support_category',
        "user_action": 'next',
        'category_clicked': data.name,
        'time_spent': this.calcReadtime(new Date())
      }
    };

    nativeCallback({ events: eventObj });

    if (navigator.onLine) {
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        state: {
          subcategories: data,
          category: {
            id: data.category_id,
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

  renderCategories() {
    return this.state.categories.map((item, i) => {
      return (
        <Card nopadding={false} key={i}>
          <Grid container spacing={24} alignItems="center" className="HelpGrid" onClick={() => this.navigate('/help/category', item)}>
            <Grid item xs={12}>
              <div className="card-title">{item.name}</div>
            </Grid>
          </Grid>
        </Card>
      )
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Help & Support'}
        noFooter={true}
        noBack={ !(getConfig().isWebCode) && getConfig().app === 'android' }
        events={this.backButtonEvent()}
        classOverRideContainer={'HelpContainer'}
      >
        <div className="Help pad20">  
          <div className="section-head">
            <div className="main-title">
              Category you need help with
						</div>
          </div>
          <div className="section-card">
            {this.state.categories && this.renderCategories()}
          </div>
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Listing;