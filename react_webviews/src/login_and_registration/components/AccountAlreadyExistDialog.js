import React, { useEffect, useMemo, useState } from "react";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "utils/functions";
import { isEmpty } from "lodash";
import "./commonStyles.scss";
import { requireAsset } from "../../utils/functions";

export function AccountAlreadyExistDialog({
  data = {},
  isOpen,
  onClose,
  type,
  ...props
}) {
  const { productName: product } = useMemo(() => getConfig(), []);
  const { mobile, email, pan_number } = useMemo(() => isEmpty(data) ? {} : data, [data]);
  const secondaryDetail = useMemo(() => type === 'email' ? mobile : email, [type, mobile, email]);
  const [subtitleText, setSubtitleText] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondaryDetailExists, setSecondaryDetailExists] = useState(!isEmpty(secondaryDetail));

  useEffect(() => {
    const detailExists = !isEmpty(secondaryDetail);
    setSecondaryDetailExists(detailExists);

    if (detailExists) {
      setSubtitleText(`
        Your ${type === "email" ? "email address" : "mobile number"} 
        is already registered with some other account
      `);
    } else {
      setSubtitleText('Your account is already registered with us');
    }
  }, [secondaryDetail]);

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Account already exists!"
      image={requireAsset('bottomsheet_account_exist', product)}
      button1Props={{
        color: "secondary",
        variant: "outlined",
        title: `EDIT ${type === "email" ? "EMAIL" : "NUMBER"}`,
        onClick: props.editDetails,
      }}
      button2Props={{
        color: "secondary",
        variant: "contained",
        title: "CONTINUE",
        showLoader: loading,
        onClick: () => {
          props.next(type, data)
          setLoading(true);
        }
      }}
      classes={{
        container: "account-already-exists-container",
      }}
    >
      <p className="text">
        {subtitleText}
      </p>
      {(secondaryDetailExists || pan_number) &&
        <div
          style={{
            display: "flex",
          }}
        >
          <div className="details">
            {type &&
              <img
                src={requireAsset(`bottom_sheet_icon_${type === 'email' ? 'mobile' : 'email'}`)}
                alt=""
                style={{ paddingRight: "10px" }}
              />
            }
            <span className="text">
              {secondaryDetailExists ? secondaryDetail : 'Not found'}
            </span>
          </div>
          {pan_number && (
            <>
              <div style={{ flexBasis: "20%" }}>
                <p className="text" style={{ textAlign: "center" }}>
                  |
                </p>
              </div>
              <div className="details">
                <img
                  src={require(`../../assets/bottom_sheet_icon_pan.svg`)}
                  alt=""
                  style={{ paddingRight: "10px" }}
                />
                <span className="text">{pan_number}</span>
              </div>
            </>
          )}
        </div>
      }
    </WVBottomSheet>
  );
}

export default AccountAlreadyExistDialog;
