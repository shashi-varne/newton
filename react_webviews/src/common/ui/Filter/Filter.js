import React, { useState } from 'react';
import DiyDialog from './DiyDialog';
import Button from 'common/ui/Button';
import { isEmpty } from 'lodash';
import SortFilter from './SortFilter';
import "./commonStyles.scss";

const Filter = ({
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
    <DiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet diy-filter-bottom-sheet filter-bottom-sheet">
        <p className="heading">FILTERS</p>
        <main className="filter">
          <div className="title">
            <ul>
              {!isEmpty(filterOptions) &&
                filterOptions.map((item , idx) => {
                  let filter_options = Object.keys(item)[0];
                  return (
                    <li
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
          <div className="body">
            <SortFilter
              selectedTab={activeTab}
              localSortFilter={localSortFilter}
              setLocalSortFilter={setLocalSortFilter}
              SortFilterData={activeData}
            />
          </div>
        </main>
        <footer className="filter-buttons">
          <Button
            twoButton
            dualbuttonwithouticon
            handleClickOne={reset}
            handleClickTwo={apply}
            buttonOneTitle="CLEAR ALL"
            buttonTwoTitle="APPLY"
          />
        </footer>
      </section>
    </DiyDialog>
  )
}

export default Filter;
