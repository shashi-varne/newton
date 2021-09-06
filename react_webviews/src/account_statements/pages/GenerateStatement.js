import "./GenerateStatements.scss";
import React, { useCallback, useMemo, useState } from 'react';
import { keyBy } from 'lodash';
import { ACCOUNT_STATEMENT_OPTIONS, FINANCIAL_YEAR_OPTIONS } from '../constants';
import Container from '../common/Container';
import Toast from '../../common/ui/Toast';
import RadioOptions from '../../common/ui/RadioOptions';
import DropdownInModal from "common/ui/DropdownInModal";
import Input from '../../common/ui/Input';
import { isEmpty, isValidDate } from "../../utils/validators";

const optionsMap = keyBy(ACCOUNT_STATEMENT_OPTIONS, 'type');

export default function GenerateStatement(props) {
  const { pageType = '' } = props?.match?.params || {};
  const pageObj = optionsMap[pageType];
  const pageProps = useMemo(() => pageObj.pageProps, [pageObj]);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  
  const [selectedRadioOption, setSelectedRadioOption] = useState('');
  const radioButtons = useCallback(({ options, title = "", type }) => {
    return (
      <div className="as-radio-field">
        <FieldTitle>{title}</FieldTitle>
        <RadioOptions
          error={!!errorObj[type]}
          helperText={errorObj[type]}
          width="40"
          options={options}
          id="statement-type"
          value={selectedRadioOption}
          onChange={handleRadioChange}
        />
      </div>
    );
  }, [selectedRadioOption, errorObj]);

  const handleRadioChange = (event) => {
    if (!event.target.value) return;
    setErrorObj({
      ...errorObj,
      'radio': ''
    });
    setSelectedRadioOption(event.target.value);
  }

  const [selectedFinYear, setSelectedFinYear] = useState('');
  const finYearSelector = useCallback(({ title, buttonTitle, type}) => {
    return (
      <div style={{ marginBottom: errorObj[type] ? '30px' : '8px' }}>
        <FieldTitle>{title || "Select Year"}</FieldTitle>
        <DropdownInModal
          options={FINANCIAL_YEAR_OPTIONS}
          header_title={title || "Select Year"}
          cta_title={buttonTitle || "Confirm"}
          error={!!errorObj[type]}
          helperText={errorObj[type]}
          selectedIndex={1}
          value={selectedFinYear}
          id="fin-year"
          name="fin-year"
          onChange={handleFinYearChange}
        />
      </div>
    );
  }, [selectedFinYear, errorObj]);

  const handleFinYearChange = (selectedIdx) => {
    console.log(selectedIdx);
    setErrorObj({
      ...errorObj,
      'fin-year': ''
    });
    setSelectedFinYear(FINANCIAL_YEAR_OPTIONS[selectedIdx].value);
  }

  const [selectedDateMap, setSelectedDateMap] = useState({});
  const dateSelector = useCallback(({ title, dateType, type }) => {
    return (
      <div style={{ marginBottom: '30px' }}>
        <FieldTitle>{title || "Select Date"}</FieldTitle>
        <Input
          // label={title || "Select Date"}
          class="input"
          value={selectedDateMap[dateType] || ""}
          error={!!errorObj[`${type}-${dateType}`]}
          helperText={errorObj[`${type}-${dateType}`] || ""}
          onChange={handleDateChange(dateType)}
          maxLength={10}
          inputMode="numeric"
          type="text"
          id="date"
          disabled={isApiRunning}
        />
      </div>
    );
  }, [selectedFinYear, errorObj]);

  const handleDateChange = type => event => {
    const value = event.target.value;
    console.log(value);
    if (!value) return;
    setErrorObj({
      ...errorObj,
      [`date-select-${type}`]: ''
    });
    setSelectedDateMap({
      ...selectedDateMap,
      [type]: value
    });
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
        if (!value || !isValidDate(value)) {
          newErrorObj[`date-select-${field.dateType}`] = "Please enter a valid date";
          valid = false;
        }
      }
    }
    if (!isEmpty(newErrorObj)) {
      setErrorObj({ ...errorObj, ...newErrorObj });
    }

    return valid;
  }

  const handleClick = () => {
    if (!validateFields()) {
      return;
    }
    const success = false;
    if (success) {
      Toast('Statement has been sent to your email');
    } else {
      Toast('Statement could‘nt be processed. Please check back later');
    }
  }

  return (
    <Container
      title={pageObj.title}
      smallTitle={pageProps.subtitle || "Choose time period to view statement"}
      buttonTitle={`Email ${pageObj.title} Statement`}
      handleClick={handleClick}
    >
      <div className="InputField">
        {pageProps.fields.map(field => {
          if (field.type === 'radio') return radioButtons(field);
          else if (field.type === 'fin-year') return finYearSelector(field);
          else if (field.type === 'date-select') return dateSelector(field);
          return null;
        })}
      </div>
    </Container>
  );
}

const FieldTitle = ({ children }) => {
  return (
    <div className="acc-statements-field-title">{children}</div>
  );
}