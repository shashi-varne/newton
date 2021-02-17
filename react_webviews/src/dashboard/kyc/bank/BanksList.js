import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { getMyAccount } from "../common/api";
import { storageService } from "utils/validators";
import { navigate as navigateFunc } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import toast from "common/ui/Toast";
import { initData } from "../services";

const productName = getConfig().productName;
const BanksList = (props) => {
  const [showLoader, setShowLoader] = useState(true);
  const [changeRequest, setChangerequest] = useState({});
  const navigate = navigateFunc.bind(props);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const result = await getMyAccount();
      if (!result) return;
      setBanks(result.bank_mandates.banks || []);
      setChangerequest(result.change_request || {});
      setShowLoader(false);
      await initData();
      storageService().setObject(
        storageConstants.BANK_MANDATES,
        result.bank_mandates.banks
      );
      storageService().setObject(
        storageConstants.CHANGE_REQUEST,
        result.change_requests
      );
    } catch (err) {
      console.log(err);
      toast(err);
    }
  };

  const handleClick = () => {
    navigate(getPathname.addBank);
  };

  const bank_details = (bank_id) => () => {
    navigate(`${getPathname.bankDetails}${bank_id}`);
  };

  const config = getConfig();

  return (
    <Container
      showSkelton={showLoader}
      hideInPageTitle
      id="banks-list"
      buttonTitle="ADD ANOTHER BANK"
      handleClick={handleClick}
      disable={showLoader}
      noFooter={
        changeRequest.add_bank_enabled &&
        ((config.web && !config.isIframe) || config.native)
      }
      buttonClassName="bank-list-footer"
    >
      <div className="banks-list">
        <div className="kyc-main-title">Bank accounts</div>
        {banks.map((bank, index) => {
          return (
            <div
              className="block"
              key={index}
              onClick={bank_details(bank.bank_id)}
            >
              <div className="bank-details">
                <img src={bank.bank_image} className="left-icon" alt="" />
                <div className="content">
                  <div className="bank-name">
                    <div className="name">
                      {bank.bank_name}
                      {bank.bank_status === "rejected" && (
                        <img
                          src={require("assets/alert_icon.svg")}
                          className="alert-icon"
                          alt=""
                        />
                      )}
                    </div>
                    {bank.status === "default" &&
                      bank.bank_status !== "rejected" && (
                        <div className="tag">PRIMARY</div>
                      )}
                  </div>
                  <div className="account">Account: {bank.account_number}</div>
                  <div
                    className={`status  ${
                      bank.bank_status === "rejected" && "failed"
                    } ${bank.bank_status === "verified" && "verified"}`}
                  >
                    {bank.mapped_bank_status}
                  </div>
                </div>
              </div>
              <img
                src={require(`assets/${productName}/icon_color.svg`)}
                alt=""
                className="right-icon"
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default BanksList;
