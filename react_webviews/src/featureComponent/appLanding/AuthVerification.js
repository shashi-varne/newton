import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import BottomSheet from "../../designSystem/organisms/BottomSheet";
import Button from "../../designSystem/atoms/Button";

const AuthVerification = ({
  openAuthVerification,
  closeAuthVerification,
  authData,
  handleEdit,
  onClick,
}) => {
  return (
    <BottomSheet
      isOpen={openAuthVerification}
      onClose={closeAuthVerification}
      title={authData.title}
      imageSrc={require(`assets/${authData.icon}`)}
      subtitle={authData.subtitle}
      primaryBtnTitle={authData.primaryButtonTitle}
      secondaryBtnTitle={authData.secondaryButtonTitle}
      onPrimaryClick={onClick}
      dataAid="verification"
    >
      {authData.showAuthExists ? (
        <Typography
          variant="body2"
          color="foundationColors.content.secondary"
          className="flex-between-center"
          dataAid="point1"
        >
          <div variant="body2">
            {authData.authType}: {authData.authValue}{" "}
          </div>
          <div>|</div>
          <div variant="body2"> PAN: {authData.pan} </div>
        </Typography>
      ) : (
        <div className="flex-between-center">
          <Typography variant="body2" dataAid={authData.dataAid}>
            {authData.authValue}{" "}
          </Typography>
          <Button variant="link" onClick={handleEdit} title="Edit" />
        </div>
      )}
    </BottomSheet>
  );
};

export default AuthVerification;
