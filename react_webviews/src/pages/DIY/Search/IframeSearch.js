import React from 'react';
import InputField from '../../../designSystem/molecules/InputField';
import searchIcon from 'assets/icon_search.svg';
import SVG from 'react-inlinesvg';
import './IframeSearch.scss';
const IframeSearch = ({ value, handleChange }) => {
  return (
    <div className='diy-iframe-search-input'>
      <InputField
        id='diy-fund-search'
        className='diy-fund-search'
        value={value}
        onChange={handleChange}
        type='text'
        autoFocus
        placeholder='Search for direct mutual fund schemes'
      />
      <span className='diy-iframe-search-icon'>
        <SVG
          style={{ marginLeft: 'auto', width: 20, cursor: 'pointer', verticalAlign: 'middle' }}
          preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=#979797')}
          src={searchIcon}
        />
      </span>
    </div>
  );
};

export default IframeSearch;
