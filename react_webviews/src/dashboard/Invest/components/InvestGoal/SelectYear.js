import './SelectYear.scss';
/* eslint-disable radix */
import React, { useState } from 'react';
import Container from '../../../common/Container';
import Input from 'common/ui/Input';
import { isRecurring } from '../../common/commonFunctions';
import { navigate as navigateFunc } from "utils/functions";
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import toast from 'common/ui/Toast'

const currentYear = moment().year();
const SelectYear = (props) => {
  const subtype = props.match?.params?.subtype;
  const navigate = navigateFunc.bind(props);

  const { initFunnelData } = useFunnelDataHook();
  const [year, setYear] = useState(currentYear + 15);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const initJourneyData = async () => {
    const term = year - currentYear;
    try {
      const appendToFunnelData = {
        term,
        year: Number(year),
        subtype,
        investType: 'saveforgoal',
        isRecurring: isRecurring('saveforgoal'),
        investTypeDisplay: "sip",
        name: "Saving for goal",
        showRecommendationTopCards: true
      };
      setLoader("button");
      await initFunnelData({
        apiParams: {
          type: 'saveforgoal',
          flow: 'invest for goal',
          subtype,
          term,
        },
        appendToFunnelData: appendToFunnelData
      });
      setLoader(false);
    } catch(err) {
      setLoader(false);
      throw(err);
    }
  };

  const goNext = async () => {
    try {
      await initJourneyData();
      if (subtype === 'other') {
        navigate(`/invest/savegoal/${subtype}/${year}/target`);
      } else {
        navigate(`/invest/savegoal/${subtype}/${year}`);
      }
    } catch (err) {
      console.log(err);
      toast('Something went wrong! Please try again');
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
      } else if (year > (currentYear + 100)) {
        setError(true);
        setErrorMsg(`The max year you can invest for is ${currentYear + 100} years`);
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
      showLoader={loader}
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
export default SelectYear;
