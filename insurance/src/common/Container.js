import React from 'react';
import { withStyles } from 'material-ui/styles';
import Header from './Header';

const Container = (props) => (
  <div className={props.classes.container}>
    <Header title={props.title} count={props.count} total={props.total} current={props.current} />
    <div className={props.classes.wrapper}>
      { props.children }
    </div>
  </div>
);

const styles = {
  wrapper: {
    padding: '30px 20px 0',
  }
};

export default withStyles(styles)(Container);
