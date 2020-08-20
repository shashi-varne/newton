import React from 'react';
import { navigate } from '../common/commonFunctions';

export default function NoPan(props) {
  return (
    <div id="wr-no-pan-screen">
      <div>NO PANS FOUND!</div>
      <div id="wr-no-pan-back" onClick={() => navigate(props, '/w-report/login')}>
        Go Back to Login
      </div>
    </div>
  );
};