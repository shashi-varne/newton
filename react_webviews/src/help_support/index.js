import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import '../common/theme/Style.scss';
import './common/Style.css';
import NotFound from '../common/components/NotFound';
import Listing from './components/listing';
import Category from './components/category';
import Question from './components/question';
import Answer from './components/answer';
import Writetous from './components/writetous';
import Thankyou from './components/thankyou';

const HelpSupport = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={Listing} />
          <Route path={`${url}/category`} component={Category} />
          <Route path={`${url}/questions`} component={Question} />
          <Route path={`${url}/answer`} component={Answer} />
          <Route path={`${url}/writetous`} component={Writetous} />
          <Route path={`${url}/thankyou`} component={Thankyou} />
          <Route component={NotFound} />
        </Switch>
     </Fragment>
  );
};

export default HelpSupport;
