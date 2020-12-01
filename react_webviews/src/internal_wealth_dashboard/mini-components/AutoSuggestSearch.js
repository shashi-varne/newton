import React from 'react';
import Select, { components } from 'react-select';
import SearchIcon from '@material-ui/icons/Search';
const AutoSuggestSearch = ({ fundNames, handleChange, placeholder }) => {
  if (!fundNames) {
    return <Select options={[]} />;
  }
  const suggestions = Object.keys(fundNames).map((key) => ({
    label: key,
    value: fundNames[key],
  }));
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
  const styles = {
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 24,
    }),
  };
  const customTheme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'red',
        primary: 'yellow',
        opacity: '0.05',
      },
    };
  };
  const customStyles = {
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 30,
    }),
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
      />
    </div>
  );
};

export default AutoSuggestSearch;
