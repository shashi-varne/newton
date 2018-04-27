import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

$(document)
  .on('focus', 'input', function() {
    $('.Footer').css('position', 'relative');
  })
  .on('blur', 'input', function() {
    $('.Footer').css('position', 'fixed');
  });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
