import React, { useState } from 'react'

import Filter from './Filter'
import Cart from './Cart'
import DiyCartButton from './CartButton'
import FilterButton from './FilterButton'
import "./mini-components.scss";
import { getConfig } from '../../../utils/functions'
import { storageService } from '../../../utils/validators'

const isMobileDevice = getConfig().isMobileDevice;
const CartFooter = ({
  cart,
  setCart,
  fundHouse,
  setFundHouse,
  setFundOption,
  fundOption,
  sortFilter,
  setSortFilter,
  sendEvents,
  ...props
}) => {
  const [filterActive, setFilterActive] = useState(false)
  const [cartActive, setCartActive] = useState(false)
  return (
    <footer className="diy-cart-footer" style={{marginLeft: isMobileDevice && 0}} >
      <FilterButton
        className="button diy-filter-button"
        onClick={() => {storageService().set('filter_clicked',true); setFilterActive(true)}}
      />
      <DiyCartButton
        className="button"
        onClick={() => {sendEvents('cart'); setCartActive(true)}}
        cartlength={cart.length}
        disabled={cart.length === 0}
      />
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
        sendEvents={sendEvents}
        {...props}
      />
    </footer>
  )
}

export default CartFooter
