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
                  color: headingColor,
                  borderRight: isReturn && '1px solid rgb(226 226 226)',
                }}
                key={index}
              >
                <div className={isReturn ? 'return-table-header' : null}>{heading}</div>
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
                        }}
                      >
                        {row.name}
                      </Typography>
                      <span
                        style={{
                          fontSize: '14px',
                          color: isTopHolding ? '#878787' : '#4A4A4A',
                          fontWeight: '300',
                        }}
                      >
                        {row?.global_industry || row?.value || 'N/A'}
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
                        color: '#4A4A4A',
                        fontSize: '14px',
                        fontWeight: '300',
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
                      fontSize: '13px',
                      fontWeight: '400',
                      borderRight: isReturn && '1px solid rgb(226 226 226)',
                      width: isReturn && '50%',
                    }}
                  >
                    <div style={{ paddingLeft: '15px' }}>{row.name}</div>
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.root }}
                    component='th'
                    scope='row'
                    style={{ fontSize: '14px', fontWeight: '300' }}
                  >
                    <div style={{ paddingLeft: isReturn && '15px' }}>
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
