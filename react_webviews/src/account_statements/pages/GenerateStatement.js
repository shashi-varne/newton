import "./GenerateStatements.scss";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { keyBy } from 'lodash';
import { ACCOUNT_STATEMENT_OPTIONS } from '../constants';
import Container from '../common/Container';
import Toast from '../../common/ui/Toast';
import RadioOptions from '../../common/ui/RadioOptions';
import DropdownInModal from "common/ui/DropdownInModal";
import Input from '../../common/ui/Input';
import { isEmpty, isValidDate } from "../../utils/validators";
import { getStatement } from "../common/apiCalls";
import format from 'date-fns/format';
import { fiscalYearGenerator } from "../functions";

const optionsMap = keyBy(ACCOUNT_STATEMENT_OPTIONS, 'type');
const FINANCIAL_YEAR_OPTIONS = fiscalYearGenerator(2002);

export default function GenerateStatement(props) {
  const { pageType = '' } = props?.match?.params || {};
  const [pageObj, pageProps] = useMemo(() => {
    const obj = optionsMap[pageType];
    return [obj, obj.pageProps];
  }, [pageType]);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  
  const [selectedRadioOption, setSelectedRadioOption] = useState('');
  const radioButtons = useCallback(({ options, title = "", type, fieldProps = {} }) => {
    return (
      <div className="as-radio-field" key={type}>
        <FieldTitle>{title}</FieldTitle>
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

  const handleRadioChange = (event) => {
    if (!event.target.value) return;
    setErrorObj({
      ...errorObj,
      'radio': ''
    });
    setSelectedRadioOption(event.target.value);
  }

  const [selectedFinYear, setSelectedFinYear] = useState('');
  const finYearSelector = useCallback(({ title, buttonTitle, type, fieldProps = {} }) => {
    return (
      <div style={{ marginBottom: errorObj[type] ? '30px' : '8px' }} key={type}>
        <FieldTitle>{title || "Select Financial Year"}</FieldTitle>
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
          {...fieldProps}
        />
      </div>
    );
  }, [selectedFinYear, errorObj]);

  const handleFinYearChange = (selectedIdx) => {
    setErrorObj({
      ...errorObj,
      'fin-year': ''
    });
    setSelectedFinYear(FINANCIAL_YEAR_OPTIONS[selectedIdx].value);
  }

  const [selectedDateMap, setSelectedDateMap] = useState({});
  const dateSelector = useCallback(({ title, dateType, type, fieldProps = {} }) => {
    return (
      <div style={{ marginBottom: '30px' }} key={dateType}>
        <FieldTitle>{title || "Select Date"}</FieldTitle>
        <Input
          class="input"
          value={selectedDateMap[dateType] || ""}
          error={!!errorObj[`${type}-${dateType}`]}
          helperText={errorObj[`${type}-${dateType}`] || ""}
          onChange={handleDateChange(dateType)}
          maxLength={10}
          inputMode="numeric"
          type="text"
          id="date"
          {...fieldProps}
        />
      </div>
    );
  }, [selectedDateMap, errorObj]);
  useEffect(() => {
    if (pageObj.type === 'demat_holding') {
      setSelectedDateMap({
        'date': new Date().toLocaleDateString()
      });
    }
  }, []);

  const handleDateChange = type => event => {
    const value = event.target.value;
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

  const validateDate = (value, dateType) => {
    if (!value || !isValidDate(value)) {
      return "Please enter a valid date";
    }
    
    const formattedDate = new Date(new Date(value).toLocaleDateString()); // converts dd/mm/yyyy to mm/dd/yyyy
    
    if (formattedDate > new Date() && pageObj.type === 'demat_holding') {
      return "Date must not exceed today's date";
    }

    if (
      dateType === 'to' &&
      selectedDateMap['from'] &&
      isValidDate(selectedDateMap['from']) &&
      formattedDate < new Date(new Date(selectedDateMap['from']).toLocaleDateString())
    ) {
      return "Please enter value greater than From date";
    }
      
    if (selectedFinYear) {
      const [startYear, endYear] = selectedFinYear?.split('-');
      if (
        dateType === 'from' &&
        formattedDate < new Date(startYear, 3)
      ) {
        return `Please input From date greater than ${format(new Date(startYear, 3), 'PP')}`;
      }
      if (
        dateType === 'to' &&
        formattedDate > new Date(endYear, 2, 31)
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
    let paramsToSend = availableFields.reduce((params, field)  => {
      if (field.type === 'radio') {
        fieldValue = selectedRadioOption;
      } else if (field.type === 'fin-year') {
        fieldValue = selectedFinYear;
      } else if (field.type === 'date-select') {
        fieldValue = selectedDateMap[field.dateType];
      }
      params[field.paramName] = fieldValue;
      return params;
    }, {});

    if (pageObj.type === 'capital_gains') {
      const [startYear, endYear] = paramsToSend.fiscal_year.split('-');
      Object.assign(paramsToSend, {
        dt_start: new Date(startYear, 3).toLocaleDateString(),
        dt_end: new Date(endYear, 2, 31).toLocaleDateString(),
      });
    }

    return paramsToSend;
  }

  const handleClick = async () => {
    if (!validateFields()) {
      return;
    }
    const params = getParams();
    try {
      setIsApiRunning('button');
      const response = await getStatement(pageObj.type, params);
      setIsApiRunning(false);
      Toast(response.message);
    } catch (err) {
      setIsApiRunning(false);
      Toast(err);
    }
  }

  return (
    <Container
      title={pageObj.title}
      smallTitle={pageProps.subtitle || "Choose time period to view statement"}
      buttonTitle={`Email ${pageObj.title}`}
      handleClick={handleClick}
      showLoader={isApiRunning}
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