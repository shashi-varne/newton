import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";
import RadioButton from "../../../designSystem/atoms/RadioButton";
import Typography from "../../../designSystem/atoms/Typography";
import { formatAmountInr } from "../../../utils/validators";

import "./FundOptions.scss";

const MinimumInvestment = ({
  minimumInvestment = {},
  setMinimumInvestment,
}) => {
  const handleChange = (event) => {
    const id = event.target.value;
    const value = MINIMUM_INVESTMENT_OPTIONS.find((data) => data.id === id);
    setMinimumInvestment(value);
  };
  return (
    <div className="fund-options-wrapper">
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={minimumInvestment}
          onChange={handleChange}
        >
          <Stack direction="column" spacing={2}>
            {MINIMUM_INVESTMENT_OPTIONS?.map((option, idx) => {
              const selectedValue = option.id === minimumInvestment.id;
              const selectedColor = selectedValue
                ? "foundationColors.primary.content"
                : "foundationColors.content.secondary";
              return (
                <FormControlLabel
                  key={idx}
                  value={option.id}
                  control={<RadioButton isChecked={selectedValue} />}
                  label={
                    <Typography
                      color={selectedColor}
                      sx={{ ml: 2 }}
                      variant="body2"
                    >
                      {option.label}
                    </Typography>
                  }
                />
              );
            })}
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

const MINIMUM_INVESTMENT_OPTIONS = [
  {
    label: `Below ${formatAmountInr(500)}`,
    id: "<500",
    value: {
      lowerLimit: 0,
      upperLimit: 500,
    },
  },
  {
    label: `${formatAmountInr(500)} - ${formatAmountInr(1000)}`,
    id: "500-1000",
    value: {
      lowerLimit: 500,
      upperLimit: 1000,
    },
  },
  {
    label: `Above ${formatAmountInr(1000)}`,
    id: ">1000",
    value: {
      lowerLimit: 1000,
    },
  },
];

export default MinimumInvestment;
