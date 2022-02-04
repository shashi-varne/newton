import React from "react";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import RadioOptions from "../../../common/ui/RadioOptions";
import "../commonStyles.scss";

const BankListOptions = ({
  isOpen,
  handleClick,
  selectedValue,
  handleChange,
  options,
  error,
  showLoader
}) => {
  return (
    <WVBottomSheet
      isOpen={isOpen}
      button1Props={{
        title: "PROCEED",
        onClick: handleClick,
        type: "primary",
        showLoader: showLoader
      }}
    >
      <RadioOptions
        label="Please select primary bank"
        value={selectedValue || ""}
        options={options}
        onChange={handleChange}
        icon_type="blue_icon"
        helperText={error}
      />
    </WVBottomSheet>
  );
};

export default BankListOptions;
