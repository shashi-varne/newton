import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import { nonRoundingToFixed } from 'utils/validators';
const valueStyle = {
  fontSize: '14px',
  color: '#878787',
  fontWeight: '300',
};

const titleStyle = {
  fontSize: '13px',
  color: '#4A4A4A',
  fontWeight: '500',
};
const FundInfo = ({ title, content }) => {
  return (
    <div style={{ padding: '1em 15px' }}>
      <Typography style={titleStyle}>{title}</Typography>
      {Array.isArray(content) ? (
        content.map((item, index) => {
          if (item.name) {
            return (
              <Typography key={index} style={valueStyle}>
                {`₹${item.value} ${item.name}`}
              </Typography>
            );
          }
          if (item.period) {
            return (
              <Typography key={index} style={valueStyle}>
                {`${nonRoundingToFixed(item.value, 2)}% (${item.period})`}
              </Typography>
            );
          }
          return (
            <Typography key={index} style={valueStyle}>
              {item}
            </Typography>
          );
        })
      ) : (
        <Typography style={valueStyle}>{content ? content : 'N/A'}</Typography>
      )}
    </div>
  );
};

export default memo(FundInfo);
