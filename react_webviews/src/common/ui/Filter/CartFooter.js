import React, { useState } from 'react'
import FilterButton from "./FilterButton";
import Filter from "./Filter";
import "./commonStyles.scss"
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;
const CartFooter = ({
    filterOptions,
    getSortedFilter,
    ...props
}) => {
    const [filterActive, setFilterActive] = useState(false);
    const [sortFilter, setSortFilter] = useState(false);



    getSortedFilter(sortFilter)



    return (
        <footer className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} >
            <FilterButton
                className="button diy-filter-button"
                onClick={() => setFilterActive(true)}
            />
            <Filter
                isOpen={filterActive}
                setFilterActive={setFilterActive}
                setSortFilter={setSortFilter}
                filterOptions={filterOptions}
            />
        </footer>
    )
}

export default CartFooter
