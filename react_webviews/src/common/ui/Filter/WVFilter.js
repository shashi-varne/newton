import React, { useState } from 'react';
import WVDiyDialog from './WVDiyDialog';
import Button from 'common/ui/Button';
import { isEmpty } from 'lodash';
import SortFilter from './WVSortFilter';
import "./WVFilterCommonStyles.scss";

const WVFilter = ({
  dataAidSuffix,
  isOpen,
  setFilterActive,
  setRenderApi,
  setSortFilter,
  filterOptions,
  defaultFilter
}) => {
  const [activeTab, setActiveTab] = useState(Object.keys(filterOptions[0])[0]);
  const [activeData, setActiveData] = useState(Object.values(filterOptions[0])[0]);
  const [localSortFilter, setLocalSortFilter] = useState(defaultFilter);
  
  const close = (data) => {
    setFilterActive(false);
    if (data === "apply") setRenderApi(true);
    else setRenderApi(false);
  };

  const apply = () => {
    setSortFilter(localSortFilter)
    close('apply')
  }

  const reset = () => {
    setLocalSortFilter(defaultFilter)
    setActiveTab(activeTab)
    // close()
  }
  
  return (
    <WVDiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet diy-filter-bottom-sheet filter-bottom-sheet" data-aid={`filter-bottom-sheet-${dataAidSuffix}`}>
        <p className="heading">FILTERS</p>
        <main className="filter">
          <div className="title">
            <ul>
              {!isEmpty(filterOptions) &&
                filterOptions.map((item , idx) => {
                  let filter_options = Object.keys(item)[0];
                  return (
                    <li
                      data-aid={`filter-bottom-sheet-${dataAidSuffix}-${idx+1}`}
                      key={idx}
                      role="button"
                      tabIndex="0"
                      onClick={() => {
                        setActiveTab(filter_options);
                        setActiveData(item[filter_options])
                      }}
                      className={activeTab === filter_options ? 'selected' : 'notselected'}
                    >
                      {filter_options}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="body" data-aid={`body-${dataAidSuffix}`}>
            <SortFilter
              selectedTab={activeTab}
              localSortFilter={localSortFilter}
              setLocalSortFilter={setLocalSortFilter}
              SortFilterData={activeData}
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
  )
}

export default WVFilter;
