import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from 'common/ui/Button'

import SortFilter from './SortFilter'
import OptionFilter from './OptionFilter'
import FundHouse from './FundHouse'
import "./mini-components.scss";

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
      <section className="diy-bottom-sheet diy-filter-bottom-sheet" data-aid='diy-filter-bottom-sheet'>
        <header className="header" data-aid='diy-filter-header'>
          <b className="text">Filter</b>
          <div onClick={reset} className="reset">Reset</div>
        </header>
        <main className="filter" data-aid='filter-main'>
          <div className="title" data-aid='filter-title'>
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
          <div className="body" data-aid='diy-body'>
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
        <footer data-aid='filter-footer'>
          <Button
            dataAid='apply-btn'
            fullWidth
            onClick={apply}
            buttonTitle="Apply"
            classes={{
              button: "filter-button"
            }}
          />
        </footer>
      </section>
    </DiyDialog>
  )
}

export default Filter
