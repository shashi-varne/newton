import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import Button from "material-ui/Button";
import { getPathname, storageConstants } from "../constants";
import { initData } from "../services";
import {
  getAvailableFundsForSwitch,
  getFundDetailsForSwitch,
} from "../common/api";
import { navigate as navigateFunc } from "../common/functions";
import DropdownWithoutIcon from "common/ui/SelectWithoutIcon";
import toast from "common/ui/Toast";

const SwitchFund = (props) => {
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.amfi) props.history.goBack();
  const amfi = params.amfi || "";

  const navigate = navigateFunc.bind(props);
  const [funds, setFunds] = useState({});
  const [filteredFunds, setFilteredFunds] = useState({});
  const [fundDetails, setFundDetails] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [selectedType, setSelectedType] = useState("All");

  const filterOptions = [
    {
      name: "All funds",
      value: "All",
    },
    {
      name: "Equity",
      value: "Equity",
    },
    {
      name: "Debt",
      value: "Debt",
    },
    {
      name: "ELSS",
      value: "ELSS",
    },
  ];

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await initData();
    try {
      const result = await getAvailableFundsForSwitch({
        amfi,
      });
      if (!result) {
        setShowSkelton(false);
        return;
      }
      setFunds(result.switch_mfs);
      setFilteredFunds(result.switch_mfs);
      const data = await getFundDetailsForSwitch({
        amfi,
      });
      if (!data) {
        setShowSkelton(false);
        return;
      }
      setFundDetails(data.report);
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setShowSkelton(false);
    }
  };

  const handleFilter = () => (type) => {
    setSelectedType(type);
    if (type === "All") {
      setFilteredFunds([...funds]);
      return;
    }

    let filterFunds = [];
    funds.forEach((fund) => {
      if (fund.mftype_name === type) filterFunds.push({ ...fund });
    });
    setFilteredFunds([...filterFunds]);
  };

  const showFundList = (fund) => {
    let data = { ...fund };
    data.diy_type = "reports";
    storageService().setObject(storageConstants.DIYSTORE_FUNDINFO, data);
    navigate(getPathname.diyFundInfo);
  };

  const switchFund = (fund) => {
    storageService().setObject(storageConstants.REPORTS_SWITCH_FUND_TO, fund);
    navigate(`${getPathname.reportsSwitchNow}${amfi}`);
  };

  return (
    <Container
      headerTitle="Available Funds"
      hideInPageTitle={true}
      noFooter={true}
      skelton={showSkelton}
    >
      <div className="reports-switch">
        {!showSkelton && !isEmpty(fundDetails) && (
          <>
            <header>
              <h4>{fundDetails.mf.friendly_name}</h4>
              <div className="fund-info">
                <div className="content">
                  <div className="text">Total Units</div>
                  <div className="sub-text">{fundDetails.units}</div>
                </div>
                <div className="content">
                  <div className="text">Total Value</div>
                  <div className="sub-text">
                    {formatAmountInr(fundDetails.current_amount)}
                  </div>
                </div>
                <div className="content">
                  <div className="text">Switchable Amount</div>
                  <div className="sub-text">
                    {formatAmountInr(fundDetails.switchable_amount)}
                  </div>
                </div>
              </div>
              <div className="filter-options">
                <span className="text">Switch your fund with</span>
                <img src={require(`assets/switch_arrow_down.svg`)} alt="" />
                <div className="dropdown">
                  <DropdownWithoutIcon
                    options={filterOptions}
                    isAOB={true}
                    value={selectedType || ""}
                    onChange={handleFilter()}
                  />
                </div>
              </div>
            </header>
            {!isEmpty(filteredFunds) && (
              <main>
                {filteredFunds.map((fund, index) => {
                  return (
                    <div key={index} className="fund">
                      <h4>{fund.mfname}</h4>
                      <div className="details">
                        <div className="mf-type">{fund.mftype_name}</div>
                        <div className="flex">
                          <span>{fund.rating}</span>
                          <img alt="" src={require(`assets/single_star.png`)} />
                        </div>
                        <div
                          className="more flex"
                          onClick={() => showFundList(fund)}
                        >
                          <span>More</span>
                          <img
                            alt=""
                            src={require(`assets/know_more_new.png`)}
                          />
                        </div>
                        <Button onClick={() => switchFund(fund)}>
                          Switch Fund
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </main>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default SwitchFund;
