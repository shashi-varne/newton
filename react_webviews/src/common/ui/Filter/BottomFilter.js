import React, { useState } from 'react';
import FilterButton from "./FilterButton";
import Filter from "./Filter";
import "./commonStyles.scss";
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;

const BottomFilter = ({
    filterOptions,
    getSortedFilter,
    defaultFilter
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
                onClick={() => setFilterActive(true)}
            />
            <Filter
                isOpen={filterActive}
                setFilterActive={setFilterActive}
                setSortFilter={setSortFilter}
                setRenderApi={setRenderApi}
                defaultFilter={defaultFilter}
                filterOptions={filterOptions}
            />
        </footer>
    )
}

export default BottomFilter;
