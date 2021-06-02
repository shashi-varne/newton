import React, { useState } from 'react';
import FilterButton from "./FilterButton";
import Filter from "./Filter";
import "./commonStyles.scss";
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;

const BottomFilter = ({
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
            {/* <div
                className="filter-toggle-button"
                onClick={() => setFilterActive(true)}
            ><img src={require('../../../assets/filter_icon.svg')} /><p><b>Filter</b></p></div> */}
            <FilterButton
                className="button diy-filter-button"
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

export default BottomFilter;
