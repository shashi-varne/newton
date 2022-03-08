import React, { useState, useCallback } from "react";
import Container from "../../common/Container";
import { getConfig } from "utils/functions";
import Close from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import IframeSearch from './IframeSearch';
import { storageService } from "utils/validators";
import { querySearch } from "../../Invest/common/api";
import debounce from "lodash/debounce";
import {isIframe} from 'utils/functions';
import "./Search.scss";

const Search = (props) => {
  const [value, setValue] = useState("");
  const [fundResult, setFundResult] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showNoFundmessage, setShowNoFundmessage] = useState(false);
  const iframe = isIframe();
  const isMobileDevice = getConfig().isMobileDevice;
  const productName = getConfig().productName;

  const handleChange = (event) => {
    let value = event.target.value || "";
    setValue(value);
    if (!value) setShowErrorMessage(false);
    else if (value.length > 3) {
      setShowLoader(true);
      setShowErrorMessage(false);
      if (!showNoFundmessage) setShowNoFundmessage(true);
      search(value);
    } else if (value.length < 4) {
      setShowErrorMessage(true);
      setShowNoFundmessage(false);
    }
  };

  const searchFunc = async (value) => {
    let data = await querySearch(value);
    setShowLoader(false);
    if (data && data.funds) {
      storageService().setObject("diystore_fundsList", data.funds);
      setFundResult(data.funds);
      return;
    } else {
      setFundResult([]);
    }
  };

  const search = useCallback(
    debounce((value) => {
      searchFunc(value);
    }, 1500),
    []
  );

  const showFundInfo = (data) => {
    let dataCopy = Object.assign({}, data);
    dataCopy.diy_type = "categories";
    storageService().setObject("diystore_fundInfo", dataCopy);
    props.history.push({
      pathname: "/fund-details-v2",
      search: `${getConfig().searchParams}&isins=${data.isin}&type=diy`,
    });
  };

  return (
    <Container
      noFooter
      title={iframe ? isMobileDevice ? 'Where do you want to invest?' : "" : "Search"}
      classOverRideContainer="diy-search-container-main"
      classOverRide="diy-search-container"
      data-aid='diy-search-screen'
    >
        <div className={`diy-search ${isMobileDevice ? "diy-search-mob" : ""}`} data-aid='diy-search'>
      {
        (iframe || (getConfig().code === 'moneycontrol' && !getConfig().Web)) ? < IframeSearch value={value} handleChange={handleChange} />
        :
        <div className="search-content" data-aid='search-content'>
          <div className="search-option">
            <div className="search-input" data-aid='search-input'>
              <input
                placeholder="Fund Search..."
                value={value}
                onChange={handleChange}
                />
              {value && value.length !== 0 && (
                <Close
                className="close-icon"
                  onClick={() => {
                    setValue("");
                    setShowNoFundmessage(false);
                  }}
                />
              )}
            </div>
            <div
              data-aid='search-btn'
              className="search-button"
              style={{
                cursor: value && value.length > 3 ? "pointer" : "not-allowed",
              }}
            >
              <SearchIcon className="search-icon" />
            </div>
          </div>
        </div>
      }
      {showErrorMessage && (
        <div className="error-message message" data-aid='error-message message'>
          Minimum 4 characters required
        </div>
      )}
        {showLoader && (
          <div className="search-loader">
            <CircularProgress
              size={22}
              thickness={4}
              className="progress-bar"
            />
          </div>
        )}
        {!showLoader && fundResult && (
          <>
            {fundResult.length !== 0 && (
              <div className="search-list" data-aid='diy-search-list'>
                {fundResult.map((fund, index) => {
                  return (
                    <div
                      data-aid={`diy-fund-result-${index+1}`}
                      key={index}
                      className="text"
                      onClick={() => showFundInfo(fund)}
                    >
                      {fund.legal_name}
                    </div>
                  );
                })}
              </div>
            )}
            {fundResult.length === 0 && showNoFundmessage && (
              <div className="message" data-aid='diy-message'>No result found</div>
            )}
          </>
        )}
        {
          !fundResult && iframe && !isMobileDevice && !showLoader &&(
            <div className="diy-iframe-search-content">
              <img src={require(`assets/${productName}/diy_search_iframe.svg`)} alt='search' />
            </div>
          )
        }
      </div>
    </Container>
  );
};

export default Search;
