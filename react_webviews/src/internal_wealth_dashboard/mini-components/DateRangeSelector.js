import React, { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { date_range_selector, dateFormater } from '../common/commonFunctions';
import { storageService } from '../../utils/validators';
// import isEqual from 'lodash/isEqual';
import moment from 'moment';
const DateRangeSelector = ({ filter_key, handleFilterData }) => {
  const filterVal = storageService().getObject(filter_key);
  const [startDate, setStartDate] = useState(filterVal['from_tdate'] || '');
  const [endDate, setEndDate] = useState(filterVal['to_tdate'] || '');
  const selectDate = (value) => {
    const [start, end] = value;
    const startDates = dateFormater(start);
    const endDates = dateFormater(end);
    const filterDate = {
      ...filterVal,
      from_tdate: startDates,
      to_tdate: endDates,
    };
    storageService().setObject(filter_key, filterDate);
    setStartDate(startDates);
    setEndDate(endDates);
    handleFilterData(filterDate);
  };
  const clearDate = () => {
    setStartDate('');
    setEndDate('');
    const filterData = { ...filterVal, from_tdate: '', to_tdate: '' };
    storageService().setObject(filter_key, filterData);
    handleFilterData(filterData);
  };
  /*
  
  const compare_custom_range_dates = (value) => {
    const [startq, endq] = value;
    const starts = [
      new Date(startq).getDate(),
      new Date(startq).getMonth(),
      new Date(startq).getFullYear(),
    ];
    const ends = [
      new Date(endq).getDate(),
      new Date(endq).getMonth(),
      new Date(endq).getFullYear(),
    ];
    const [startw, endw] = date_range_selector['past_seven_days']();
    const rstart = [
      new Date(startw).getDate(),
      new Date(startw).getMonth(),
      new Date(startw).getFullYear(),
    ];
    const rend = [
      new Date(endw).getDate(),
      new Date(endw).getMonth(),
      new Date(endw).getFullYear(),
    ];

    if (isEqual(starts, rstart) && isEqual(ends, rend)) {
      console.log('matching');
    }
    console.log('value', starts);
    console.log('range', rstart);
  };
  */
  return (
    <div className='iwd-date-range-picker'>
      <DateRangePicker
        appearance='subtle'
        placement='bottomEnd'
        placeholder='DD-MM-YY ~ DD-MM-YY'
        disabledDate={DateRangePicker.afterToday()}
        value={startDate && endDate ? [new Date(startDate), new Date(endDate)] : []}
        ranges={[
          {
            label: 'Past 7 days',
            value: date_range_selector['past_seven_days'],
          },
          {
            label: 'Past 2 weeks',
            value: date_range_selector['past_two_weeks'],
          },
          {
            label: 'Past month',
            value: date_range_selector['past_month'],
          },
          {
            label: 'Month to date',
            value: date_range_selector['month_to_date'],
          },
          {
            label: 'Year to date',
            value: date_range_selector['year_to_date'],
          },
        ]}
        onOk={(value) => selectDate(value)}
        onChange={(value) => selectDate(value)}
        onClean={clearDate}
        renderValue={(val, str) => (
          <div>
            {' '}
            {moment(val[0]).format('Do MMM YY')} - {moment(val[1]).format('Do MMM YY')}
          </div>
        )}
      />
    </div>
  );
};

export default DateRangeSelector;
