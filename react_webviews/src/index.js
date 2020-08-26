import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import "typeface-roboto";
import "typeface-source-sans-pro";
import './index.css';
import App from './App';
import $ from 'jquery';
import { isMobile } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed';
$(document).ready(function () {
  if (isMobile.Android()) {
    window.addEventListener('resize', function () {
      let body =  document.getElementsByTagName('body') ?document.getElementsByTagName('body')[0].offsetHeight : 0;
      let head = document.getElementsByClassName('Header') ? document.getElementsByClassName('Header')[0].offsetHeight : 0;
      let foot = document.getElementsByClassName('Footer') && document.getElementsByClassName('Footer')[0] ? document.getElementsByClassName('Footer')[0].offsetHeight: 0;
      let banner = document.getElementsByClassName('Banner') ?  document.getElementsByClassName('Banner')[0] : {};
      let bannerHeight = (banner) ? banner.offsetHeight : 0;

      document.getElementsByClassName('Container')[0].style.height = body - bannerHeight - head - foot - 40 + 'px';
    });

    function scrollToActiveElement() {
      // if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
        // document.activeElement.scrollIntoViewIfNeeded()
      // }
      scrollIntoView(document.activeElement, {
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
        // scrollMode: 'if-needed'
      })
    }
    window.addEventListener("resize", () => {
      setTimeout(scrollToActiveElement, 100)
      setTimeout(scrollToActiveElement, 1000) // just in case browser is slow
    }, false)
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
