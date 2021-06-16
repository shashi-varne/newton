import React, { useEffect, useState } from "react";
import WVDiyDialog from './WVDiyDialog';
import Button from 'common/ui/Button';
import { isEmpty } from 'lodash';
import SortFilter from './WVSortFilter';
import { getConfig } from '../../../utils/functions';
import "./WVFilterCommonStyles.scss";
import WVFilterButton from "./WVFilterButton";

const isMobileDevice = getConfig().isMobileDevice;

const WVFilter = ({
  dataAidSuffix,
  getSelectedOptions,         // Function CallBack From The Parent Which Sends the Filtered Data To the API
  withButton,                //  If User Wants Filter With Button
  filterOptions,            //  Data For the Filter Dialog Box
  defaultFilterOption,    // default Option Selected In filter Dialog Box
}) => {
  const [activeTab, setActiveTab] = useState(defaultFilterOption ? Object.keys(defaultFilterOption)[0] : filterOptions[0].key);
  const [activeTabOptions, setActiveTabOptions] = useState(filterOptions[0].option);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilterOption || {});
  const [isOpen, setIsOpen] = useState(withButton ? false : true);
  // const [renderApi, setRenderApi] = useState(false);


  // useEffect(() => {
  //   if (renderApi) {
  //     getSelectedOptions(selectedFilters);
  //     setRenderApi(false)
  //   }
  // }, [selectedFilters]);


  const close = (data) => {
    setIsOpen(false);
    // if (data === "apply") setRenderApi(true);
    // else setRenderApi(false);
  };

  const apply = () => {
    getSelectedOptions(selectedFilters)
    close('apply')
  }

  const reset = () => {
    setSelectedFilters(defaultFilterOption || {})
    setActiveTab(activeTab)
    // close()
  }

  return (

    <>

      <WVDiyDialog close={close} open={isOpen}>
        <section className="diy-bottom-sheet diy-filter-bottom-sheet filter-bottom-sheet" data-aid={`filter-bottom-sheet-${dataAidSuffix}`}>
          <p className="heading">FILTERS</p>
          <main className="filter">
            <div className="title">
              <ul>
                {!isEmpty(filterOptions) &&
                  filterOptions.map((item, idx) => {
                    let TabName = item.name;
                    return (
                      <li
                        data-aid={`filter-bottom-sheet-${dataAidSuffix}-${idx + 1}`}
                        key={idx}
                        role="button"
                        tabIndex="0"
                        onClick={() => {
                          document.getElementById("scroll-container").scrollTo(0, 0)
                          setActiveTab(item.key);
                          setActiveTabOptions(item.option);
                        }}
                        className={activeTab === item.key ? 'selected' : 'notselected'}
                      >
                        {TabName}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="body" id="scroll-container" data-aid={`body-${dataAidSuffix}`}>
              <SortFilter
                activeTab={activeTab}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                activeTabOptions={activeTabOptions}
              />
            </div>
          </main>
          <footer className="filter-buttons" data-aid={`filter-btn-footer-${dataAidSuffix}`}>
            <Button
              dataAid={`apply-btn-${dataAidSuffix}`}
              twoButton
              dualbuttonwithouticon
              handleClickOne={reset}
              handleClickTwo={apply}
              buttonOneTitle="CLEAR ALL"
              buttonTwoTitle="APPLY"
            />
          </footer>
        </section>
      </WVDiyDialog>


      {withButton && <div className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} data-aid={`diy-cart-${dataAidSuffix}`}>
        <WVFilterButton
          dataAidSuffix={dataAidSuffix}
          onClick={() => setIsOpen(true)}
        />
      </div>
      }
    </>
  )
}

export default WVFilter;