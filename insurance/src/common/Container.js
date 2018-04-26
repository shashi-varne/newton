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
      window.location.replace(window.location.href+'insurance/native_back', function() {});
    } else {
      this.props.history.goBack();
    }
  }

  componentDidUpdate() {
    var body = document.getElementsByTagName('body')[0].offsetHeight;
    var client = document.getElementsByClassName('Container')[0].offsetHeight;

    if (client > body) {
      document.getElementsByClassName('Footer')[0].style.position = "relative" ;
    } else {
      document.getElementsByClassName('Footer')[0].style.position = "fixed" ;
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
    return (
      <div className={`ContainerWrapper`}>
        <Header title={this.props.title} count={this.props.count} total={this.props.total} current={this.props.current} goBack={this.historyGoBack} edit={this.props.edit} />
        {this.renderLoader()}
        { this.props.banner && <Banner text={this.props.bannerText}/> }
        <div className={`Container ${this.props.classes.wrapper}`}>
          { this.props.children }
        </div>
        <Footer handleClick={this.props.handleClick} fullWidthButton={this.props.fullWidthButton} edit={this.props.edit} buttonTitle={this.props.buttonTitle} premium={this.props.premium} paymentFrequency={this.props.paymentFrequency}/>
      </div>
    );
  }
};

const styles = {
  wrapper: {
    padding: '30px 20px',
    marginBottom: 0
  }
};

export default withRouter(withStyles(styles)(Container));
