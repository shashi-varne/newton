import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import BottomSheet from "../../designSystem/organisms/BottomSheet";
import Button from "../../designSystem/atoms/Button";
import { isEmpty } from "lodash-es";
import PropTypes from "prop-types";

const AuthVerification = ({
  isOpen,
  onClose,
  authData,
  handleEdit,
  onClick,
  showLoader,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={authData.title}
      imageSrc={require(`assets/${authData.icon}`)}
      subtitle={authData.subtitle}
      primaryBtnTitle={authData.primaryButtonTitle}
      primaryBtnProps={{
        isLoading: showLoader,
      }}
      onPrimaryClick={onClick}
      dataAid="verification"
    >
      {authData.showAuthExists ? (
        <Typography
          variant="body2"
          color="foundationColors.content.secondary"
          className="flex-between-center"
          dataAid="point1"
          component="div"
        >
          <div variant="body2">
            {authData.authType}: {authData.authValue || "Not Found"}{" "}
          </div>
          {!isEmpty(authData.pan) && (
            <>
              <div>|</div>
              <div variant="body2"> PAN: {authData.pan} </div>
            </>
          )}
        </Typography>
      ) : (
        <div className="flex-between-center">
          <Typography variant="body2" dataAid={authData.dataAid}>
            {authData.countryCode}
            {authData.contactValue}
          </Typography>
          <Button variant="link" onClick={handleEdit} title="Edit" />
        </div>
      )}
    </BottomSheet>
  );
};

export default AuthVerification;

AuthVerification.propTypes = {
  authData: PropTypes.object,
  handleEdit: PropTypes.func,
};
