import React, { useState } from 'react'

import Filter from './Filter'
import Cart from './Cart'
import DiyCartButton from './CartButton'
import FilterButton from './FilterButton'

const CartFooter = ({ cart, fundsList, setCart, setFundsList }) => {
  const [filterActive, setFilterActive] = useState(false)
  const [cartActive, setCartActive] = useState(false)
  return (
    <footer className="diy-cart-footer">
      <DiyCartButton className="button" onClick={() => setCartActive(true)} />
      <FilterButton
        className="button diy-filter-button"
        onClick={() => setFilterActive(true)}
      />
      <Filter isOpen={filterActive} setFilterActive={setFilterActive} />
      <Cart
        isOpen={cartActive}
        setCartActive={setCartActive}
        cart={cart}
        setCart={setCart}
      />
    </footer>
  )
}

export default CartFooter
