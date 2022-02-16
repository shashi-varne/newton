import React, { useEffect, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import noop from "lodash/noop";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
import Container from "../../common/Container";
import KycStatusDialog from "../../../dashboard/Invest/mini-components/KycStatusDialog";
import {
  contactVerification,
  getKycData,
  handleKycStatus,
  handleStocksAndIpoCards,
  handleKycStatusRedirection,
} from "../../../dashboard/Invest/functions";

const HandleDirectEntry = (props) => {
  const { kyc, user, updateKyc, updateUser } = useUserKycHook();
  const [baseConfig, setBaseConfig] = useState(getConfig());
  const type = useMemo(() => props.match?.params?.type, [props.match?.params]);
  const navigate = navigateFunc.bind(props);
  const [dialogStates, setDialogStates] = useState({
    openKycStatusDialog: false,
  });

  const [modalData, setModalData] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [kycData, setKycData] = useState(getKycData(kyc, user));

  const handleDialogStates = (dialogStatus, dialogData) => {
    setDialogStates({ ...dialogStates, ...dialogStatus });
    if (!isEmpty(dialogData)) {
      setModalData(dialogData);
    }
  };

  const handleSummaryData = (data) => {
    updateKyc(data.kyc);
    updateUser(data.user);
  };

  const closeKycStatusDialog = () => {
    handleDialogStates({
      openKycStatusDialog: false,
    });
    navigate("/invest");
  };

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      switch (type) {
        case "tpp":
          navigate("/product-types");
          break;
        case "equity":
          const kycDetails = getKycData(kyc, user);
          const contactData = contactVerification(kyc);
          const config = getConfig();
          setBaseConfig(config);
          setKycData(kycDetails);
          setContactDetails(contactData);
          handleStocksAndIpoCards(
            {
              ...kycDetails,
              key: "stocks",
              kyc,
              user,
              navigate,
              handleLoader: noop,
              handleDialogStates,
              handleSummaryData,
              closeKycStatusDialog,
            },
            props
          );
          break;
        default:
          navigate("/invest");
          break;
      }
    }
  }, [kyc, user]);

  return (
    <Container skelton={true} noBackIcon>
      {!isEmpty(modalData) && (
        <KycStatusDialog
          isOpen={dialogStates.openKycStatusDialog}
          data={modalData}
          close={closeKycStatusDialog}
          handleClick={handleKycStatus({
            kyc,
            kycData,
            modalData,
            navigate,
            updateKyc,
            closeKycStatusDialog,
            handleLoader: noop,
          })}
          handleClick2={handleKycStatusRedirection(
            {
              kyc,
              user,
              kycData,
              modalData,
              navigate,
              baseConfig,
              contactDetails,
              closeKycStatusDialog,
              handleLoader: noop,
              handleSummaryData,
              handleDialogStates,
            },
            props
          )}
          cancel={closeKycStatusDialog}
        />
      )}
    </Container>
  );
};

export default HandleDirectEntry;
