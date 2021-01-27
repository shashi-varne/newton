import React, { useState } from 'react'

import Filter from './Filter'
import DiyCartButton from './CartButton'
import FilterButton from './FilterButton'

const CartFooter = () => {
  const [filterActive, setFilterActive] = useState(false)
  return (
    <footer className="diy-cart-footer">
      <DiyCartButton className="button" />
      <FilterButton className="button diy-filter-icon" onClick={() => setFilterActive(true)} />
    <Filter isOpen={filterActive} setFilterActive={setFilterActive} />
    </footer>
  )
}

export default CartFooter