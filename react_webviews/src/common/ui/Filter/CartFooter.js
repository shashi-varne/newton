import React, { useState } from 'react'

// import Filter from './Filter'
// import Cart from './Cart'
// import DiyCartButton from './CartButton'
import FilterButton from "./FilterButton";
import Filter from "./Filter";
import "./commonStyles.scss"
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;
const CartFooter = ({
    SortFilterData,
    filterOptions,
    ...props
}) => {
    const [filterActive, setFilterActive] = useState(false);
    const [cartActive, setCartActive] = useState(false)
    return (
        <footer className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} >
            <FilterButton
                className="button diy-filter-button"
                onClick={() => setFilterActive(true)}
            />
            <Filter
                isOpen={filterActive}
                setFilterActive={setFilterActive}
                SortFilterData={SortFilterData}
                filterOptions={filterOptions}
            />
        </footer>
    )
}

export default CartFooter
