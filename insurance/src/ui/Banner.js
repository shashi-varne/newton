import React from 'react';
import hand from '../assets/hand_icon.png';

const Banner = (props) => (
  <div className="Banner">
    <div className="Flex">
      <div className="FlexItem" style={{flex: 1}}>
        <img src={hand} width={50} />
      </div>
      <div className="FlexItem" style={{flex: 5, padding: 15}}>
        { props.text }
      </div>
    </div>
  </div>
);

export default Banner;
