import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import isEmpty from 'lodash/isEmpty';
import { navigate as navigateFunc } from '../common/commonFunction';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {postWithdrawReasons} from '../common/Api'
import './style.scss';

const WithdrawRemark = ({ location, ...props }) => {
  const [value,setValue] = useState(null);
  const subQstn = isEmpty(location?.state) ? null : location?.state;
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    if (isEmpty(subQstn)) {
      navigate('reason');
    }
  }, []);

  const sendWithdrawReason = async (param) => {

    try{
      await postWithdrawReasons(param);
      navigate("");
    } catch(err) {
      console.log(err)
    }
  }

  const handleClick = () => {
    const data = {
      choice : subQstn?.tag,
      reason : subQstn?.title
    }
    sendWithdrawReason(data);
    
  }

  const handleChange = (el) => {
    setValue(el.target.value);
  }

  return (
    <Container buttonTitle='Continue' fullWidthButton hideInPageTitle noPadding handleClick={handleClick}>
      {!isEmpty(subQstn?.action) && (
        <section className='withdraw-remark'>
          <div className='withdraw-remark-title'>{subQstn?.action?.sub_question?.title}</div>
          {subQstn?.tag !== 'app_concerns' ? (
            <div className='withdraw-remark-list'>
              {subQstn?.action?.sub_question?.options?.map((el) => (
                <div className='withdraw-remark-items'>
                  <FiberManualRecordIcon color='primary' />
                  <div>{el.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className='withdraw-fisdom-radio'>
              <FormControl component='fieldset'>
                <RadioGroup aria-label='fisdom-reasons' name='reasons' value={value} onChange={handleChange}>
                  {subQstn?.action?.sub_question?.options?.map((el) => (
                    <FormControlLabel
                      value={el.title}
                      control={<Radio color='primary' />}
                      label={el.title}
                      labelPlacement='start'
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          )}
        </section>
      )}
    </Container>
  );
};

export default WithdrawRemark;
