import React, { useState } from "react";
import Container from "../../common/Container";
import { getConfig } from "utils/functions";
import Close from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import { storageService } from "utils/validators";
import "./style.scss";
import { querySearch } from "../../invest/common/api";

const Search = (props) => {
  const [value, setValue] = useState("");
  const [fundResult, setFundResult] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleChange = (event) => {
    let value = event.target.value || "";
    if (!value) setShowErrorMessage(false);
    else if (value.length > 3) {
      setShowLoader(true);
      setShowErrorMessage(false);
      search(value);
    } else if (value.length < 4) setShowErrorMessage(true);
    setValue(value);
  };

  const search = async (value) => {
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

  const showFundInfo = (data) => {
    let dataCopy = Object.assign({}, data);
    dataCopy.diy_type = "categories";
    storageService().setObject("diystore_fundInfo", dataCopy);
    props.history.push({
      pathname: "/fund-details",
      search: `${getConfig().searchParams}&isins=${data.isin}&type=diy`,
    });
  };

  return (
    <Container noFooter helpContact hideInPageTitle title="Search">
      <div className="diy-search">
        <div className="search-content">
          <div className="search-option">
            <div className="search-input">
              <input
                placeholder="Fund Search..."
                value={value}
                onChange={handleChange}
              />
              {value && value.length !== 0 && (
                <Close className="close-icon" onClick={() => setValue("")} />
              )}
            </div>
            <div
              className="search-button"
              style={{
                cursor: value && value.length > 3 ? "pointer" : "not-allowed",
              }}
            >
              <SearchIcon className="search-icon" />
            </div>
          </div>
          {showErrorMessage && (
            <div className="error-message message">
              Minimum 4 characters required
            </div>
          )}
        </div>
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
              <div className="search-list">
                {fundResult.map((fund, index) => {
                  return (
                    <div
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
            {fundResult.length === 0 && (
              <div className="message">No result found</div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Search;
