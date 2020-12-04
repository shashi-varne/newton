import React, { useState } from 'react';
import Select, { components } from 'react-select';
import SearchIcon from '@material-ui/icons/Search';

import CheckIcon from '@material-ui/icons/Check';
import { isEmpty, storageService } from '../../utils/validators';
const AutoSuggestSearch = ({ fundNames, placeholder, filter_key, handleFilterData }) => {
  const filterVal = storageService().getObject(filter_key);
  const suggestions = Object.keys(fundNames).map((key) => ({
    label: key,
    value: fundNames[key],
  }));

  const getStoredFundName = () => {
    const data = suggestions.find((el) => el.value === filterVal['amfi']);
    return data;
  };
  const [fundName, setFundName] = useState(
    !isEmpty(getStoredFundName()) ? getStoredFundName() : ''
  );
  const handleChange = (data) => {
    setFundName(data?.value);
    const filterData = { ...filterVal, amfi: data?.value ? data?.value : '' };
    storageService().setObject(filter_key, filterData);
    handleFilterData(filterData);
  };

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <SearchIcon style={{ position: 'absolute', left: 16, color: '#4F2DA6' }} />
          )}
          {children}
        </components.ValueContainer>
      )
    );
  };

  const DropdownIndicator = () => null;
  const Option = (props) => {
    return (
      components.Option && (
        <components.Option {...props}>
          {props.data.label}
          {props.isSelected && (
            <CheckIcon style={{ position: 'absolute', right: 10, color: '#4F2DA6' }} />
          )}
        </components.Option>
      )
    );
  };
  const customStyles = {
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 30,
      textAlign: 'left',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),

    control: (base, state) => ({
      ...base,
      border: 'none',
      color: 'black',
      boxShadow: 'none',
      background: 'rgba(31,18,65,0.05)',
      cursor: 'pointer',
    }),
    placeholder: (base) => ({
      marginLeft: '1em',
      color: '#0A1D32',
      opacity: '0.3',
    }),
    singleValue: (base) => ({
      ...base,
      marginLeft: '20px',
      color: '#0A1D32',
      overflow: 'hidden',
      position: 'absolute',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 47px)',
      top: '50%',
      transform: 'translateY(-50%)',
      boxSizing: 'border-box',
    }),
    option: (base, state) => ({
      ...base,
      '&:hover': { backgroundColor: 'rgba(31,18,65,0.05)', color: '#1F041E', cursor: 'pointer' },
      backgroundColor: state.isSelected ? 'rgba(31,18,65,0.05)' : 'white',
      color: '#1F041E',
      alignItems: 'left',
      padding: '20px 15px',
    }),
  };
  return (
    <div>
      <Select
        placeholder={placeholder}
        components={{ DropdownIndicator, ValueContainer, Option }}
        styles={customStyles}
        options={suggestions}
        isSearchable
        isClearable
        onChange={handleChange}
        defaultValue={fundName}
      />
    </div>
  );
};

export default AutoSuggestSearch;
