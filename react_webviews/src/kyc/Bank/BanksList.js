import React, { useEffect, useState } from "react";
import Container from "../common/Container";
import { getConfig } from "../../utils/functions";
import { getMyAccount } from "../common/api";
import { storageService } from "utils/validators";
import { navigate as navigateFunc } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import toast from "../../common/ui/Toast";
import { initData } from "../services";
import "./BanksList.scss";

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
      toast(err.message);
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
      skelton={showLoader}
      buttonTitle="ADD ANOTHER BANK"
      handleClick={handleClick}
      noFooter={
        changeRequest.add_bank_enabled &&
        ((config.web && !config.isIframe) || config.native)
      }
      title="Bank accounts"
      type="outlined"
    >
      <div className="banks-list">
        {banks.map((bank, index) => {
          return (
            <div
              className="block"
              key={index}
              onClick={bank_details(bank.bank_id)}
              id={`bank_${index+1}`}
            >
              <div className="bank-details">
                <img src={bank.bank_image} className="left-icon" alt="" />
                <div className="content">
                  <div className="bank-name">
                    <div className="name" id='bank_name'>
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
                        <div className="tag" id='tag'>PRIMARY</div>
                      )}
                  </div>
                  <div className="account" id='account_number'>Account: {bank.account_number}</div>
                  <div
                    className={`status  ${
                      bank.bank_status === "rejected" && "failed"
                    } ${bank.bank_status === "verified" && "verified"}`}
                    id={`mapped_bank_status_${index+1}`}
                  >
                    {bank.mapped_bank_status}
                  </div>
                </div>
              </div>
              <img
                src={require(`assets/${productName}/right_icon.svg`)}
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
