import React from 'react';
import { withRouter } from 'react-router';
import Button from '../ui/Button';
import Typography from '@material-ui/core/Typography';
import { getConfig } from 'utils/functions';
import { navigate as navigateFunc } from 'utils/functions';
const { productName } = getConfig();

const NotFound = (props) => {
  const navigate = navigateFunc.bind(props);
  return (
    <section
      style={{
        height: '70vh',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div>
        <Typography variant='display1' align='center'>
          Page Not Found !
        </Typography>
        <div>
          <img
            src={require(`assets/${productName}/error_illustration.svg`)}
            alt='page not found'
            style={{ marginTop: '30px' }}
          />
        </div>
        <div style={{textAlign:'center', marginTop: '20px'}}>
          <Button buttonTitle='HOME' onClick={() => navigate('/')} />
        </div>
      </div>
    </section>
  );
};

export default withRouter(NotFound);
