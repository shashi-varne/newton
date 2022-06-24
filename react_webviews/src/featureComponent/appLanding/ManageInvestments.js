import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import CategoryCard from "../../designSystem/molecules/CategoryCard";
import PropTypes from "prop-types";
import { LANDING } from "../../strings/webappLanding";
import { Stack } from "@mui/material";

const { manageInvestments: manageInvestmentsData } = LANDING;

const ManageInvestments = ({ manageInvestments = [], onClick }) => {
  return (
    <div className="lmw-manage-investments">
      <Typography
        dataAid={manageInvestmentsData.dataAid}
        variant="heading3"
        className="lmw-mi-title"
        component="div"
      >
        {manageInvestmentsData.title}
      </Typography>
      <Stack flexDirection="row" gap="24px">
        {manageInvestments.map((data, idx) => (
          <CategoryCard
            {...data}
            imgSrc={require(`assets/${data.icon}`)}
            key={idx}
            showSeparator={manageInvestments.length !== idx + 1}
            imgProps={{
              width: "32px",
              height: "32px",
            }}
            onClick={onClick(data)}
          />
        ))}
      </Stack>
    </div>
  );
};

export default ManageInvestments;

ManageInvestments.propTypes = {
  manageInvestments: PropTypes.array,
  onClick: PropTypes.func,
};
