import React, { useEffect, useState } from "react";
// import WVDiyDialog from './WVDiyDialog';
import Button from 'common/ui/Button';
import WVButtonLayout from "../ButtonLayout/WVButtonLayout";
import { isEmpty } from 'lodash';
import RenderTabOptions from './RenderTabOptions';
import { getConfig } from '../../../utils/functions';
import "./WVFilterCommonStyles.scss";
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
      id="diy-dialog"
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

const WVFilter = ({
  dataAidSuffix,
  getSelectedOptions,         // Function CallBack From The Parent Which Sends the Filtered Data To the API
  withButton,                //  If User Wants Filter With Button
  filterOptions,            //  Data For the Filter Dialog Box
  defaultFilterOption,    // default Option Selected In filter Dialog Box
}) => {
  const [activeTab, setActiveTab] = useState(defaultFilterOption ? Object.keys(defaultFilterOption)[0] : filterOptions[0].key);
  const [activeTabOptions, setActiveTabOptions] = useState(filterOptions[0].option);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilterOption || {});
  const [isOpen, setIsOpen] = useState(withButton ? false : true);
  // const [renderApi, setRenderApi] = useState(false);


  // useEffect(() => {
  //   if (renderApi) {
  //     getSelectedOptions(selectedFilters);
  //     setRenderApi(false)
  //   }
  // }, [selectedFilters]);


  const close = (data) => {
    setIsOpen(false);
    // if (data === "apply") setRenderApi(true);
    // else setRenderApi(false);
  };

  const apply = () => {
    getSelectedOptions(selectedFilters)
    close('apply')
  }

  const reset = () => {
    setSelectedFilters(defaultFilterOption || {})
    setActiveTab(activeTab)
    // close()
  }

  return (

    <>

      <FilterContainer close={close} open={isOpen}>
        <section className="diy-bottom-sheet diy-filter-bottom-sheet filter-bottom-sheet" data-aid={`filter-bottom-sheet-${dataAidSuffix}`}>
          <p className="heading">FILTERS</p>
          <main className="filter">
            <div className="title">
              <ul>
                {!isEmpty(filterOptions) &&
                  filterOptions.map((item, idx) => {
                    let TabName = item.name;
                    return (
                      <li
                        data-aid={`filter-bottom-sheet-${dataAidSuffix}-${idx + 1}`}
                        key={idx}
                        role="button"
                        tabIndex="0"
                        onClick={() => {
                          document.getElementById("scroll-container").scrollTo(0, 0)
                          setActiveTab(item.key);
                          setActiveTabOptions(item.option);
                        }}
                        className={activeTab === item.key ? 'selected' : 'notselected'}
                      >
                        {TabName}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="body" id="scroll-container" data-aid={`body-${dataAidSuffix}`}>
              <RenderTabOptions
                activeTab={activeTab}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                activeTabOptions={activeTabOptions}
              />
            </div>
          </main>
          <footer className="filter-buttons" data-aid={`filter-btn-footer-${dataAidSuffix}`}>
            <Button
              dataAid={`apply-btn-${dataAidSuffix}`}
              twoButton
              dualbuttonwithouticon
              handleClickOne={reset}
              handleClickTwo={apply}
              buttonOneTitle="CLEAR ALL"
              buttonTwoTitle="APPLY"
            />
            {/* <WVButtonLayout
              className="someClass"  // CSS FIX NEEDED!~
            >
              <WVButtonLayout.Button
                type="secondary"
                title="CLEAR ALL"
                onClick={reset}
              />
              <WVButtonLayout.Button
                type="primary"
                title="APPLY"
                onClick={apply}
              />
            </WVButtonLayout> */}
          </footer>
        </section>
      </FilterContainer>


      {withButton && <div className="diy-cart-footer" style={{ marginLeft: isMobileDevice && 0 }} data-aid={`filter-cart-${dataAidSuffix}`}>
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