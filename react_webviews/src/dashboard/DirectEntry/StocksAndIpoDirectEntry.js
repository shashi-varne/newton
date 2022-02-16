import React, { useEffect, useMemo, useState } from "react";
import noop from "lodash/noop";
import isEmpty from "lodash/isEmpty";
import Container from "../common/Container";
import KycStatusDialog from "../Invest/mini-components/KycStatusDialog";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import {
  contactVerification,
  getKycData,
  handleKycStatus,
  handleStocksAndIpoCards,
  handleKycStatusRedirection,
} from "../Invest/functions";

const StocksAndIpoDirectEntry = (props) => {
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

  const closeKycStatusDialog = (skipNavigation = false) => {
    handleDialogStates({
      openKycStatusDialog: false,
    });
    if (!skipNavigation) {
      navigate("/invest");
    }
  };

  const close = () => {
    closeKycStatusDialog(false);
  }

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
              isDirectEntry: true,
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
    <Container skelton={true} noBackIcon hideInPageTitle >
      {!isEmpty(modalData) && (
        <KycStatusDialog
          isOpen={dialogStates.openKycStatusDialog}
          data={modalData}
          close={close}
          handleClick={handleKycStatus({
            kyc,
            kycData,
            modalData,
            isDirectEntry: true,
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
              isDirectEntry: true,
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
        />
      )}
    </Container>
  );
};

export default StocksAndIpoDirectEntry;
