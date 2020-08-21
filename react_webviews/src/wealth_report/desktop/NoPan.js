import React from 'react';
import { navigate } from '../common/commonFunctions';

export default function NoPan(props) {
  return (
    <div id="wr-no-pan-screen">
      <div className="animated animatedFadeInUp fadeInUp">NO PANS FOUND!</div>
      <div
        id="wr-no-pan-back"
        onClick={() => navigate(props, '/w-report/login')}
        className="animated animatedFadeInUp fadeInUp">
        Back to Login
      </div>
    </div>
  );
};