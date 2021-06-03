import React, { useEffect, useState } from "react";
import Button from "../../../common/ui/Button";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import { navigate as navigateFunc } from "../../common/functions";
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
  },
  incomplete: {
    status: "incomplete",
    title: "Complete your KYC application",
    subtitle: "Don't miss out on good returns by delaying",
    buttonTitle: "COMPLETE NOW",
    path: "/kyc/journey",
  },
};

const StocksStatus = (props) => {
  const navigate = navigateFunc.bind(props);
  const [data, setData] = useState({});
  const { kyc, isLoading } = useUserKycHook();

  useEffect(() => {
    const kycAppStatusData = getKycAppStatus(kyc);
    const status = kycAppStatusData.status;
    if (status === "ground") {
      setData(STATUS_MAPPER["init"]);
    } else {
      setData(STATUS_MAPPER["incomplete"]);
    }
  }, [kyc]);

  const handleClick = () => {
    if (data.status === "incomplete") {
      if (kyc?.kyc_status === "compliant") {
        navigate(data.path)
      } else {
        navigate(data.path, {
          state: {
            show_aadhaar: !kyc.address.meta_data.is_nri ? true : false,
          }
        });
      }
    } else {
      navigate(data.path);
    }
  };

  return (
    <Container noFooter title="Stocks" skelton={isLoading} data-aid='Stocks-screen'>
      <div
        data-aid='stocks-status-card'
        className="stocks-status-card"
        style={{
          backgroundImage: `url(${require(`assets/${productName}/stocks_cip.svg`)})`,
        }}
      >
        <div className="stocks-title" data-aid='stocks-title'>
          <h3>{data.title}</h3>
          <img
            alt=""
            src={require(`assets/${productName}/kyc_status_icon.svg`)}
          />
        </div>
        <p className="stocks-subtitle" data-aid='stocks-subtitle'>{data.subtitle}</p>
        <Button
          buttonTitle={data.buttonTitle}
          classes={{ button: "stocks-button" }}
          onClick={handleClick}
          dataAid={'stocks-action-btn'}
        />
      </div>
    </Container>
  );
};

export default StocksStatus;
