import React from 'react';
import StarIcon from '@material-ui/icons/Star';

const RatingStar = ({ value, color }) => {
  return (
    <div>
      {[...Array(5)].map((el, idx) => {
        if (idx < value) {
          return <StarIcon key={idx} style={{ color: color, fontSize: '14px', height: '14px' }} />;
        } else {
          return (
            <StarIcon
              key={idx}
              style={{ color: 'rgb(210 210 210)', fontSize: '14px', height: '14px' }}
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
