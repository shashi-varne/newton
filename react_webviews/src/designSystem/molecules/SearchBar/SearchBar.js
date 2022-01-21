import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';

import './SearchBar.scss';
import { Imgc } from '../../../common/ui/Imgc';

const SearchBar = ({
  inputProps={},
  disabled,
  value,
  onChange,
  prefix,
  suffix,
  onSuffixClick,
  placeholder,
  onPrefixClick,
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
        InputProps={{
          startAdornment: InputPrefix(),
          endAdornment: InputSuffix(),
          customvariant: 'searchBar',
          ...inputProps,
        }}
        {...props}
      />
    </Box>
  );
};

export default SearchBar;

const DefaultPrefix = () => (
  <Imgc src={require('assets/search_icon.svg')} style={{ height: '16px', width: '16px' }} />
);
SearchBar.defaultProps = {
  prefix: <DefaultPrefix />,
};
