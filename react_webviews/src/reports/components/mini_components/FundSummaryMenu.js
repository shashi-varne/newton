import React from "react";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/Menu/MenuItem";

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
      <MenuItem>
        <div className="menu-item" onClick={() => handleSwitch()}>
          <img src={require(`assets/switch_icon.png`)} alt="" />
          <div>Switch</div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="menu-item" onClick={() => handleTransactions()}>
          <img src={require(`assets/trans_icon.png`)} alt="" />
          <div>Transactions</div>
        </div>
      </MenuItem>
    </Menu>
  );
};

export default FundSummaryMenu;
