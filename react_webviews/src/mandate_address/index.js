import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './components/Style.css';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import MandateProcess from './components/journey/process';
import MandateSuccess from './components/journey/success';
import SelectAddress from './components/address/select';
import AddEditAddress from './components/address/add_edit';

const Mandate = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={MandateProcess} />
          <Route path={`${url}/select-address`} component={SelectAddress} />
          <Route path={`${url}/add-address`} component={AddEditAddress} />
          <Route path={`${url}/success`} component={MandateSuccess} />


          {/* Edit paths */}
          <Route path={`${url}/edit-address`} render={(props) => <AddEditAddress {...props} edit={true} />} />
          <Route component={NotFound} />
        </Switch>
     </Fragment>
  );
};

export default Mandate;
