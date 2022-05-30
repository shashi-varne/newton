import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import BottomSheet from "../../designSystem/organisms/BottomSheet";

const PremiumOnboarding = ({ isOpen, onClose, data, onClick }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={data.title}
      imageSrc={require(`assets/${data.icon}`)}
      subtitle={data.subtitle}
      primaryBtnTitle={data.primaryButtonTitle}
      secondaryBtnTitle={data.secondaryButtonTitle}
      onPrimaryClick={onClick}
      onSecondaryClick={onClose}
      dataAid="premium"
    >
      {data.instant && (
        <Typography
          variant="body2"
          color="foundationColors.content.secondary"
          className="flex-between-center"
          dataAid="point1"
        >
          <div variant="body2">Instant investment</div>
          <div>|</div>
          <div variant="body2">No document asked</div>
        </Typography>
      )}
    </BottomSheet>
  );
};

export default PremiumOnboarding;
