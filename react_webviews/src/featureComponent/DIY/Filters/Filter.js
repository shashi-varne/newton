import React, { useState, useEffect } from "react";
import Typography from "../../../designSystem/atoms/Typography";
import Box from "@mui/material/Box";
import { Drawer, Stack } from "@mui/material";

import "./FilterReturnBottomSheet.scss";

import Button from "../../../designSystem/atoms/Button";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FundOptions from "./FundOptions";
import FundHouses from "./FundHouses";
import MinimumInvestment from "./MinimumInvestment";
import {
  FILTER_TAB_OPTIONS,
  DEFAULT_FILTER_DATA,
} from "businesslogic/constants/diy";
import { NavigationHeader } from "../../../designSystem/molecules/NavigationHeader";

const DEFAULT_FUND_OPTION = DEFAULT_FILTER_DATA.fundOption;

const Filter = ({
  isOpen,
  handleFilterClose,
  setSelectedFundHouses,
  selectedFundHouses = [],
  selectedFundOption,
  setSelectedFundOption,
  setSelectedMinInvestment,
  selectedMinInvestment,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeFundHouses, setActiveFundHouses] = useState([]);
  const [fundOption, setFundOption] = useState(DEFAULT_FUND_OPTION);
  const [minimumInvestment, setMinimumInvestment] = useState({});

  const handleSelection = (index) => () => {
    if (index !== selectedTab) {
      setSelectedTab(index);
    }
  };

  const onSelect = () => {
    setSelectedFundOption(fundOption);
    setSelectedFundHouses(activeFundHouses);
    setSelectedMinInvestment(minimumInvestment);
    handleFilterClose();
  };

  const handleClearAll = () => {
    setSelectedTab(0);
    setActiveFundHouses([]);
    setSelectedFundHouses([]);
    setFundOption(DEFAULT_FUND_OPTION);
    setSelectedFundOption(DEFAULT_FUND_OPTION);
    setMinimumInvestment({});
    setSelectedMinInvestment({});
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedTab(0);
      setActiveFundHouses(selectedFundHouses);
      setFundOption(selectedFundOption);
      setMinimumInvestment(selectedMinInvestment);
    }
  }, [isOpen]);

  return (
    <Box className="diy-filter-wrapper">
      <Drawer
        transitionDuration={250}
        PaperProps={{ elevation: 1 }}
        disablePortal
        variant="temporary"
        open={isOpen}
        anchor="bottom"
        onClose={handleFilterClose}
        disableScrollLock={false}
      >
        <NavigationHeader
          showCloseIcon
          hideMenuBar
          headerTitle="Filters"
          hideInPageTitle
          actionTextProps={{ title: "Clear all", onClick: handleClearAll, dataAid: "link" }}
          onBackClick={handleFilterClose}
        />
        <Stack
          sx={{ height: "100vh" }}
          justifyContent="space-between"
          direction="column"
        >
          <Stack direction="row" flexBasis="90%">
            <LeftPanel
              selectedTab={selectedTab}
              handleSelection={handleSelection}
            />
            <RightPanel
              selectedTab={selectedTab}
              setActiveFundHouses={setActiveFundHouses}
              activeFundHouses={activeFundHouses}
              fundOption={fundOption}
              setFundOption={setFundOption}
              minimumInvestment={minimumInvestment}
              setMinimumInvestment={setMinimumInvestment}
            />
          </Stack>
          <div className="diy-filter-footer-btn-wrapper">
            <Button title="Apply" onClick={onSelect} />
          </div>
        </Stack>
      </Drawer>
    </Box>
  );
};

const LeftPanel = ({ selectedTab, handleSelection }) => {
  return (
    <Stack
      direction="column"
      flexBasis="30%"
      sx={{
        backgroundColor: "foundationColors.supporting.grey",
        cursor: "pointer",
      }}
    >
      {FILTER_TAB_OPTIONS?.map((el, idx) => {
        const selectedValue = selectedTab === idx;
        const { selectedColor, selectedBackgroundColor } = selectedValue
          ? {
              selectedColor: "foundationColors.content.primary",
              selectedBackgroundColor: "foundationColors.supporting.white",
            }
          : {
              selectedColor: "foundationColors.content.tertiary",
              selectedBackgroundColor: "transparent",
            };
        return (
          <Typography
            variant="body1"
            key={idx}
            color={selectedColor}
            sx={{ p: "16px 24px" }}
            onClick={handleSelection(idx)}
            backgroundColor={selectedBackgroundColor}
            dataAid={el?.testIdSuffix}
          >
            {el.label}
          </Typography>
        );
      })}
    </Stack>
  );
};

const RightPanel = ({
  selectedTab,
  activeFundHouses,
  setActiveFundHouses,
  setFundOption,
  fundOption,
  minimumInvestment,
  setMinimumInvestment,
}) => {
  return (
    <TransitionGroup className="right-panel-wrapper">
      <Stack flexBasis="70%">
        {selectedTab === 0 && (
          <CSSTransition
            in={selectedTab === 0}
            timeout={225}
            classNames="right-panel-transition"
          >
            <FundHouses
              activeFundHouses={activeFundHouses}
              setActiveFundHouses={setActiveFundHouses}
            />
          </CSSTransition>
        )}
        {selectedTab === 1 && (
          <CSSTransition
            in={selectedTab === 1}
            timeout={225}
            classNames="right-panel-transition"
          >
            <FundOptions
              fundOption={fundOption}
              setFundOption={setFundOption}
            />
          </CSSTransition>
        )}
        {selectedTab === 2 && (
          <CSSTransition
            in={selectedTab === 2}
            timeout={225}
            classNames="right-panel-transition"
          >
            <MinimumInvestment
              minimumInvestment={minimumInvestment}
              setMinimumInvestment={setMinimumInvestment}
            />
          </CSSTransition>
        )}
      </Stack>
    </TransitionGroup>
  );
};

export default Filter;
