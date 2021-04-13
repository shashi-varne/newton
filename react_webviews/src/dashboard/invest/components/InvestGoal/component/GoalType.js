/* eslint-disable radix */
import React, { useState } from 'react';
import Container from '../../../../common/Container';
import Input from 'common/ui/Input';

import { navigate as navigateFunc } from '../../../common/commonFunction';

import './style.scss';
import { storageService } from 'utils/validators';

const currentYear = new Date().getFullYear();
const GoalType = (props) => {
  const [year, setYear] = useState(currentYear + 15);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const subtype = props.match?.params?.subtype;
  const navigate = navigateFunc.bind(props);
  const graphData = storageService().getObject("graphData")

  const goNext = () => {
    storageService().setObject("graphData",{...graphData,name:"Saving for goal", year})
    if (subtype === 'other') {
      navigate(`savegoal/${subtype}/target`);
    } else {
      navigate(`savegoal/${subtype}/${year}`);
    }

  };

  const handleChange = (e) => {
    if (!isNaN(parseInt(e.target.value))) {
      validateYear(parseInt(e.target.value));
      setYear(parseInt(e.target.value));
    } else {
      setYear('');
      setError(true);
      setErrorMsg('This is a required field');
    }
  };

  const validateYear = (year) => {
    if (year.toString().length === 4) {
      if (currentYear >= year) {
        setError(true);
        setErrorMsg('The year should be more than the current year');
      } else if(year > (currentYear + 100)){
        setError(true);
        setErrorMsg(`The max year you can invest for is ${currentYear+100} years`);
      } else {
        setError(false);
        setErrorMsg('');
      }
    } else {
      setError(true);
      setErrorMsg('Please enter a valid year');
    }
  };
  
  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='NEXT'
      title='Save for a Goal'
      handleClick={goNext}
      classOverRideContainer='pr-container'
      disable={error}
    >
      <section className='invest-goal-type-container'>
        <div>In year</div>
        <div className='invest-goal-type-input'>
          <Input
            id='invest-amount'
            class='invest-amount-num'
            value={year}
            onChange={handleChange}
            type='text'
            error={error}
            helperText={error && errorMsg}
            autoFocus
            maxLength={4}
            inputMode='numeric'
            pattern='[0-9]*'
          />
        </div>
      </section>
    </Container>
  );
};
export default GoalType;
