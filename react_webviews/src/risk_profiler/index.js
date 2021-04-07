import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './components/Style.css';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import QuestionScreen1 from './components/questions/screen1';
import QuestionScreen2 from './components/questions/screen2';
import QuestionScreen3 from './components/questions/screen3';
import QuestionScreen4 from './components/questions/screen4';
import QuestionScreen5 from './components/questions/screen5';
import Recommendation from './components/recommendation/index';
import Result from './components/result/index';
import Intro from './components/intro/index';


const RiskProfiler = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={Intro} />
          <Route path={`${url}/intro`} component={Intro} />
          <Route path={`${url}/question1`} component={QuestionScreen1} />
          <Route path={`${url}/question2`} component={QuestionScreen2} />
          <Route path={`${url}/question3`} component={QuestionScreen3} />
          <Route path={`${url}/question4`} component={QuestionScreen4} />
          <Route path={`${url}/question5`} component={QuestionScreen5} />
          <Route path={`${url}/recommendation`} component={Recommendation} />
          <Route path={`${url}/result-new`} render={(props) => <Result {...props} useNewFlow={true} />} />
          <Route path={`${url}/result`} component={Result} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
  );
};

export default RiskProfiler;
