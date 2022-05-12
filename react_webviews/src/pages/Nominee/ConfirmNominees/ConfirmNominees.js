import React from "react";
import Icon from "../../../designSystem/atoms/Icon";
import Button from "../../../designSystem/atoms/Button";
import Separator from "../../../designSystem/atoms/Separator";
import Typography from "../../../designSystem/atoms/Typography";
import CollapsibleSection from "../../../designSystem/molecules/CollapsibleSection";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import ReviewNominee from "../../../featureComponent/Nominee/ReviewNominee";
import HoldingPercentageFull from "../../../featureComponent/Nominee/HoldingPercentageFull";
import {
  CONFIRM_NOMINEES as CONFIRM_NOMINEES_STRINGS,
  BOTTOMSHEETS_CONTENT,
} from "businesslogic/strings/nominee";
import { MAXIMUM_DEMAT_NOMINEES } from "businesslogic/constants/nominee";
import { getAddress } from "businesslogic/utils/nominee/functions";
import { format, parse } from "date-fns";
import "./ConfirmNominees.scss";

const REMOVE_NOMINEE = BOTTOMSHEETS_CONTENT.removeNominee;

const getFomattedDob = (dateStr) => {
  if (!dateStr) {
    return "";
  }

  let date = dateStr;
  try {
    const dt = parse(dateStr, "dd/MM/yyyy", new Date());
    date = format(dt, "dd MMMM yyyy");
  } catch (error) {
    date = dateStr;
  }

  return date;
};

