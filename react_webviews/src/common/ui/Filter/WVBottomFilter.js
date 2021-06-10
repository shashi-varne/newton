import React, { useEffect, useState } from "react";
import WVFilterButton from "./WVFilterButton";
import WVFilter from "./WVFilter";
import "./WVFilterCommonStyles.scss";
import { getConfig } from '../../../utils/functions';

const isMobileDevice = getConfig().isMobileDevice;

const WVBottomFilter = ({
    dataAidSuffix,
    filterOptions,
    getSortedFilter,
    defaultFilter
}) => {

    const [sortFilter, setSortFilter] = useState(false);
    const [filterActive, setFilterActive] = useState(false);
    const [renderApi, setRenderApi] = useState(false);

    useEffect(() => {
        if (renderApi) {
            getSortedFilter(sortFilter);
            setRenderApi(false)
        }
    }, [sortFilter]);

    return (
        <footer className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} data-aid={`diy-cart-${dataAidSuffix}`}>
            <WVFilterButton
                dataAidSuffix={dataAidSuffix}
                onClick={() => setFilterActive(true)}
            />
            <WVFilter
                dataAidSuffix={dataAidSuffix}
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

export default WVBottomFilter;
