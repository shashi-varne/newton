import React from 'react';
import StarIcon from '@material-ui/icons/Star';

const RatingStar = ({ value, color,height='14px' }) => {
  return (
    <div>
      {[...Array(5)].map((el, idx) => {
        if (idx < value) {
          return <StarIcon key={idx} style={{ color: color, fontSize: '14px', height }} />;
        } else {
          return (
            <StarIcon
              key={idx}
              style={{ color: 'rgb(210 210 210)', fontSize: '14px', height }}
            />
          );
        }
      })}
    </div>
  );
};

RatingStar.defaultProps = {
  color: '#DCCE19',
};
export default RatingStar;
