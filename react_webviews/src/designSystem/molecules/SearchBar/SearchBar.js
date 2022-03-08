import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';

import './SearchBar.scss';
import Icon from '../../atoms/Icon';

const SearchBar = ({
  inputProps,
  disabled,
  value,
  onChange,
  prefix,
  suffix,
  onSuffixClick,
  placeholder,
  onPrefixClick,
  dataAid,
  inputDataAid,
  InputProps,
  ...props
}) => {
  const InputPrefix = () => {
    if (prefix) {
      return (
        <InputAdornment
          disableTypography={disabled}
          disablePointerEvents={disabled}
          position='start'
        >
          <div
            onClick={onPrefixClick}
            className={`search-bar-prefix-wrapper ${onPrefixClick && 'sb-prefix-clickable'}`}
          >
            {prefix}
          </div>
        </InputAdornment>
      );
    } else {
      return null;
    }
  };
  const InputSuffix = () => {
    if (suffix) {
      return (
        <InputAdornment disableTypography={disabled} disablePointerEvents={disabled} position='end'>
          <div
            onClick={onSuffixClick}
            className={`search-bar-suffix-wrapper ${onSuffixClick && 'sb-suffix-clickable'}`}
          >
            {suffix}
          </div>
        </InputAdornment>
      );
    } else {
      return null;
    }
  };
  return (
    <Box
      sx={{ backgroundColor: 'foundationColors.supporting.white' }}
      className='searchBar-wrapper'
    >
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        data-aid={`searchBar_${dataAid}`}
        InputProps={{
          startAdornment: InputPrefix(),
          endAdornment: InputSuffix(),
          customvariant: 'searchBar',
          inputProps: {
            "data-aid": inputDataAid,
            ...inputProps,
          },
          ...InputProps,
        }}
        {...props}
      />
    </Box>
  );
};

export default SearchBar;

const DefaultPrefix = () => (
  <Icon src={require('assets/search_icon.svg')} size='16px' dataAid="left" />
);
SearchBar.defaultProps = {
  prefix: <DefaultPrefix />,
  inputProps: {},
};

SearchBar.propTypes = {
  inputProps: PropTypes.object,
  disabled: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  onPrefixClick: PropTypes.func,
  onSuffixClick: PropTypes.func,
  placeholder: PropTypes.string,
  dataAid: PropTypes.string,
};
