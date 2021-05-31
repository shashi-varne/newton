import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from 'common/ui/Button'

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
}) => {
  const [activeTab, setActiveTab] = useState('sort')
  const [localFundHouse, setLocalFundHouse] = useState(fundHouse)
  const [localSortFilter, setLocalSortFilter] = useState(sortFilter)
  const [localFundOption, setLocalFundOption] = useState(fundOption)

  const close = () => {
    setFilterActive(false)
  }

  const apply = () => {
    setFundHouse(localFundHouse)
    setSortFilter(localSortFilter)
    setFundOption(localFundOption)
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
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('sort')}
                className={activeTab === 'sort' ? 'selected' : 'notselected'}
              >
                Sort
              </li>
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('fundOption')}
                className={activeTab === 'fundOption' ? 'selected' : 'notselected'}
              >
                Fund Option
              </li>
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('fundHouse')}
                className={activeTab === 'fundHouse' ? 'selected' : 'notselected'}
              >
                Fund House
              </li>
            </ul>
          </div>
          <div className="body">
            {activeTab === 'sort' && (
              <SortFilter
                localSortFilter={localSortFilter}
                setLocalSortFilter={setLocalSortFilter}
              />
            )}
            {activeTab === 'fundOption' && (
              <OptionFilter
                localFundOption={localFundOption}
                setLocalFundOption={setLocalFundOption}
              />
            )}
            {activeTab === 'fundHouse' && (
              <FundHouse
                localFundHouse={localFundHouse}
                setLocalFundHouse={setLocalFundHouse}
              />
            )}
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
