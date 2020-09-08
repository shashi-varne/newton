import React, { useState, useEffect } from "react";
import { IconButton, Collapse } from "material-ui";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SelectMembers from "./SelectMembersMobile";
import toast from "../../common/ui/Toast";
import { fetchAllPANs } from "../common/ApiCalls";
import DotDotLoader from "../../common/ui/DotDotLoader";
import { isEmpty, storageService } from "../../utils/validators";
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

export default function PanSelect(props) {
  const cachedPan = storageService().getObject('wr-current-pan');
  const [dropdown_open, toggleDropdown] = useState(false);
  const [selectedPan, setPan] = useState("");
  const [panModal, toggleModal] = useState(false);
  const [panList, setPanList] = useState([]);
  const [tooltipMsg, setTooltipMsg] = useState("");
  const [loadingPans, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { 
        const data = await fetchAllPANs();

        setPanList(data);
        if (!data.length || isEmpty(data)) {
          setTooltipMsg("No PANs found");
          selectPan('empty'); //To let Main Page know when there's no registered PANs
        } else {
          if (data.length === 1) setTooltipMsg("No more PANs to show");
          if (!cachedPan || isEmpty(cachedPan)) {
            selectPan(data[0].pan);
            storageService().setObject('wr-current-pan', data[0].pan);
          } else {
            selectPan(cachedPan);
          }
        }
      } catch (err) {
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, []);

  const selectPan = (pan) => {
    toggleDropdown(false);
    setPan(pan === 'empty' ? '' : pan);
    storageService().setObject('wr-current-pan', pan);
    props.onPanSelect(pan); // send selected pan to parent element
  };

  const handleClick = () => {
    toggleDropdown(!dropdown_open);
    toggleModal(!panModal);
  };

  const handleClose = () => {
    toggleDropdown(false);
    toggleModal(false);
  };

  return (
    <div className="wr-pan-dropdown">
      <div className={`wr-header-pan-select ${dropdown_open ? 'wr-pan-list-open' : ''}`}>
        {/* visibility will be modified based on the condition in media queries */}
        <ClickAwayListener onClickAway={handleClose}>
          <div className="wr-pan-content" onClick={handleClick}>
            <img
              id="wr-pan-logo"
              src={require(`assets/fisdom/ic-added-pans.svg`)}
              alt=""
            />

            <div className="wr-pan-detail">
              <div className="wr-pan-title">Showing report for</div>
              {
                loadingPans ? 
                  <DotDotLoader className="wr-dot-loader" /> :
                  <div className="wr-pan">{selectedPan === "NA" ? "Unidentified PAN" : (selectedPan || 'No PANs linked')}</div>
              }
            </div>
            {selectedPan &&
              <div title={tooltipMsg || ''}>
                <IconButton
                  classes={{ root: "wr-icon-button" }}
                  color="inherit"
                  aria-label="Menu"
                  disabled={tooltipMsg}
                >
                  <img
                    src={require(
                      `assets/fisdom/${isMobileView ? 'ic-mob' : 'ic'}-dropdown.svg`
                    )}
                    alt=""
                  />
                </IconButton>
              </div>
            }
          </div>
        </ClickAwayListener>

        {/* visibility will be modified based on condition 'isMobileView' */}
        {!isMobileView && (
          <Collapse in={dropdown_open}>
            <div>
              {panList.map((pan, index) => pan !== selectedPan && (
                  <div onClick={() => selectPan(pan.pan)} key={index}>
                    {index !== 0 && <div className="hr"></div>}
                    <div className="wr-pan-content">
                      <img
                        id="wr-pan-logo"
                        src={require(`assets/fisdom/ic-added-pans.svg`)}
                        alt=""
                      />
                      <div className="wr-pan-detail">
                        <div className="wr-pan-title">{pan.name || "N/A"}</div>
                        <div className="wr-pan">{pan.pan === "NA" ? "Unidentified PAN" : pan.pan}</div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </Collapse>
        )}

        {/* visibility will be modified based on condition 'isMobileView' */}
        {isMobileView && (
          <SelectMembers
            open={panModal}
            pans={panList}
            selectPan={selectPan}
            selectedPan={selectedPan}
          />
        )}
      </div>
    </div>
  );
}
