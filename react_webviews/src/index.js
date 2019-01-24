import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import "typeface-roboto";
import './index.css';
import App from './App';
import $ from 'jquery';
import { isMobile } from 'utils/functions';

$(document).ready(function () {
  console.log("isAndroid :" + isMobile.Android());
  if (isMobile.Android()) {
    window.addEventListener('resize', function () {
      let body = document.getElementsByTagName('body')[0].offsetHeight;
      let head = document.getElementsByClassName('Header')[0].offsetHeight;
      let foot = document.getElementsByClassName('Footer')[0].offsetHeight;
      let banner = document.getElementsByClassName('Banner')[0];
      let bannerHeight = (banner) ? banner.offsetHeight : 0;

      document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40 + 'px';
    });
    // $(document).on('focus', "input[type='text'], input[type='number']", function () {
    //   let element = $(this).parent().closest('.InputField')[0];
    //   if (element) {
    //     element.scrollIntoView({ behavior: "smooth", block: "start" });
    //   }
    // });
    function scrollToActiveElement() {
      if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
        document.activeElement.scrollIntoViewIfNeeded()
      }
    }
    window.addEventListener("resize", () => {
      setTimeout(scrollToActiveElement, 100)
      setTimeout(scrollToActiveElement, 1000) // just in case browser is slow
    }, false)
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
