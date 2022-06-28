import React, { useEffect } from "react";
import EsignStatusRedirection from "../../pages/Nominee/EsignStatusRedirection";
import { navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import { getUrlParams } from "../../utils/validators";
import { useDispatch } from "react-redux";
import { updateNomineeStorage } from "businesslogic/dataStore/reducers/nominee";

const esignStatusRedirectionContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();

  useEffect(() => {
    const { status } = getUrlParams();
    if (status === "success") {
      navigate(NOMINEE_PATHNAME_MAPPER.nomineeVerified);
    } else {
      dispatch(updateNomineeStorage({ showEsignFailure: true }));
      navigate(NOMINEE_PATHNAME_MAPPER.esignLanding);
    }
  }, []);

  const onBackClick = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.landing);
  };

  return <WrappedComponent onBackClick={onBackClick} />;
};

export default esignStatusRedirectionContainer(EsignStatusRedirection);
