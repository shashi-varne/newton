import './WVMenuListDropdown.Scss';
import React, { useState } from "react";
import WVMenuListDropDown from './WVMenuListDropdownItem';
import { isEmpty } from 'lodash';


const WVMenuListDropDownList = ({
  dataAidSuffix,
  renderPorducts,
  renderPorductsList,
  handleClick,
  ...props
}) => {

  const [selected, setSelected] = useState('');


  return (
    <>
      {!isEmpty(renderPorducts) &&
        renderPorducts.map((propObj, idx) => {
          return (
            <div className="wv-menulist-products" {...props} onClick={() => setSelected(propObj.key === selected ? "" : propObj.key)}>
              <WVMenuListDropDown
                index={idx}
                title={propObj.title}
                subtitle={propObj.subtitle}
                keyname={propObj.key}
                image={propObj.image}
                handleClick={() => handleClick(propObj)}
                selected={selected}
                classes={propObj.className}
                isDropDown={propObj.isDropDown}
                contentPropsMapList={renderPorductsList}
                dataAidSuffix={dataAidSuffix} >
              </WVMenuListDropDown>
            </div>
          )
        })}
    </>
  );
}



export default WVMenuListDropDownList;