import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from 'common/ui/Button'
import { isEmpty } from "utils/validators";
import SortFilter from './SortFilter'
import OptionFilter from './OptionFilter'
import FundHouse from './FundHouse'
import "./commonStyles.scss"

const Filter = ({
  isOpen,
  setFilterActive,
  fundHouse,
  sortFilter,
  fundOption,
  setFundHouse,
  setSortFilter,
  setFundOption,
  SortFilterData,
  filterOptions,
}) => {
  const [activeTab, setActiveTab] = useState(Object.keys(filterOptions[0])[0]);
  const [activeData, setActiveData] = useState(Object.values(filterOptions[0])[0]);
  const [localSortFilter, setLocalSortFilter] = useState(sortFilter); 
  
  const [localFundHouse, setLocalFundHouse] = useState(fundHouse)
  const [localFundOption, setLocalFundOption] = useState(fundOption)

  const close = () => {
    setFilterActive(false)
  }

  const apply = () => {
    // setFundHouse(localFundHouse)
    setSortFilter(localSortFilter)
    // setFundOption(localFundOption)
    close()
  }

  const reset = () => {
    setFundOption('growth')
    setSortFilter('returns')
    setFundHouse('')
    setLocalFundOption('growth')
    setLocalSortFilter('returns')
    setLocalFundHouse('')
    setActiveTab('sort')
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

export default Filter




           {/* {activeTab === 'index' && (
              <indexFilter
                localSortFilter={localSortFilter}
                setLocalSortFilter={setLocalSortFilter}
                SortFilterData={SortFilterData}
              />
            )} */}
            {/* {activeTab === 'Fund Option' && (
              <OptionFilter
                localFundOption={localFundOption}
                setLocalFundOption={setLocalFundOption}
              />
            )}
            {activeTab === 'Fund House' && (
              <FundHouse
                localFundHouse={localFundHouse}
                setLocalFundHouse={setLocalFundHouse}
              />
            )} */}