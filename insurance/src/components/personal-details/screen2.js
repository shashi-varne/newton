import React from 'react';
import Container from '../../common/Container';
import Button from 'material-ui/Button';

const PersonalDetails2 = () => (
  <Container title={'Personal Details'} count={true} total={5} current={1}>
    <Button variant="raised" color="secondary" >
      Screen 2
    </Button>
  </Container>
);

export default PersonalDetails2;
