import "./GenerateStatements.scss";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import { ACCOUNT_STATEMENT_OPTIONS } from '../constants';
import Container from '../common/Container';
import Toast from '../../common/ui/Toast';
import RadioOptions from '../../common/ui/RadioOptions';
import { getStatement } from "../common/apiCalls";
import { fiscalYearGenerator } from "../functions";
import DropDownNew from '../../common/ui/DropDownNew'
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
// TODO: Remove less and less-loader loader when rsuite is removed from app
import DatePicker from 'rsuite/lib/DatePicker';
import 'rsuite/lib/DatePicker/styles';
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { getConfig } from "../../utils/functions";
import { InputLabel } from "material-ui";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";

const optionsMap = keyBy(ACCOUNT_STATEMENT_OPTIONS, 'type');
const FINANCIAL_YEAR_OPTIONS = fiscalYearGenerator(2021);

export default function GenerateStatement(props) {
  const { pageType = '' } = props?.match?.params || {};
  const [pageObj, pageProps] = useMemo(() => {
    const obj = optionsMap[pageType];
    return [obj, obj.pageProps];
  }, [pageType]);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  const { Web: isWeb } = useMemo(() => getConfig(), []);
  
  // ---------------- RADIO FIELD -----------------------
  const [selectedRadioOption, setSelectedRadioOption] = useState('');
  const radioButtons = useCallback(({ options, type, fieldProps = {} }) => {
    return (
      <div className="as-radio-field" key={type}>
        <RadioOptions
          icon_type="blue_icon"
          error={!!errorObj[type]}
          helperText={errorObj[type]}
          width="40"
          options={options}
          id="statement-type"
          value={selectedRadioOption}
          onChange={handleRadioChange}
          {...fieldProps}
        />
      </div>
    );
  }, [selectedRadioOption, errorObj]);
  useEffect(() => {
    if (pageObj.type === 'profit_loss') {
      setSelectedRadioOption('cash');
    }
  }, []);

  const handleRadioChange = (event) => {
    if (!event.target.value) return;
    setErrorObj({
      ...errorObj,
      'radio': ''
    });
    setSelectedRadioOption(event.target.value);
  }


  // ---------------- FINANCIAL YEAR FIELD -----------------------
  const [selectedFinYear, setSelectedFinYear] = useState('');
  const finYearSelector = useCallback(({ title, type, fieldProps = {} }) => {
    return (
      <div className="as-fy-picker" key={type}>
        <DropDownNew
          parent={props}
          label={title || "Select Financial Year"}
          selectedIndex={0}
          value={selectedFinYear}
          id="fin-year"
          name="fin-year"
          onChange={handleFinYearChange}
          width="140"
          dataType="AOB"
          options={FINANCIAL_YEAR_OPTIONS}
          error={!!errorObj[type]}
          helperText={errorObj[type]}
          {...fieldProps}
        />
      </div>
    );
  }, [selectedFinYear, errorObj]);
  useEffect(() => {
    if (pageProps.fields.find(field => field.type === 'fin-year')) {
      const currentDate = new Date();
      const startYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      if (currentMonth > 2) {
        handleFinYearChange(`${startYear}-${startYear + 1}`)
      } else {
        handleFinYearChange(`${startYear - 1}-${startYear}`)
      }
    }
  }, []);

  const handleFinYearChange = (selectedValue) => {
    const [startYear, endYear] = selectedValue.split('-');

    if (selectedValue !== selectedFinYear) {
      // Reset all errors and date selections if financial year is changed
      setErrorObj({});
      setSelectedDateMap({});
    }

    setSelectedFinYear(selectedValue);
    setCalendarDefaultDate(new Date(startYear, 3, 1));
    
    if (pageObj.type === 'capital_gains') {
      setSelectedDateMap({
        from: new Date(startYear, 3), // April 01 of fiscal year start
        to: new Date(endYear, 2, 31), // March 31 of fiscal year end
      });
    }
  }


  // ---------------- DATE FIELD -----------------------
  const [selectedDateMap, setSelectedDateMap] = useState({});
  const [calendarDefaultDate, setCalendarDefaultDate] = useState({});
  const dateSelector = useCallback(({ dateType, type, title, fieldProps = {} }) => {
    return (
      <div className="as-date-picker" key={dateType}>
        <InputLabel>
          {title || "Select Date"}
        </InputLabel>
        <DatePicker
          key={calendarDefaultDate}
          block
          oneTap
          isoWeek
          preventOverflow
          size="lg"
          format="DD/MM/YYYY"
          calendarDefaultDate={calendarDefaultDate}
          limitEndYear={1}
          disabledDate={disableDate(dateType)}
          placement={isWeb ? "autoVerticalStart" : "auto"}
          style={{ width: 'auto' }}
          ranges={[]}
          value={selectedDateMap[dateType] || ""}
          onChange={handleDateChange(dateType)}
          id={`${dateType}-date`}
          {...fieldProps}
        />
        <div className="error-radiogrp">
          {errorObj[`${type}-${dateType}`]}
        </div>
      </div>
    );
  }, [calendarDefaultDate, selectedDateMap, errorObj]);
  useEffect(() => {
    if (pageObj.type === 'demat_holding') {
      setSelectedDateMap({
        'date': new Date()
      });
    }
  }, []);

  const handleDateChange = type => value => {
    setErrorObj({
      ...errorObj,
      [`date-select-${type}`]: ''
    });
    setSelectedDateMap({
      ...selectedDateMap,
      [type]: value
    });
  }

  const disableDate = useCallback(type => date => {
    /*
      Note: All dates have been set to startOfDay to prevent
      time difference from interfering with comparisons.
      Only dates will be compared now, without considering time.
    */
    date = startOfDay(date);

    // Restrict dates max upto current date
    if (isAfter(date, startOfDay(new Date()))) {
      return true;
    }

    // Restrict 'From' dates max upto selected 'To' date
    if (
      type === 'from' &&
      isAfter(date, startOfDay(selectedDateMap['to']))
    ) {
      return true;
    }

    // Restrict 'To' dates max upto selected 'From' date
    if (
      type === 'to' &&
      isBefore(date, startOfDay(selectedDateMap['from']))
    ) {
      return true;
    }

    if (pageObj.type === 'contract_note') {
      // Restrict from and to dates to a period 31 days between each other
      if (
        type === 'from' &&
        isBefore(date, subDays(selectedDateMap['to'], 30))
      ) {
        return true;
      }

      if (
        type === 'to' &&
        isAfter(date, addDays(selectedDateMap['from'], 30))
      ) {
        return true;
      }
    }

    if (selectedFinYear) {
      const [startYear, endYear] = selectedFinYear?.split('-');
      
      // Restrict date selection within financial year
      if (
        isBefore(date, startOfDay(new Date(startYear, 3))) ||
        isAfter(date, startOfDay(new Date(endYear, 2, 31)))
      ) {
        return true;
      }
    }
  }, [selectedDateMap, selectedFinYear]);


  // ---------------- HELPER AND OTHER FUNCTIONS  -----------------------
  const validateDate = (value, dateType) => {
    if (!value) {
      return "Please enter a valid date";
    }
    
    value = startOfDay(value);

    if (pageObj.type === 'demat_holding' && isAfter(value, startOfDay(new Date()))) {
      return "Date must not exceed today's date";
    }
    
    if (
      dateType === 'to' &&
      isBefore(value, startOfDay(selectedDateMap['from']))
    ) {
      return "Please enter value greater than From date";
    }
      
    if (selectedFinYear) {
      const [startYear, endYear] = selectedFinYear?.split('-');
      if (
        dateType === 'from' &&
        isBefore(value, startOfDay(new Date(startYear, 3)))
      ) {
        return `Please input From date greater than ${format(new Date(startYear, 3), 'PP')}`;
      }
      if (
        dateType === 'to' &&
        isAfter(value, startOfDay(new Date(endYear, 2, 31)))
      ) {
        return `Please input To Date within ${format(new Date(endYear, 2, 31), 'PP')}`;
      }
    }
  }

  const validateFields = () => {
    const availableFields = pageProps.fields;
    let valid = true;
    let newErrorObj = {};

    for (let field of availableFields) {
      if (field.type === 'radio' && !selectedRadioOption) {
        newErrorObj['radio'] = "Please select a value";
        valid = false;
      }
      if (field.type === 'fin-year' && !selectedFinYear) {
        newErrorObj['fin-year'] = "Please select a value";
        valid = false;
      }
      if (field.type === 'date-select') {
        const value = selectedDateMap[field.dateType];
        const validationErrMsg = validateDate(value, field.dateType);
        if (validationErrMsg) {
          newErrorObj[`date-select-${field.dateType}`] = validationErrMsg;
          valid = false;
        }
      }
    }
    if (!isEmpty(newErrorObj)) {
      setErrorObj({ ...newErrorObj });
    }

    return valid;
  }

  const getParams = () => {
    const availableFields = pageProps.fields;
    
    let fieldValue;
    return availableFields.reduce((params, field)  => {
      if (field.type === 'radio') {
        fieldValue = selectedRadioOption;
      } else if (field.type === 'fin-year') {
        fieldValue = selectedFinYear;
      } else if (field.type === 'date-select') {
        fieldValue = selectedDateMap[field.dateType].toLocaleDateString('en-GB'); // Convert Date object to 'DD/MM/YYYY' string
      }
      params[field.paramName] = fieldValue;
      return params;
    }, {});
  }

  const handleClick = async () => {
    if (!validateFields()) {
      return;
    } else {
      // Clear all errors if all validations pass
      setErrorObj({});
    }

    const params = getParams();
    try {
      setIsApiRunning('button');
      const response = await getStatement(pageObj.type, params);
      setIsApiRunning(false);
      Toast(response.message);
    } catch (err) {
      setIsApiRunning(false);
      console.log(err);
      Toast(err);
    }
  }

  return (
    <Container
      classOverRideContainer="account-statement"
      title={pageObj.title}
      smallTitle={pageProps.subtitle || "Choose time period to view statement"}
      buttonTitle={`Email ${pageObj.title}`}
      handleClick={handleClick}
      showLoader={isApiRunning}
    >
      <div className="InputField" style={{ paddingTop: '20px' }}>
        {pageProps.fields.map(field => {
          if (field.type === 'radio') return radioButtons(field);
          else if (field.type === 'fin-year') return finYearSelector(field);
          else if (field.type === 'date-select') return dateSelector(field);
          return null;
        })}
        {pageProps.infoText &&
          <WVInfoBubble>{pageProps.infoText}</WVInfoBubble>
        }
      </div>
    </Container>
  );
}