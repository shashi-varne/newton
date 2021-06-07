import React, { useEffect, useState } from "react";
import Button from "../../../common/ui/Button";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import { isEmpty } from "../../../utils/validators";
import Container from "../../common/Container";
import useUserKycHook from "../../common/hooks/userKycHook";
import { getKycAppStatus } from "../../services";
import "./commonStyles.scss";

const productName = getConfig().productName;
const STATUS_MAPPER = {
  init: {
    status: "init",
    title: "Open free trading & demat account ",
    subtitle: "Trade & invest like a pro anytime, anywhere",
    buttonTitle: "OPEN ACCOUNT",
    path: "/kyc/account-info",
    icon: "kyc_status_icon.svg",
  },
  incomplete: {
    status: "incomplete",
    title: "Complete your KYC application",
    subtitle: "Don't miss out on good returns by delaying",
    buttonTitle: "COMPLETE NOW",
    path: "/kyc/journey",
    icon: "kyc_status_icon.svg",
  },
  submitted: {
    status: "submitted",
    title: "KYC application submitted",
    subtitle: "Verification in-progress",
    buttonTitle: "CHECK STATUS",
    path: "/kyc/document-verification",
    icon: "pending.svg",
  },
};

const config = getConfig();
const StocksStatus = (props) => {
  const navigate = navigateFunc.bind(props);
  const [data, setData] = useState({});
  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    const kycAppStatusData = getKycAppStatus(kyc);
    const status = kycAppStatusData.status;
    if (kyc.equity_application_status === "submitted") {
      setData(STATUS_MAPPER["submitted"]);
    } else if (status === "ground") {
      setData(STATUS_MAPPER["init"]);
    } else {
      setData(STATUS_MAPPER["incomplete"]);
    }
  }, [kyc]);

  const handleClick = () => {
    if (data.status === "incomplete") {
      if (kyc?.kyc_status === "compliant") {
        navigate(data.path);
      } else {
        navigate(data.path, {
          state: {
            show_aadhaar: !kyc.address.meta_data.is_nri ? true : false,
          },
        });
      }
    } else {
      navigate(data.path);
    }
  };

  const goBack = () => {
    if (config.Web) {
      navigate("/");
    } else {
      nativeCallback({ action: "exit_web" });
    }
  };

  return (
    <Container
      noFooter
      title="Stocks"
      skelton={isLoading}
      data-aid="Stocks-screen"
      headerData={{ goBack }}
    >
      {!isEmpty(data) && (
        <div
          data-aid="stocks-status-card"
          className="stocks-status-card"
          style={{
            backgroundImage: `url(${require(`assets/${productName}/stocks_cip.svg`)})`,
          }}
        >
          <div className="stocks-title" data-aid="stocks-title">
            <h3>{data.title}</h3>
            <img alt="" src={require(`assets/${productName}/${data.icon}`)} />
          </div>
          <p className="stocks-subtitle" data-aid="stocks-subtitle">
            {data.subtitle}
          </p>
          <Button
            buttonTitle={data.buttonTitle}
            classes={{ button: "stocks-button" }}
            onClick={handleClick}
            dataAid={"stocks-action-btn"}
          />
        </div>
      )}
    </Container>
  );
};

export default StocksStatus;
