import React from 'react';
import { withStyles } from 'material-ui/styles';

import hand from '../assets/hand_icon.png';

const Banner = (props) => (
  <div className="Banner">
    <div className="Flex">
      <div className="FlexItem1">
        <img src={hand} width={50} alt=""/>
      </div>
      <div className={`FlexItem5 ${props.classes.text}`}>
        { props.text }
      </div>
    </div>
  </div>
);

const styles = {
  text: {
    padding: 10
  }
};

export default withStyles(styles)(Banner);
