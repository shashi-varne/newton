import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import { getConfig } from 'utils/functions';
import Container from '../../common/Container';
import RadioOptions from '../../../common/ui/RadioOptions';
import { nativeCallback } from 'utils/native_callback';
import { storageService } from '../../../utils/validators';

class QuestionScreen2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      rpEntryParams: storageService().getObject('risk-entry-params') || {},
      questionnaire: [],
      question1: '',
      question1_error: '',
      question1Options: [],
      question2: '',
      question2_error: '',
      question2Options: [],
      params: qs.parse(props.history.location.search.slice(1)),
      indexMain: 2,
      canGoBack: true
    }
  }

  async componentDidMount() {
    let questionnaire = JSON.parse(window.sessionStorage.getItem('questionnaire'));
    let question1Options = [], question2Options = [];
    question1Options = questionnaire[this.state.indexMain].choices;

    if (questionnaire[this.state.indexMain + 1]) {
      question2Options = questionnaire[this.state.indexMain + 1].choices;
    }

    let questionnaireResponse = JSON.parse(window.sessionStorage.getItem('questionnaireResponse'));
    this.setState({
      show_loader: false,
      questionnaire: questionnaire,
      question1Options: question1Options,
      question2Options: question2Options,
      question1: questionnaireResponse[this.state.indexMain].choice_id || '',
      question2: questionnaireResponse[this.state.indexMain].choice_id || ''
    });
  }

  handleQuestionRadio = name => event => {
    if (name === 'question1') {
      this.setState({
        question1: event.target.value,
        question1_error: '',
      });
    } else {
      this.setState({
        [name]: event.target.value,
        question2_error: '',
      });
    }

  };

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEventsForInputsNextClick(user_action) {
    let eventObj = {
      "event_name": 'Risk Analyser',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Dependency',
        "q1": this.state.question1 ? 'answered' : 'empty',
        "q2": this.state.question2 ? 'answered' : 'empty',
        flow: this.state.rpEntryParams.flow,
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {


    if (!this.state.question1) {
      this.setState({
        question1_error: 'Please select an option'
      })
      this.sendEventsForInputsNextClick('next');
    } else if (!this.state.question2) {
      this.setState({
        question2_error: 'Please select an option'
      })
      this.sendEventsForInputsNextClick('next');
    } else {
      this.sendEventsForInputsNextClick('next');
      let questionnaireResponse = JSON.parse(window.sessionStorage.getItem('questionnaireResponse'));
      questionnaireResponse[this.state.indexMain].choice_id = this.state.question1;
      questionnaireResponse[this.state.indexMain + 1].choice_id = this.state.question2;
      window.sessionStorage.setItem('questionnaireResponse', JSON.stringify(questionnaireResponse));
      this.navigate('question3');
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Risk Analyser"
        count={false}
        total={10}
        current={this.state.question2 ? this.state.indexMain + 2 :
          this.state.question1 ? this.state.indexMain + 1 : this.state.indexMain}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save and Continue"
        topIcon={this.state.rpEntryParams.hideClose ? '' : 'close'}
        classOverRideContainer="question-container"
        events={this.sendEventsForInputsNextClick('just_set_events')}
      >
        <FormControl fullWidth>
          {this.state.questionnaire.length !== 0 &&
            <div>
              <div className="InputField">
                <RadioOptions
                  error={(this.state.question1_error) ? true : false}
                  helperText={this.state.question1_error}
                  width="40"
                  label={this.state.questionnaire[this.state.indexMain].question}
                  class="MaritalStatus"
                  options={this.state.question1Options}
                  id="marital-status"
                  value={this.state.question1}
                  onChange={this.handleQuestionRadio('question1')} />
              </div>
              {this.state.questionnaire[this.state.indexMain + 1] &&
                <div className="InputField">
                  <RadioOptions
                    error={(this.state.question2_error) ? true : false}
                    helperText={this.state.question2_error}
                    width="40"
                    disabled={!this.state.question1}
                    label={this.state.questionnaire[this.state.indexMain + 1].question}
                    class="MaritalStatus"
                    options={this.state.question2Options}
                    id="marital-status"
                    value={this.state.question2}
                    onChange={this.handleQuestionRadio('question2')} />
                </div>}
            </div>}
        </FormControl>
      </Container>
    );
  }
}

export default QuestionScreen2;
