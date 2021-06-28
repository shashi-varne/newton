import './index.css';
import './common/theme/Style.scss';
import "./common/ui/style.scss";
import "typeface-source-sans-pro";
import "typeface-poppins";
import 'idempotent-babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import $ from 'jquery';
import { isMobile } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed';
import './common/theme/Style.scss';
import "./common/ui/style.scss";
import { getConfig, isIframe } from './utils/functions';
// // ----- Rubik font imports -----
// import "@fontsource/rubik/latin.css"; // all weights from 300 to 900, (does not include italics)
// import "@fontsource/rubik/latin-400-italic.css";
// // -----------------------------
// // ----- Roboto font imports ----
// import "@fontsource/roboto/latin-400.css";
// import "@fontsource/roboto/latin-500.css";
// import "@fontsource/roboto/latin-700.css";
// // ------------------------------

$(document).ready(function () {
  if(isIframe()) {
    let bodyElement =  document.getElementsByTagName('body');
    bodyElement[0].classList.add('IframeBody');
  }
  if (isMobile.Android()) {
    window.addEventListener('resize', function () {
      let body =  document.getElementsByTagName('body') && document.getElementsByTagName('body')[0] ?document.getElementsByTagName('body')[0].offsetHeight : 0;
      let head = document.getElementsByClassName('Header') && document.getElementsByClassName('Header')[0] ? document.getElementsByClassName('Header')[0].offsetHeight : 0;
      let foot = document.getElementsByClassName('Footer') && document.getElementsByClassName('Footer')[0] ? document.getElementsByClassName('Footer')[0].offsetHeight: 0;
      let banner = document.getElementsByClassName('Banner') ?  document.getElementsByClassName('Banner')[0] : {};
      let bannerHeight = (banner) ? banner.offsetHeight : 0;
      let Container = document.getElementsByClassName('Container') ? document.getElementsByClassName('Container')[0] : '';
      if (Container) {
        Container.style.height = body - bannerHeight - head - foot - 40 + 'px';
      }
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
      });
    }
    window.addEventListener("resize", () => {
      if (!['w-report', 'iw-dashboard'].includes(getConfig().project)) {
        setTimeout(scrollToActiveElement, 100);
        setTimeout(scrollToActiveElement, 1000); // just in case browser is slow
      }
    }, false);
  }

  // function runHotjar() {
  //   (function (h, o, t, j, a, r) {
  //     h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
  //     h._hjSettings = { hjid: 1428168, hjsv: 6 };
  //     a = o.getElementsByTagName('head')[0];
  //     r = o.createElement('script'); r.async = 1;
  //     r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  //     a.appendChild(r);
  //   })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  // }
  
  // function runGoogleAds() {
  //   (function () {
  //     var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  //     po.src = 'https://www.googletagmanager.com/gtag/js?id=AW-930930371';
  //     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  //   })();
  
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag() { window.dataLayer.push(arguments); }
  //   gtag('js', new Date());
  
  //   gtag('config', 'AW-930930371');
  // }

  // if (getConfig().Web && getConfig().productName === "finity") {
  //   runHotjar();
  //   runGoogleAds();
  // }
});

ReactDOM.render(<App />, document.getElementById('root'));