const ConfirmNominees = ({
  addNominee,
  onClick,
  productName,
  sendEvents,
  nominees = [],
  handleEditNominee,
  handleRemoveNominee,
  handleNominees,
  openNomineeTab = [],
  isRemoveSheetOpen,
  closeRemoveSheet,
  openRemoveSheet,
  isButtonLoading,
  onBackClick,
  closeDialogStates,
  openReviewNominee,
  openPercentageHoldingFull,
  hideAddNominee,
}) => {
  return (
    <Container
      headerProps={{
        dataAid: CONFIRM_NOMINEES_STRINGS.headerData.dataAid,
        headerTitle: CONFIRM_NOMINEES_STRINGS.headerData.title,
        subtitle: CONFIRM_NOMINEES_STRINGS.headerData.subtitle,
        onBackClick,
        showCloseIcon: true,
      }}
      footer={{
        button2Props: {
          title: CONFIRM_NOMINEES_STRINGS.buttonTitle2,
          onClick: addNominee,
          variant: "secondary",
        },
        hideButton2:
          nominees.length === MAXIMUM_DEMAT_NOMINEES || !nominees.length,
        button1Props: {
          title: !nominees.length
            ? CONFIRM_NOMINEES_STRINGS.addNominees
            : CONFIRM_NOMINEES_STRINGS.buttonTitle1,
          onClick,
          className: "ncn-footer-button",
          isLoading: isButtonLoading,
        },
        direction: "column",
      }}
      className="nominee-confirm-nominees"
      dataAid={CONFIRM_NOMINEES_STRINGS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      {nominees.length > 0 ? (
        nominees.map((data, index) => {
          return (
            <CollapsibleSection
              label={`${CONFIRM_NOMINEES_STRINGS.nomineeTitle.title} ${
                index + 1
              } ${
                data.isMinor
                  ? CONFIRM_NOMINEES_STRINGS.nomineeTitle.subtext
                  : ""
              }`}
              isOpen={openNomineeTab[index]}
              dataAid={index + 1}
              onClick={handleNominees(index)}
              key={index}
            >
              <div className="flex-between">
                <div>
                  <Typography
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeName.titleDataAid}
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeName.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeName.valueDataAid}
                  >
                    {data.name}
                  </Typography>
                </div>
                <div>
                  <Typography
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeDob.titleDataAid}
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeDob.title}
                  </Typography>
                  <Typography
                    textAlign="right"
                    variant="body2"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeDob.valueDataAid}
                  >
                    {getFomattedDob(data?.dob)}
                  </Typography>
                </div>
              </div>
              <div className="flex-between ncn-cs-content">
                <div>
                  <Typography
                    dataAid={
                      CONFIRM_NOMINEES_STRINGS.nomineeRelationship.titleDataAid
                    }
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeRelationship.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    dataAid={
                      CONFIRM_NOMINEES_STRINGS.nomineeRelationship.valueDataAid
                    }
                  >
                    {data.relationship}
                  </Typography>
                </div>
                <div>
                  <Typography
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeShare.titleDataAid}
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeShare.title}
                  </Typography>
                  <Typography
                    color="foundationColors.primary.brand"
                    textAlign="right"
                    variant="body2"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeShare.valueDataAid}
                  >
                    {data.share}%
                  </Typography>
                </div>
              </div>
              {data.isMinor && (
                <>
                  <Typography variant="body1" className="ncn-cs-content">
                    {CONFIRM_NOMINEES_STRINGS.nomineeGuardianTitle.title}
                  </Typography>
                  <div className="flex-between ncn-cs-content">
                    <div>
                      <Typography
                        dataAid={
                          CONFIRM_NOMINEES_STRINGS.nomineeGuardianName
                            .titleDataAid
                        }
                        variant="body5"
                        color="foundationColors.content.secondary"
                      >
                        {CONFIRM_NOMINEES_STRINGS.nomineeGuardianName.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        dataAid={
                          CONFIRM_NOMINEES_STRINGS.nomineeGuardianName
                            .valueDataAid
                        }
                      >
                        {data.guardianName}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        dataAid={
                          CONFIRM_NOMINEES_STRINGS.nomineeGuardianRelationship
                            .titleDataAid
                        }
                        variant="body5"
                        color="foundationColors.content.secondary"
                      >
                        {
                          CONFIRM_NOMINEES_STRINGS.nomineeGuardianRelationship
                            .title
                        }
                      </Typography>
                      <Typography
                        textAlign="right"
                        variant="body2"
                        dataAid={
                          CONFIRM_NOMINEES_STRINGS.nomineeGuardianRelationship
                            .valueDataAid
                        }
                      >
                        {data.guardianRelationship}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
              <div className="flex-between ncn-cs-content">
                <div>
                  <Typography
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeEmail.titleDataAid}
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeEmail.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineeEmail.valueDataAid}
                  >
                    {data.email}
                  </Typography>
                </div>
                <div>
                  <Typography
                    dataAid={
                      CONFIRM_NOMINEES_STRINGS.nomineeMobileNumber.titleDataAid
                    }
                    variant="body5"
                    color="foundationColors.content.secondary"
                  >
                    {CONFIRM_NOMINEES_STRINGS.nomineeMobileNumber.title}
                  </Typography>
                  <Typography
                    textAlign="right"
                    variant="body2"
                    dataAid={
                      CONFIRM_NOMINEES_STRINGS.nomineeMobileNumber.valueDataAid
                    }
                  >
                    {data.mobile}
                  </Typography>
                </div>
              </div>
              <div className="ncn-cs-content">
                <Typography
                  dataAid={CONFIRM_NOMINEES_STRINGS.nomineeAddress.titleDataAid}
                  variant="body5"
                  color="foundationColors.content.secondary"
                >
                  {CONFIRM_NOMINEES_STRINGS.nomineeAddress.title}
                </Typography>
                <Typography
                  variant="body2"
                  dataAid={CONFIRM_NOMINEES_STRINGS.nomineeAddress.valueDataAid}
                >
                  {getAddress(data)}
                </Typography>
              </div>
              <div className="ncn-cs-content">
                <Typography
                  dataAid={CONFIRM_NOMINEES_STRINGS.nomineePoi.titleDataAid}
                  variant="body5"
                  color="foundationColors.content.secondary"
                >
                  {CONFIRM_NOMINEES_STRINGS.nomineePoi.title}
                </Typography>
                <div className="flex-center">
                  <Icon
                    src={require(`assets/paperclip.svg`)}
                    className="ncn-left-icon"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineePoi.iconDataAid}
                  />
                  <Typography
                    variant="body2"
                    component="span"
                    dataAid={CONFIRM_NOMINEES_STRINGS.nomineePoi.valueDataAid}
                  >
                    {data.poi}
                  </Typography>
                </div>
              </div>
              <div className="flex-justify-center ncn-cs-button-wrapper">
                <Button
                  dataAid={CONFIRM_NOMINEES_STRINGS.editNominee.dataAid}
                  onClick={handleEditNominee(index)}
                  variant="link"
                  title={CONFIRM_NOMINEES_STRINGS.editNominee.title}
                  className="ncn-csbw-content"
                />
                <Button
                  dataAid={CONFIRM_NOMINEES_STRINGS.removeNominee.dataAid}
                  onClick={openRemoveSheet(index)}
                  variant="link"
                  color="foundationColors.secondary.lossRed.400"
                  title={CONFIRM_NOMINEES_STRINGS.removeNominee.title}
                  className="ncn-csbw-content"
                  onHoverStyle={{
                    color: "foundationColors.secondary.lossRed.400",
                  }}
                />
              </div>
              <Separator dataAid={`${index + 1}`} />
            </CollapsibleSection>
          );
        })
      ) : (
        <div className="TextCenter">
          <Icon
            src={require(`assets/${productName}/nominee.svg`)}
            className="ncn-cw-nominees-icon"
            dataAid={CONFIRM_NOMINEES_STRINGS.noNominee.iconDataAid}
          />
          <Typography
            variant="body8"
            dataAid={CONFIRM_NOMINEES_STRINGS.noNominee.dataAid}
            component="div"
          >
            {CONFIRM_NOMINEES_STRINGS.noNominee.title}
          </Typography>
        </div>
      )}
      <BottomSheet
        isOpen={isRemoveSheetOpen}
        onClose={closeRemoveSheet}
        title={REMOVE_NOMINEE.title}
        imageTitleSrc={require(`assets/caution.svg`)}
        subtitle={REMOVE_NOMINEE.subtitle}
        primaryBtnTitle={REMOVE_NOMINEE.cancel}
        secondaryBtnTitle={REMOVE_NOMINEE.title}
        onPrimaryClick={closeRemoveSheet}
        onSecondaryClick={handleRemoveNominee}
        dataAid={REMOVE_NOMINEE.dataAid}
      />
      <ReviewNominee
        isOpen={openReviewNominee}
        onPrimaryClick={closeDialogStates("openReviewNominee")}
        onSecondaryClick={addNominee}
        handleClose={closeDialogStates("openReviewNominee")}
        hideAddNominee={hideAddNominee}
      />
      <HoldingPercentageFull
        isOpen={openPercentageHoldingFull}
        onPrimaryClick={closeDialogStates("openPercentageHoldingFull")}
        handleClose={closeDialogStates("openPercentageHoldingFull")}
      />
    </Container>
  );
};

export default ConfirmNominees;
