import React from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
import { withRouter } from "react-router-dom";
import { isEmpty } from "lodash";
import "./Style.scss";

const product = getConfig().productName;

function AccountAlreadyExistDialog({
  type,
  isOpen,
  onClose,
  data,
  pan,
  history,
}) {
  const navigate = (pathname, data={}) => {
    history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      state: data
    });
  };
  const handleClick = () => {
    navigate("/");
  };

  const editDetails = () => {
    navigate("/verify",{
      page: "landing",
      edit: true
    });
  };

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Account already exists!`}
      image={require(`../../assets/${product}/bottomsheet_account_exist.svg`)}
      button1Props={{
        type: "secondary",
        title: `EDIT ${type === "email" ? "EMAIL" : "NUMBER"}`,
        onClick: editDetails,
      }}
      button2Props={{
        type: "primary",
        title: "CONTINUE",
        onClick: () => {
          console.log("Button2 clicked");
        },
      }}
      classes={{
        container: "account-already-exists-container",
      }}
    >
      <p className="text">
        Your {type === "email" ? "email address" : "mobile number"} is already
        registered with {isEmpty(data) && <span>some other account</span>}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {(type === "email" ? data.mobile : data.email) && (
          <div className="details">
            <img
              src={require(`../../assets/bottom_sheet_icon_${type}.svg`)}
              alt=""
              style={{ paddingRight: "10px" }}
            />
            <span className="text">
              {type === "email" ? data.mobile : data.email}
            </span>
          </div>
        )}
        {(type === "email" ? data.mobile : data.email) && data.pan_number && (
          <div style={{ flexBasis: "20%" }}>
            <p className="text" style={{ textAlign: "center" }}>
              |
            </p>
          </div>
        )}
        {data.pan_number && (
          <div className="details">
            <img
              src={require(`../../assets/bottom_sheet_icon_pan.svg`)}
              alt=""
              style={{ paddingRight: "10px" }}
            />
            <span className="text">{data.pan_number}</span>
          </div>
        )}
      </div>
    </WVBottomSheet>
  );
}

export default withRouter(AccountAlreadyExistDialog);
