import React, { memo } from 'react';
import Collapse from '@material-ui/core/Collapse';
import RemoveIcon from '@material-ui/icons/Remove';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
const styles = {
  primary: {
    color: '#878787',
    fontSize: '13px',
    fontWeight: '400 ',
  },
  root: {
    paddingLeft: '0px',
  },
};
const Accordian = ({ title, children, classes }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <ListItem
        style={{
          display: 'flex',
          cursor: 'pointer',
          padding: '10px 15px',
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon>
          {open ? (
            <RemoveIcon
              style={{
                border: '2px #878787 solid',
                fontSize: '18px',
                borderRadius: '3px',
                color: '#878787',
              }}
            />
          ) : (
            <AddIcon
              style={{
                border: '2px #878787 solid',
                fontSize: '18px',
                borderRadius: '3px',
                color: '#878787',
              }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.primary, root: classes.root }}
          inset
          primary={title}
        />
      </ListItem>

      <Collapse in={open}>{children}</Collapse>
    </>
  );
};

export default withStyles(styles)(memo(Accordian));
