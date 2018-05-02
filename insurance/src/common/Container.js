import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Header from './Header';
import Footer from './Footer';
import Banner from '../ui/Banner';
import { withRouter } from 'react-router';
import loader from '../assets/loader_gif.gif';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPath: ''
    };
  }

  historyGoBack = () => {
    if (this.props.history.location.pathname === "/" || this.props.history.location.pathname === "/resume") {
      window.location.replace(window.location.href+'&native_back=true', function() {});
    } else {
      this.props.history.goBack();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.history.location.pathname === '/resume' || this.props.history.location.pathname === '/summary') {
      var body = document.getElementsByTagName('body')[0].offsetHeight;
      var client = document.getElementsByClassName('ContainerWrapper')[0].offsetHeight;

      if (client > body) {
        document.getElementsByClassName('Footer')[0].style.position = "relative" ;
      } else {
        document.getElementsByClassName('Footer')[0].style.position = "fixed" ;
      }
    }
  }

  renderLoader = () => {
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
      <div className={`ContainerWrapper`}>
        <Header title={this.props.title} count={this.props.count} total={this.props.total} current={this.props.current} goBack={this.historyGoBack} edit={this.props.edit} />
        <div style={{height: 56}}></div>
        <div className="Step">
          {steps}
        </div>
        {this.renderLoader()}
        { this.props.banner && <Banner text={this.props.bannerText}/> }
        <div className={`Container ${this.props.classes.wrapper}`}>
          { this.props.children }
        </div>
        <Footer handleClick={this.props.handleClick} fullWidthButton={this.props.fullWidthButton} edit={this.props.edit} buttonTitle={this.props.buttonTitle} premium={this.props.premium} paymentFrequency={this.props.paymentFrequency} summaryButtonText={this.props.summaryButtonText} provider={this.props.provider} logo={this.props.logo}
        resetpage={this.props.resetpage} handleReset={this.props.handleReset} />
      </div>
    );
  }
};

const styles = {
  wrapper: {
    padding: '20px 15px',
    marginBottom: '30px',
    backgroundColor: '#fff'
  }
};

export default withRouter(withStyles(styles)(Container));
