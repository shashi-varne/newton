import { getDiyStorage } from 'businesslogic/dataStore/reducers/diy';
import { triggerInvestment } from 'businesslogic/dataStore/reducers/mfOrders';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useErrorState from '../../common/customHooks/useErrorState';
import useLoadingState from '../../common/customHooks/useLoadingState';
import ToastMessage from '../../designSystem/atoms/ToastMessage';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import Api from 'utils/api';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import { DIY_PATHNAME_MAPPER } from '../../pages/DIY/common/constants';
import { handlePaymentRedirection } from '../../pages/DIY/common/functions';
import InvestmentProcess from '../../pages/DIY/InvestmentProcess';

const screen = 'investProcess';
const investmentProcessContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const { productName } = useMemo(getConfig, []);
  const { kyc, isLoading } = useUserKycHook();
  const { isButtonLoading } = useLoadingState(screen);
  const [showLoader, setShowLoader] = useState(false);
  const { isUpdateFailed, errorMessage } = useErrorState(screen);
  const diyStorage = useSelector(getDiyStorage);

  useEffect(() => {
    if (isUpdateFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isUpdateFailed]);

  const onClick = () => {
    const investment = diyStorage.investment;
    if (isEmpty(investment)) {
      navigate(DIY_PATHNAME_MAPPER.diyInvestLanding);
      return;
    }
    const body = {
      investment,
    };
    const sagaCallback = handlePaymentRedirection({
      navigate,
      kyc,
      handleApiRunning: setShowLoader,
    });
    const payload = {
      screen,
      Api,
      body,
      sagaCallback,
    };
    dispatch(triggerInvestment(payload));
  };
  return (
    <WrappedComponent
      onClick={onClick}
      isButtonLoading={isButtonLoading}
      showLoader={showLoader}
      isLoading={isLoading}
      productName={productName}
    />
  );
};

export default investmentProcessContainer(InvestmentProcess);
