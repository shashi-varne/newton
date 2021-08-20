import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import './Style.scss';
const styles = (theme) => ({
  table: {
    width: '100%',
    //  marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(even)': {
      backgroundColor: '#F9FCFF',
    },
  },
  root: {
    borderBottom: 'none',
    padding: '1em 0',
    '&:last-child': {
      paddingRight: '0px',
      borderRight: 'none !important'

    },
  },
});

const ProgressBar = (props) => {
  return (
    <div className='fd-progress-bar-container'>
      <div
        style={{
          background: `${props.color}`,
          height: '100%',
          borderBottomRightRadius: '50px',
          borderTopRightRadius: '50px',
          transition: 'width .2s ease-in',
          width: `${props.percentage}%`,
        }}
      ></div>
    </div>
  );
};
const TableData = ({
  headings = [],
  headingColor,
  data,
  classes,
  isSector,
  isTopHolding,
  isReturn,
  iframe,
  isRiskMeasure
}) => {
  return (
    <Table className={classes.table}>
      <TableBody>
        {headings?.length > 0 && (
          <TableRow>
            {headings?.map((heading, index) => (
              <TableCell
                classes={{ root: classes.root }}
                style={{
                  color: isReturn? '#161A2E' : headingColor,
                }}
                key={index}
              >
                <div
                  style={
                    isReturn && index === 1
                      ? { textAlign: 'right', paddingRight: '15px' }
                      : isReturn && iframe
                      ? { textAlign: 'left' }
                      : {}
                  }
                  className={
                    isReturn
                      ? `return-table-header ${
                          iframe && 'iframe-table-data-head'
                        }`
                      : null
                  }
                >
                  {heading}
                </div>
              </TableCell>
            ))}
          </TableRow>
        )}
        {data.map((row) => {
          return (
            <TableRow className={classes.row} key={row.name}>
              {isSector || isTopHolding ? (
                <>
                  <TableCell component='th' scope='row' classes={{ root: classes.root }}>
                    <div style={{ paddingLeft: '15px' }}>
                      <Typography
                        style={{
                          fontSize: '13px',
                          color: '#4A4A4A',
                          lineHeight: '22px !important',
                          fontWeight: '500',
                          marginBottom: '5px'
                        }}
                      >
                        {row.name}
                      </Typography>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#767E86',
                          fontWeight: '400',
                        }}
                      >
                        {row?.global_industry || row?.value || null}
                        {row.value && '%'}
                      </span>
                    </div>
                  </TableCell>
                  {isTopHolding && (
                    <TableCell
                      classes={{ root: classes.root }}
                      component='th'
                      scope='row'
                      style={{
                        color: '#767E86',
                        fontSize: '13px',
                        fontWeight: '400',
                      }}
                    >
                      <div style={{ paddingRight: '15px' }}>{row.weighting}%</div>
                    </TableCell>
                  )}
                  {isSector && (
                    <TableCell
                      classes={{ root: classes.root }}
                      className='sort-bar-direction'
                      component='th'
                      scope='row'
                      align='right'
                      numeric
                    >
                      <div>
                        <ProgressBar percentage={row.value * 5} color={row.color} />
                      </div>
                    </TableCell>
                  )}
                </>
              ) : (
                <>
                  <TableCell
                    classes={{ root: classes.root }}
                    component='th'
                    scope='row'
                    style={{
                      fontSize: '12px',
                      fontWeight: isReturn? '400':  '700',
                      width: isReturn && '50%',
                      color: isReturn ? '#8D879B' : '#767E86',
                      paddingLeft: '15px'
                    }}
                  >
                    <div>{row.name}</div>
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.root }}
                    component='th'
                    scope='row'
                    style={{ fontSize: '13px', fontWeight: '400', color: isReturn ? '#8D879B' : '#767E86' }}
                  >
                    <div style={{ paddingRight: isReturn && '15px', textAlign: 'right'}} className={isRiskMeasure ? 'risk-measure-table' : ''}>
                      {row.display_value ? row.display_value : row.value}
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

TableData.defaultProps = {
  isSector: false,
  isTopHolding: false,
};

export default withStyles(styles)(memo(TableData));
