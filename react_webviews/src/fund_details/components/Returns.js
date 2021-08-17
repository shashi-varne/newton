import { Typography } from '@material-ui/core';
import React from 'react';
import TableData from '../common/TableData';

const Returns = ({ returnsData,iframe }) => {
  return (
    <div>
      <TableData
        headings={['Period', 'Return* %']}
        data={returnsData}
        headingColor={'#878787'}
        isReturn={true}
        iframe={iframe}
      />
      <Typography
        className="return-condition"
        style={{
          fontSize: '12px',
          color: 'rgb(135, 135, 135)',
          fontWeight: '400',
          padding: '15px 15px 0px 15px',
        }}
      >
        *Returns over 1 year are Annualised
      </Typography>
    </div>
  );
};

export default Returns;
