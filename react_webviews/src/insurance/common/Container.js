import React, { Component } from 'react';
import { withRouter } from 'react-router';
import jQuery from 'jquery';

import Header from './Header';
import Footer from './footer';
import Banner from '../ui/Banner';
import loader from 'assets/loader_gif.gif';
import { nativeCallback } from 'utils/native_callback';

class Container extends Component {
  constructor(props) {
    super();
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;
    switch (pathname) {
      case "/insurance":
      case "/insurance/resume":
        nativeCallback({ action: 'native_back' });
        break;
      default:
        this.props.history.goBack();
    }
  }

  renderPageLoader = () => {
    if (this.props.showLoader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={loader} alt=""/>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    let body = document.getElementsByTagName('body')[0].offsetHeight;
    let client = document.getElementsByClassName('ContainerWrapper')[0].offsetHeight;
    let ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    let head = document.getElementsByClassName('Header')[0].offsetHeight;
    let foot = document.getElementsByClassName('Footer')[0].offsetHeight;


    if (client > body) {
      document.getElementsByClassName('Container')[0].style.height = parseInt(body - head - foot - 40)+'px';
      document.getElementsByClassName('Footer')[0].style.position = "relative";
      // if (ios) {
      //   var $body = jQuery('body');
      //
      //   jQuery(document)
      //   .on('focus', 'input', function(e) {
      //     $body.addClass('fixheader');
      //   });
      // }
    } else {
      document.getElementsByClassName('Footer')[0].style.position = "fixed";
    }

  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active' key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    return (
      <div className="ContainerWrapper">
        {/* Header Block */}
        <Header
          title={this.props.title}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit} />

        {/* Below Header Block */}
        <div style={{height: 56}}></div>

        {/* Loader Block */}
        {this.renderPageLoader()}

        <div className="Step">
          {steps}
        </div>

        {/* Banner Block */}
        { this.props.banner && <Banner text={this.props.bannerText}/> }

        {/* Children Block */}
        <div className='Container'>
          { this.props.children }
        </div>

        {/* Footer Block */}
        <Footer
          fullWidthButton={this.props.fullWidthButton}
          logo={this.props.logo}
          buttonTitle={this.props.buttonTitle}
          provider={this.props.provider}
          premium={this.props.premium}
          paymentFrequency={this.props.paymentFrequency}
          edit={this.props.edit}
          resetpage={this.props.resetpage}
          handleClick={this.props.handleClick}
          handleReset={this.props.handleReset} />
      </div>
    );
  }
};

export default withRouter(Container);
