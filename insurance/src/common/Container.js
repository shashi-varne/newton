import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Header from './Header';
import Footer from './Footer';

const Container = (props) => {
  return (
    <div className={props.classes.container}>
      <Header title={props.title} count={props.count} total={props.total} current={props.current} />
      <div className={props.classes.wrapper}>
        { props.children }
      </div>
      <Footer state={props.state}/>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '30px 20px 0'
  }
};

export default withStyles(styles)(Container);
