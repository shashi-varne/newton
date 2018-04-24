import React from 'react';
import { withStyles } from 'material-ui/styles';
import Header from './Header';
import Footer from './Footer';
import Banner from '../ui/Banner';

const Container = (props) => {
  return (
    <div className={props.classes.container}>
      <Header title={props.title} count={props.count} total={props.total} current={props.current} />
      { props.banner && <Banner text={props.bannerText}/> }
      <div className={props.classes.wrapper}>
        { props.children }
      </div>
      <Footer handleClick={props.handleClick}/>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '30px 20px'
  }
};

export default withStyles(styles)(Container);
