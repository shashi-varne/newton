import React, { useState, useEffect } from "react";
import { IconButton } from "material-ui";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { isMobileDevice } from "utils/functions";
import SelectMembers from "./SelectMembersMobile";
import toast from "../../common/ui/Toast";
import { fetchAllPANs } from "../common/ApiCalls";
import DotDotLoader from "../../common/ui/DotDotLoader";
import { isEmpty } from "../../utils/validators";

export default function PanSelect(props) {
  const [dropdown_open, toggleDropdown] = useState(false);
  const [selectedPan, setPan] = useState("");
  const [panModal, toggleModal] = useState(false);
  const [panList, setPanList] = useState([]);
  const [loadingPans, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllPANs();
        setPanList(data);
        if (!data.length || isEmpty(data)) {
          selectPan('empty'); //To let Main Page know when there's no registered PANs
        } else {
          selectPan(data[0]);
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
    setPan(pan);
    props.onPanSelect(pan);
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
      <div className="wr-header-pan-select">
        {/* visibility will be modified based on the condition in media queries */}
        <ClickAwayListener onClickAway={handleClose}>
          <div className="wr-pan-content" style={{ cursor: "default" }}>
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
                  <div className="wr-pan">{selectedPan}</div>
              }
            </div>

            <IconButton
              classes={{ root: "wr-icon-button" }}
              color="inherit"
              aria-label="Menu"
              onClick={handleClick}
            >
              <img
                src={require(`assets/fisdom/ic-dropdown.svg`)}
                id="wr-ic-drop"
                alt=""
              />
              <img
                src={require(`assets/fisdom/ic-mob-dropdown.svg`)}
                id="wr-ic-mob-drop"
                alt=""
              />
            </IconButton>
          </div>
        </ClickAwayListener>

        {/* visibility will be modified based on condition 'isMobileDevice()' */}
        {!isMobileDevice() && (
          <div style={{ display: dropdown_open ? "inherit" : "none" }}>
            {panList.map(
              (pan, index) =>
                pan !== selectedPan && (
                  <div onClick={() => selectPan(pan)} key={index}>
                    {index !== 0 && <div className="hr"></div>}
                    <div className="wr-pan-content">
                      <img
                        id="wr-pan-logo"
                        src={require(`assets/fisdom/ic-added-pans.svg`)}
                        alt=""
                      />
                      <div className="wr-pan-detail">
                        <div className="wr-pan-title">{`PAN ${index+1}`}</div>
                        <div className="wr-pan">{pan}</div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}

        {/* visibility will be modified based on condition 'isMobileDevice()' */}
        {isMobileDevice() && (
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
