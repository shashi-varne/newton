import React, { Component } from 'react';

import qs from 'qs';
import Container from '../common/Container';
import Api from 'utils/api';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import thumb_down from 'assets/thumb_down.svg';
import thumb_up from 'assets/thumb_up.svg';
import thumb_down_fill from 'assets/thumb_down_fill.svg';
import thumb_up_fill from 'assets/thumb_up_fill.svg';
import launch from 'assets/launch.svg';
import { nativeCallback, openModule } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

let start_time = '';

class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upvote: false,
      downvote: false,
      upvoteImg: thumb_up,
      downvoteImg: thumb_down,
      feedback_text: 'Was this helpful',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      link: getConfig().appLink
    }
  }

  componentDidMount() {
    start_time = new Date();
  }

  navigate = (pathname, data, type) => {
    if (navigator.onLine) {
      this.setState({
        upvote: false,
        downvote: false,
        upvoteImg: thumb_up,
        downvoteImg: thumb_down,
        feedback_text: 'Was this helpful'
      });

      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        state: {
          answer: (type === 'related') ? data.question_detail : data,
          title: (type === 'related') ? data.category_name : this.props.location.state.title,
          category: this.props.location.state.category,
          subcategory: this.props.location.state.subcategory,
          from: 'answer',
          question: {
            id: this.props.location.state.answer.question_id,
            name: this.props.location.state.answer.name
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

  sendEvent(type) {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'question_answer',
        "user_action": type === 'up' ? 'helpful_clicked' : 'not_helpful_clicked',
        'time_spent': this.calcReadtime(new Date())
      }
    };

    nativeCallback({ events: eventObj });
  }

  sendWrite2UsEvent() {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'question_answer',
        'write_to_us_clciked': 'yes',
        'time_spent': this.calcReadtime(new Date())
      }
    };

    nativeCallback({ events: eventObj });
  }

  async updateVote(status) {
    if (status) {
      if (this.state.downvote) {
        this.setState((state, props) => ({
          downvote: false,
          upvote: true,
          feedback_text: 'Thank you for your feedback',
          upvoteImg: thumb_up_fill,
          downvoteImg: thumb_down
        }));
      } else {
        this.setState((state, props) => ({
          upvote: true,
          upvoteImg: thumb_up_fill,
          feedback_text: 'Thank you for your feedback'
        }));
      }
    } else {
      if (this.state.upvote) {
        this.setState((state, props) => ({
          upvote: false,
          downvote: true,
          upvoteImg: thumb_up,
          downvoteImg: thumb_down_fill,
          feedback_text: 'Thank you for your feedback'
        }));
      } else {
        this.setState((state, props) => ({
          downvote: true,
          downvoteImg: thumb_down_fill,
          feedback_text: 'Thank you for your feedback'
        }));
      }
    }

    try {
      let data = {};
      data['category_id'] = this.props.location.state.category.id
      data['subcategory_id'] = this.props.location.state.subcategory.id;
      data['question_id'] = this.props.location.state.answer.question_id;
      data['is_like_query'] = status;
      data['question'] = this.props.location.state.answer.name;
      data['category'] = this.props.location.state.category.name;
      data['subcategory'] = this.props.location.state.subcategory.name;

      const feedback = await Api.post('/api/helpandsupport/feedback', data);

      if (feedback.pfwresponse.status_code === 200) {
        if (status) {
          this.sendEvent('up');
        } else {
          this.sendEvent('down')
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  toggleVotes(type) {
    if (type === 'up') {
      if (!this.state.upvote) {
        this.updateVote(true);
      }
    } else {
      if (!this.state.downvote) {
        this.updateVote(false);
      }
    }
  }

  renderVotes() {
    return (
      <span>
        <img src={this.state.upvoteImg} onClick={() => this.toggleVotes('up')} alt="" />
        <img src={this.state.downvoteImg} onClick={() => this.toggleVotes('down')} alt="" />
      </span>
    );
  }

  renderRelatedQuestions() {
    let ques = JSON.parse(window.sessionStorage.getItem('helpsupport_questions'));

    let rel_ques_ids = [];
    this.props.location.state.answer.related_question.forEach((val) => {
      rel_ques_ids.push(val['question_id']);
    });

    // eslint-disable-next-line
    let rel_ques = ques.filter((item) => {
      if (rel_ques_ids.includes(item.question_id)) {
        return true;
      }
    })

    return rel_ques.map((item, i) => {
      return (
        <div key={i}
        style={{color: getConfig().styles.primaryColor}}
        className="related-question" 
        onClick={() => { this.navigate('/help/answer', item, 'related'); 
        this.sendRelatedEvent(item.question_detail.question_id) }}>{item.question_detail.name}</div>
      );
    })
  }

  sendRelatedEvent(id) {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'question_answer',
        "related_questions_clicked": 'yes',
        'related_question_id': id,
        'time_spent': this.calcReadtime(new Date())
      }
    };

    nativeCallback({ events: eventObj });
  }

  backButtonEvent() {
    let eventObj = {
      "event_name": 'help_n_support',
      "properties": {
        "user_action": 'back',
        "screen_name": 'question_answer',
        'time_spent': ''
      }
    };

    return eventObj;
  }

  calcReadtime = (endtime) => {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
  }

  showWrite2Us() {
    const answer = this.props.location.state.answer;

    if ((this.state.downvote && answer.query_type === 'TB' && answer.write_to_us_enabled === 1) || (answer.write_to_us_enabled === 1 && (answer.query_type === 'SR' || answer.query_type === 'HR'))) {
      return (
        <div>
          <div className="callback">
            <img src={launch} alt="" />
            <div className="title" onClick={() => { this.navigate('/help/writetous', answer, 'write2us'); this.sendWrite2UsEvent() }}>Write to us</div>
          </div>
        </div>
      );
    }
  }

  sendNativeCallback() {
    let eventObj = {
      "event_name": "help_n_support",
      "properties": {
        "screen_name": 'question_answer',
        "CTA_clicked": 'yes',
        'time_spent': this.calcReadtime(new Date())
      }
    };
    nativeCallback({ events: eventObj });

    openModule(this.props.location.state.answer.action_path, this.props);

  }

  calcReadtime = (endtime) => {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
  }

  render() {
    const answer = this.props.location.state.answer;

    return (
      <Container
        title={this.props.location.state.title}
        background="white"
        noFooter={true}
        events={this.backButtonEvent()}
      >
        <div className="Help pad20">
          <div className="question">{answer.name}</div>
          <div className="answer" dangerouslySetInnerHTML={{ __html: answer.answer }}></div>
          {answer.action_text && answer.action_path &&
            <div className="callback">
              <img src={launch} alt="" />
              <div className="title" onClick={() => this.sendNativeCallback()}>{answer.action_text}</div>
            </div>
          }
          {answer.feedback === 1 &&
            <div className="feedback">
              <div className="text">{this.state.feedback_text}</div>
              <div className="thumbs">
                {this.renderVotes()}
              </div>
            </div>
          }
          {this.showWrite2Us()}
        </div>
        {this.props.location.state.answer.related_question.length > 0 &&
          <span><div className="divider"></div>
            <div className="related pad20">
              <div className="title">Related Questions</div>
              {this.renderRelatedQuestions()}
            </div></span>
        }
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Answer;