import "./commonStyles.scss";
import React, { useState } from "react";
import { isEmpty } from 'lodash';
import { getConfig } from '../../../utils/functions';
import WVButtonLayout from "../ButtonLayout/WVButtonLayout";
import RenderTabOptions from './RenderTabOptions';
import WVFilterButton from "./WVFilterButton";
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Slide from '@material-ui/core/Slide'

const isMobileDevice = getConfig().isMobileDevice;


function Transition(props) {
  return <Slide direction="up" {...props} />
}

const FilterContainer = ({ close, open, children, ...props }) => {
  return (
    <Dialog
      onClose={close}
      open={open}
      aria-labelledby="filter-dialog"
      TransitionComponent={Transition}
      aria-describedby="filter-dialog-slide-selection"
      id="filter-dialog"
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

const WVFilter = ({
  dataAidSuffix,
  onApplyClicked,           // Function CallBack From The Parent Which Sends the Filtered Data To the API
  withButton,              //  If User Wants Filter With Button
  filterOptions,          //  Data For the Filter Dialog Box
  defaultSelectedTab,    // default Option Selected In filter Dialog Box
}) => {
  const [activeTab, setActiveTab] = useState(defaultSelectedTab ? Object.keys(defaultSelectedTab)[0] : filterOptions[0].key);
  const [activeTabOptions, setActiveTabOptions] = useState(filterOptions[0].option);
  const [selectedOptions, onOptionsSelected] = useState(defaultSelectedTab || {});
  const [isOpen, setIsOpen] = useState(withButton ? false : true);

  const closeFilter = (data) => {
    setIsOpen(false);
  };

  const applyFilters = () => {
    onApplyClicked(selectedOptions)
    closeFilter('apply')
  }

  const reset = () => {
    onOptionsSelected(defaultSelectedTab || {})
    setActiveTab(activeTab)
  }

  const onTabSelected = (item) => {
    document.getElementById("scroll-container").scrollTo(0, 0)
    setActiveTab(item.key);
    setActiveTabOptions(item.option);
  }

  return (

    <>

      <FilterContainer close={closeFilter} open={isOpen}>
        <section className="wv-filter-bottom-sheet" data-aid={`filter-bottom-sheet-${dataAidSuffix}`}>
          <p className="heading">FILTERS</p>
          <main className="wv-filter">
            <div className="wv-title">
              <ul>
                {!isEmpty(filterOptions) &&
                  filterOptions.map((item, idx) => {
                    return (
                      <li
                        data-aid={`filter-bottom-sheet-${dataAidSuffix}-${idx + 1}`}
                        key={idx}
                        role="button"
                        tabIndex={`${idx}`}
                        onClick={() => onTabSelected(item)}
                        className={`wv-tab ${activeTab === item.key ? 'tab-option' : ''}`}
                      >
                        {item.name}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="body" id="scroll-container" data-aid={`body-${dataAidSuffix}`}>
              <RenderTabOptions
                dataAidSuffix={dataAidSuffix}
                activeTab={activeTab}
                selectedOptions={selectedOptions}
                onOptionsSelected={onOptionsSelected}
                activeTabOptions={activeTabOptions}
              />
            </div>
          </main>
          <WVButtonLayout
            className="wv-filter-buttons"
          >
            <WVButtonLayout.Button
              type="secondary"
              title="CLEAR ALL"
              onClick={reset}
            />
            <WVButtonLayout.Button
              type="primary"
              title="APPLY"
              onClick={applyFilters}
            />
          </WVButtonLayout>
        </section>
      </FilterContainer>


      {withButton && <div className="wv-filter-with-btn" style={{ marginLeft: isMobileDevice && 0 }} data-aid={`filter-cart-${dataAidSuffix}`}>
        <WVFilterButton
          dataAidSuffix={dataAidSuffix}
          onClick={() => setIsOpen(true)}
        />
      </div>
      }
    </>
  )
}

export default WVFilter;