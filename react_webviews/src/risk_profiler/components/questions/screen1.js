import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import RadioOptions from '../../../common/ui/RadioOptions';
import Api from 'utils/api';
// import { nativeCallback } from 'utils/native_callback';

class QuestionScreen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      questionnaire: [
        { question: '' }
      ],
      question1: '',
      question1_error: '',
      question1Options: [],
      question2: '',
      question2_error: '',
      question2Options: [],
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      indexMain: 0,
      canGoBack: true
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
      const res = await Api.get('/api/risk/profile/user/questionnaire');
      if (res.pfwresponse.result.questionnaire) {
        let questionnaire = res.pfwresponse.result.questionnaire;
        let questionnaireLength = questionnaire.length;
        let questionnaireResponse;
        if (!window.localStorage.getItem('questionnaireResponse')) {
          questionnaireResponse = [];
          for (var i = 0; i < questionnaireLength; i++) {
            let obj = { "question_id": questionnaire[i].question_id, "choice_id": '' };
            questionnaireResponse.push(obj);
          }
          window.localStorage.setItem('questionnaireResponse', JSON.stringify(questionnaireResponse));
        } else {
          questionnaireResponse = JSON.parse(window.localStorage.getItem('questionnaireResponse'));
        }

        window.localStorage.setItem('questionnaire', JSON.stringify(questionnaire));
        let totalScreen = (questionnaireLength / 2).toFixed(0);
        let currentScreen = 1;

        let question1Options = [], question2Options = [];
        question1Options = questionnaire[0].choices;

        if (questionnaire[this.state.indexMain + 1]) {
          question2Options = questionnaire[this.state.indexMain + 1].choices;
        }
        this.setState({
          show_loader: false,
          questionnaire: questionnaire,
          questionnaireLength: questionnaireLength,
          totalScreen: totalScreen,
          currentScreen: currentScreen,
          question1Options: question1Options,
          question2Options: question2Options,
          question1: questionnaireResponse[this.state.indexMain].choice_id || '',
          question2: questionnaireResponse[this.state.indexMain].choice_id || ''
        });
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.message || res.pfwresponse.result.error || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
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
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {


    if (!this.state.question1) {
      this.setState({
        question1_error: 'Please select an option'
      })
    } else if (!this.state.question2) {
      this.setState({
        question2_error: 'Please select an option'
      })
    } else {
      let questionnaireResponse = JSON.parse(window.localStorage.getItem('questionnaireResponse'));
      questionnaireResponse[this.state.indexMain].choice_id = this.state.question1;
      questionnaireResponse[this.state.indexMain + 1].choice_id = this.state.question2;
      window.localStorage.setItem('questionnaireResponse', JSON.stringify(questionnaireResponse));
      this.navigate('question2');
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
        type={this.state.type}
        topIcon="close"
        classOverRideContainer="question-container"
      >
        <FormControl fullWidth>
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

        </FormControl>
      </Container>
    );
  }
}

export default QuestionScreen1;
