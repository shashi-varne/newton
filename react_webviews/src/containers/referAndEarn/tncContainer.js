import React, { useEffect } from "react";
// import { navigate as navigateFunc } from "../../utils/functions";
import TermsAndCondtions from "../../pages/ReferAndEarn/TermsAndCondtions";
import {
  getTnc,
  getTncData,
} from "businesslogic/dataStore/reducers/referAndEarn";
import Api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";

const screen = "REFER_AND_EARN_TNC";

const tncContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const tncPoints = useSelector(getTncData);

  const initialize = () => {
    if (tncPoints.length === 0) {
      dispatch(
        getTnc({
          Api: Api,
          screen: screen,
        })
      );
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return <WrappedComponent points={tncPoints} />;
};

export default tncContainer(TermsAndCondtions);
