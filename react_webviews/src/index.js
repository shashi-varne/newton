// import 'babel-polyfill';
import 'idempotent-babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import "typeface-roboto";
import "typeface-source-sans-pro";
import "typeface-poppins";
import './index.css';
import App from './App';
import $ from 'jquery';
import { isMobile } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed';
import './common/theme/Style.scss';
import "./common/ui/style.scss";
import { getConfig } from './utils/functions';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

$(document).ready(function () {
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
});

if(getConfig().productName === "fisdom" && getConfig().isProdEnv)
{
  Sentry.init({
    dsn: "https://38815adc8fd842e78c2145a583d26351@o60572.ingest.sentry.io/5726998",
    integrations: [new Integrations.BrowserTracing()],
    allowUrls:["wv.fisdom.com"],
    tracesSampleRate: 1.0,
  });
}
else if(getConfig().productName === "finity" && getConfig().isProdEnv){
  Sentry.init({
    dsn: "https://84e342a0046748bab6860aafcf7e86da@o60572.ingest.sentry.io/5727007",
    integrations: [new Integrations.BrowserTracing()],
    allowUrls:["wv.mywaywealth.com"],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
