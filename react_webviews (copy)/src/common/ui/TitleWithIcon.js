
import React from 'react';
import Grid from 'material-ui/Grid';

import './style.scss';
import Icon from './Icon';

const TitleWithIcon = (props) => (
  <Grid container spacing={16} style={{ padding: 0, marginBottom: 10 }} alignItems="flex-end">
    <Grid item xs={1} style={{ paddingLeft: 10, paddingBottom: 10 }}>
      {props.icon && <Icon
        src={props.icon}
        width={props.width} />}
    </Grid>
    <Grid style={{ padding: 0, paddingLeft: 10 }} item xs={10}>
      <p style={{ color: 'black', fontSize: 14, fontWeight: 500 }}>{props.title}</p>
    </Grid>
  </Grid >
);


export default TitleWithIcon;
