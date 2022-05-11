import React, { useEffect } from "react";
import EsignStatus from "../../pages/Nominee/EsignStatus";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_PATHNAME_MAPPER } from "../../pages/Nominee/common/constants";
import { getUrlParams } from "../../utils/validators";

const esignStatusContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    const { status } = getUrlParams();
    if (status === "success") {
      navigate(NOMINEE_PATHNAME_MAPPER.nomineeVerified);
    } else {
      navigate(`${NOMINEE_PATHNAME_MAPPER.esignLanding}`, {
        searchParams: `${getConfig().searchParams}&status=failed`,
      });
    }
  }, []);

  const onBackClick = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.landing);
  };

  return <WrappedComponent onBackClick={onBackClick} />;
};

export default esignStatusContainer(EsignStatus);
