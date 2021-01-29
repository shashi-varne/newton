import React, { useState } from 'react'

import Filter from './Filter'
import Cart from './Cart'
import DiyCartButton from './CartButton'
import FilterButton from './FilterButton'

const CartFooter = ({
  cart,
  setCart,
  fundHouse,
  setFundHouse,
  setFundOption,
  fundOption,
  sortFilter,
  setSortFilter,
}) => {
  const [filterActive, setFilterActive] = useState(false)
  const [cartActive, setCartActive] = useState(false)
  return (
    <footer className="diy-cart-footer">
      <FilterButton
        className="button diy-filter-button"
        onClick={() => setFilterActive(true)}
      />
      <DiyCartButton className="button" onClick={() => setCartActive(true)} cartLength={cart.length} />
      <Filter
        isOpen={filterActive}
        setFilterActive={setFilterActive}
        fundHouse={fundHouse}
        sortFilter={sortFilter}
        fundOption={fundOption}
        setFundHouse={setFundHouse}
        setFundOption={setFundOption}
        setSortFilter={setSortFilter}
      />
      <Cart
        isOpen={cartActive && cart.length > 0}
        setCartActive={setCartActive}
        cart={cart}
        setCart={setCart}
      />
    </footer>
  )
}

export default CartFooter
