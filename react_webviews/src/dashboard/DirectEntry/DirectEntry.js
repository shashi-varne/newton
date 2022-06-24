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
  // handleStocksAndIpoCards,
  handleKycStatusRedirection,
} from "../Invest/functions";
import { useDispatch } from "react-redux";
import { updateAppStorage } from "businesslogic/dataStore/reducers/app";

const FEATURE_NAME_MAPPER = {
  tpp: "ipo",
  equity: "stocks",
  taxfiling: "taxFiling",
};

const DirectEntry = (props) => {
  const dispatch = useDispatch();
  const { kyc, user, updateKyc, updateUser } = useUserKycHook();
  const type = useMemo(() => props.match?.params?.type, [props.match?.params]);
  const navigate = navigateFunc.bind(props);
  const [dialogStates, setDialogStates] = useState({
    openKycStatusDialog: false,
  });
  const [modalData, setModalData] = useState({});

  const { baseConfig, kycData, contactDetails } = useMemo(() => {
    const kycData = getKycData(kyc, user);
    const contactDetails = contactVerification(kyc);
    const baseConfig = getConfig();
    return {
      baseConfig,
      kycData,
      contactDetails,
    };
  }, [kyc, user]);

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
      navigate("/");
    }
  };

  const close = () => {
    closeKycStatusDialog(false);
  };

  const onLoad = () => {
    const feature = FEATURE_NAME_MAPPER[type] || type;
    dispatch(
      updateAppStorage({
        feature,
      })
    );
    navigate("/");
  };

  useEffect(() => {
    if (!isEmpty(kyc) && !isEmpty(user)) {
      onLoad();
    }
  }, [kyc, user]);

  return (
    <Container skelton={true} noBackIcon hideInPageTitle>
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

export default DirectEntry;
