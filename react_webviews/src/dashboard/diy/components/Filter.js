import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from '@material-ui/core/Button'

import SortFilter from './SortFilter'
import OptionFilter from './OptionFilter'
import FundHouse from './FundHouse'

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
    close()
  }

  return (
    <DiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet">
        <header className="header">
          <div className="text">Filter</div>
          <Button color="secondary" onClick={reset}>Reset</Button>
        </header>
        <main className="filter">
          <div className="title">
            <ul>
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('sort')}
                className={activeTab === 'sort' ? 'selected' : ''}
              >
                Sort
              </li>
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('fundOption')}
                className={activeTab === 'fundOption' ? 'selected' : ''}
              >
                Fund Option
              </li>
              <li
                role="button"
                tabIndex="0"
                onClick={() => setActiveTab('fundHouse')}
                className={activeTab === 'fundHouse' ? 'selected' : ''}
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
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={apply}
        >
          Apply
        </Button>
      </section>
    </DiyDialog>
  )
}

export default Filter
