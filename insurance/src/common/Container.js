import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Header from './Header';
import Footer from './Footer';
import Banner from '../ui/Banner';
import { withRouter } from 'react-router';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPath: ''
    };
  }

  historyGoBack = () => {
    console.log(this.props.history);
    this.props.history.goBack();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <Header title={this.props.title} count={this.props.count} total={this.props.total} current={this.props.current} goBack={this.historyGoBack} />
        { this.props.banner && <Banner text={this.props.bannerText}/> }
        <div className={this.props.classes.wrapper}>
          { this.props.children }
        </div>
        <Footer handleClick={this.props.handleClick}/>
      </div>
    );
  }
};

const styles = {
  wrapper: {
    padding: '30px 20px'
  }
};

export default withRouter(withStyles(styles)(Container));
