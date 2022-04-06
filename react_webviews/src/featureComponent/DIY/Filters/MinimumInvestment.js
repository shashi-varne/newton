import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";
import RadioButton from "../../../designSystem/atoms/RadioButton";
import Typography from "../../../designSystem/atoms/Typography";
import { MINIMUM_INVESTMENT_OPTIONS } from "businesslogic/constants/diy";

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
    <div className="fund-options-wrapper" data-aid="grp_minInvestment" >
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
                  control={<RadioButton isChecked={selectedValue} dataAid={idx+1} />}
                  label={
                    <Typography
                      color={selectedColor}
                      sx={{ ml: 2 }}
                      variant="body2"
                      dataAid={`list${idx+1}`}
                    >
                      {option.label}
                    </Typography>
                  }
                  data-aid={`grp_${idx+1}`}
                />
              );
            })}
          </Stack>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default MinimumInvestment;
