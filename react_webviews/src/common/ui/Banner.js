import React from 'react';
import { withStyles } from 'material-ui/styles';

import hand from 'assets/hand_icon.png';
import hand_finity from 'assets/finity/hand_icon_finity.svg';
import './style.scss';
import { getConfig } from '../../utils/functions';

const Banner = (props) => (
  <div className="Banner">
    <div className="Flex">
      <div className="FlexItem1">
        <img src={ getConfig().productName !== 'fisdom' ? hand_finity: hand} width={50} alt="" />
      </div>
      <div className={`FlexItem10 ${props.classes.text}`}>
        {props.text}
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
