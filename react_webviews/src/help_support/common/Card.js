import React from 'react';

const Card = (props) => (
  <div className={`Card ${(props.nopadding) ? 'nopadding' : ''}`}>
    {props.children}
  </div>
);

export default Card;
