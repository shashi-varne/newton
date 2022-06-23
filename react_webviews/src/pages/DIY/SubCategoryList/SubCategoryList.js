import { VIEW_TYPE_MAPPER } from "businesslogic/constants/diy";
import isArray from "lodash/isArray";
import PropTypes from "prop-types";
import React from "react";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import CardVertical from "../../../designSystem/molecules/CardVertical";
import CategoryCard from "../../../designSystem/molecules/CategoryCard";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { validateKycAndRedirect } from "../common/functions";
import "./SubCategoryList.scss";

const SubCategoryList = (props) => {
  const {
    subcategoryData,
    cartCount,
    navigate,
    kyc,
    hideFooter,
    isLoading,
    handleCardClick,
  } = props;

  return (
    <Container
      headerProps={{
        headerTitle: subcategoryData.name,
        dataAid: subcategoryData?.design_id,
      }}
      className="diy-sub-category-cv-wrapper"
      footer={{
        confirmActionProps: {
          buttonTitle: "View Cart",
          title: `${cartCount} item saved in your cart`,
          badgeContent: cartCount,
          onButtonClick: validateKycAndRedirect({ navigate, kyc }),
          imgSrc: require("assets/cart_icon.svg"),
          dataAid: "viewCart",
        },
      }}
      fixedFooter
      noFooter={hideFooter}
      isPageLoading={isLoading}
      dataAid={subcategoryData?.design_id}
    >
      <div className="diy-sc-cv-lists">
        {isArray(subcategoryData.options) &&
          subcategoryData.options?.map((data, idx) => {
            return (
              <SubcategoryOptionCard
                key={idx}
                onClick={handleCardClick(data.key, data.name)}
                data={data}
                viewType={subcategoryData.viewType}
              />
            );
          })}
      </div>
    </Container>
  );
};

const SubcategoryOptionCard = ({ viewType, data, onClick }) => {
  return (
    <>
      {viewType === VIEW_TYPE_MAPPER.imageCaurosel ? (
        <div className="diy-sc-cv-item" onClick={onClick}>
          <CategoryCard
            variant="variant88"
            imgSrc={data?.image_url}
            title={data?.name}
            dataAid={data?.design_id}
          />
        </div>
      ) : (
        <WrapperBox elevation={1} className="diy-sc-cv-item" onClick={onClick}>
          <CardVertical
            imgSrc={data?.image_url}
            title={data?.name}
            subtitle={data?.trivia}
            dataAid={data?.design_id}
          />
        </WrapperBox>
      )}
    </>
  );
};

export default SubCategoryList;

SubCategoryList.defaultProps = {
  cartCount: 0,
};

SubCategoryList.propTypes = {
  headerTitle: PropTypes.string,
  categoryList: PropTypes.arrayOf(PropTypes.object),
  cartCount: PropTypes.number,
  onCartClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
