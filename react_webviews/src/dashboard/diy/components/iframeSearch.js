import React from 'react';
import Input from 'common/ui/Input';
import searchIcon from 'assets/icon_search.svg';
import SVG from 'react-inlinesvg';
import './style.scss'
const iframeSearch = ({value, handleChange}) => {
  // const [fundName, setFundName] = useState('');

  // const handleChange = (e) => {
  //   setFundName(e.target.value)
  // }
  return (
    <div className='diy-iframe-search-input'>
      <Input
        id='diy-fund-search'
        class='diy-fund-search'
        value={value}
        onChange={handleChange}
        type='text'
        autoFocus
        placeholder='Search for direct mutual fund schemes'
      />
      <span className='diy-iframe-search-icon'>
          <SVG
            style={{marginLeft: 'auto', width:20, cursor:'pointer'}}
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#979797')}
            src={searchIcon}
          /></span>
    </div>
  )
}

export default iframeSearch
