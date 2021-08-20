import React from "react";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/Menu/MenuItem";
import "./mini-components.scss";

const FundSummaryMenu = ({
  menuPosition,
  handleMenuClose,
  handleSwitch,
  handleTransactions,
}) => {
  return (
    <Menu
      id="fundwise-summary-menu"
      anchorEl={menuPosition}
      open={Boolean(menuPosition)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      getContentAnchorEl={null}
      className="fundwise-summary-menu"
    >
      <MenuItem onClick={handleSwitch}>
        <div className="menu-item">
          <img src={require(`assets/switch_icon.png`)} alt="" />
          <div>Switch</div>
        </div>
      </MenuItem>
      <MenuItem onClick={handleTransactions}>
        <div className="menu-item">
          <img src={require(`assets/trans_icon.png`)} alt="" />
          <div>Transactions</div>
        </div>
      </MenuItem>
    </Menu>
  );
};

export default FundSummaryMenu;
