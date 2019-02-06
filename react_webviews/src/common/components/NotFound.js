import React from 'react';
import { withRouter } from 'react-router';

const NotFound = () => (
  <div>
    <h1>Oops!</h1>
    <p>Page not found</p>
  </div>
)

export default withRouter(NotFound);
