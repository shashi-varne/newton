import React, { useState } from 'react';
import FilterButton from "./FilterButton";
import Filter from "./Filter";
import "./commonStyles.scss";
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;

const CartFooter = ({
    filterOptions,
    getSortedFilter,
    ...props
}) => {

    const [sortFilter, setSortFilter] = useState(false);
    const [filterActive, setFilterActive] = useState(false);
    const [renderApi, setRenderApi] = useState(false);

    if (!!sortFilter && !filterActive && renderApi) {
        getSortedFilter(sortFilter);
        setRenderApi(false)
    }

    return (
        <footer className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} >
            <FilterButton
                className=""
                onClick={() => setFilterActive(true)}
            />
            <Filter
                isOpen={filterActive}
                setFilterActive={setFilterActive}
                setSortFilter={setSortFilter}
                setRenderApi={setRenderApi}
                filterOptions={filterOptions}
            />
        </footer>
    )
}

export default CartFooter;
