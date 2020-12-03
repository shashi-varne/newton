import React, { useState } from 'react';
import Select, { components } from 'react-select';
import SearchIcon from '@material-ui/icons/Search';
import { isEmpty, storageService } from '../../utils/validators';
const AutoSuggestSearch = ({ fundNames, placeholder, filter_key, handleFilterData }) => {
  const filterVal = storageService().getObject(filter_key);
  const suggestions = Object.keys(fundNames).map((key) => ({
    label: key,
    value: fundNames[key],
  }));

  const getStoredFundName = () => {
    console.log('filter val', filterVal['amfi']);
    const data = suggestions.find((el) => el.value === filterVal['amfi']);
    console.log('storedfund name', data);
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
          {!!children && <SearchIcon style={{ position: 'absolute', left: 6 }} />}
          {children}
        </components.ValueContainer>
      )
    );
  };

  const customStyles = {
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 30,
    }),
    // indicatorsContainer: (base) => ({
    //   ...base,
    //   display: 'none',
    // }),
    // option: (provided, state) => ({
    //   ...provided,
    //   color: state.isSelected ? '#1F041E' : '#0A1D32',
    //   textAlign: 'left',
    //   '&:hover': { backgroundColor: '#4F2DA6', opacity: '0.05', color: '#1F041E' },
    // }),

    // singleValue: (provided, state) => {
    //   const opacity = state.isDisabled ? 0.5 : 1;
    //   const transition = 'opacity 300ms';

    //   return { ...provided, opacity, transition };
    // },
    control: (base, state) => ({
      ...base,
      //background: '#4F2DA6',
      border: 'none',
      color: 'black',
    }),
  };
  const DropdownIndicator = () => null;

  return (
    <div>
      <Select
        placeholder={placeholder}
        //className='react-select-container'
        components={{ DropdownIndicator, ValueContainer }}
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
