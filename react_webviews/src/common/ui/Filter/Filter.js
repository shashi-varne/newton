import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from 'common/ui/Button'
import { isEmpty } from "utils/validators";
import SortFilter from './SortFilter'
import "./commonStyles.scss"

const Filter = ({
  isOpen,
  setFilterActive,
  sortFilter,
  setSortFilter,
  filterOptions,
}) => {
  const [activeTab, setActiveTab] = useState(Object.keys(filterOptions[0])[0]);
  const [activeData, setActiveData] = useState(Object.values(filterOptions[0])[0]);
  const [localSortFilter, setLocalSortFilter] = useState(sortFilter); 
  
  const close = () => {
    setFilterActive(false)
  }

  const apply = () => {
    setSortFilter(localSortFilter)
    close()
  }

  const reset = () => {
    setLocalSortFilter('returns')
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
                filterOptions.map((item) => {
                  let filter_options = Object.keys(item)[0];
                  return (
                    <li
                      role="button"
                      tabIndex="0"
                      onClick={() => {
                        setActiveTab(filter_options);
                        setActiveData(item[filter_options])
                      }}
                      className={activeTab === filter_options ? 'selected' : ''}
                    >
                      {filter_options}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="body">
            <SortFilter
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