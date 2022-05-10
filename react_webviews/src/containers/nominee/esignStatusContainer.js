import React, { useEffect } from "react";
import Success from "../../pages/Nominee/Success";
import { navigate as navigateFunc } from "../../utils/functions";
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
        searchParams: `${config.searchParams}&status=failed`,
      });
    }
  }, []);

  const onBackClick = () => {
    navigate(NOMINEE_PATHNAME_MAPPER.landing);
  };

  return <WrappedComponent isPageLoading={true} onBackClick={onBackClick} />;
};

export default esignStatusContainer(Success);
