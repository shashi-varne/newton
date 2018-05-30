import React from 'react';
import ReactDOM from 'react-dom';
import "typeface-roboto";
import './index.css';
import App from './App';
import $ from 'jquery';

$(document).ready(function() {
  window.addEventListener('resize', function() {
    let body = document.getElementsByTagName('body')[0].offsetHeight;
    let head = document.getElementsByClassName('Header')[0].offsetHeight;
    let foot = document.getElementsByClassName('Footer')[0].offsetHeight;
    let banner = document.getElementsByClassName('Banner')[0];
    let bannerHeight = (banner) ? banner.offsetHeight : 0;

    document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40+'px';
  });

  $(document).on('focus', "input[type='text'], input[type='number']", function () {
    let element = $(this).parent().closest('.InputField')[0];
    element.scrollIntoView({behavior: "smooth", block: "start"});
  });
});

ReactDOM.render(<App />, document.getElementById('root'));
