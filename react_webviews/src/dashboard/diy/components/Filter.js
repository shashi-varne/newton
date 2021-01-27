import React, { useState } from 'react'
import DiyDialog from './DiyDialog'
import Button from '@material-ui/core/Button'

import SortFilter from './SortFilter'
import OptionFilter from './OptionFilter'

const Filter = ({ isOpen, setFilterActive }) => {
  const [activeTab, setActiveTab] = useState('sort')
  const close = () => {
    setFilterActive(false)
  }

  return (
    <DiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet">
        <header className="header">
          <div className="text">Filter</div>
          <Button color="secondary">Reset</Button>
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
            {activeTab === 'sort' && <SortFilter />}
            {activeTab === 'fundOption' && <OptionFilter />}
          </div>
        </main>
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={() => {}}
        >
          Apply
        </Button>
      </section>
    </DiyDialog>
  )
}

export default Filter
