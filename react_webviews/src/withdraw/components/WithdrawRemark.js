import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioOptions from 'common/ui/RadioOptions';

import './style.scss';

const WithdrawRemark = ({ location, ...props }) => {
  const subQstn = isEmpty(location?.state) ? null : location?.state;
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    if (isEmpty(subQstn)) {
      navigate('reason');
    }
    console.log(subQstn);
  }, []);

  return (
    <Container buttonTitle='Continue' fullWidthButton hidePageTitle noPadding>
      {!isEmpty(subQstn?.action) && subQstn?.tag !== 'app_concerns' && (
        <section className='withdraw-remark'>
          <div className='withdraw-remark-title'>{subQstn?.action?.sub_question?.title}</div>
          <div className='withdraw-remark-list'>
            {subQstn?.action?.sub_question?.options?.map((el) => (
              <div className='withdraw-remark-items'>
                <FiberManualRecordIcon color='primary' />
                <div>{el.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {
        subQstn?.tag === 'app_concerns' &&
        <section>
          <FormControl component="fieldset">
          <RadioGroup
            aria-label="gender"
            name="gender2"
            value=''
            onChange={() => {}}
          >
              {subQstn?.action?.sub_question?.options?.map((el) => (
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label={el.title}
                    labelPlacement="start"
                  />
              ))}
          </RadioGroup>
        </FormControl>
        </section>
      }
    </Container>
  );
};

export default WithdrawRemark;
