import React from "react";
import Container from "../common/Container";
import { Imgc } from "../../common/ui/Imgc";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import MarketProductCard from "../mini-components/MarketProductCard";
import WVGenericContentCarousel from "../../common/ui/GenericContentCarousel/WVGenericContentCarousel";
import ContactUs from "../../common/components/contact_us";
import "./PrimaryMarketProducts.scss";

const CARTEGORY_LISTS = [
  {
    key: "ipo",
    name: "IPO",
    info: "Initial public offer",
    icon: "ipo.svg",
    subText: "NEW",
  },
  {
    key: "ncd",
    name: "NCDs",
    info: "Non convertible debentures",
    icon: "ncd.svg",
  },
  {
    key: "sgb",
    name: "SGB",
    info: "Sovereign gold bonds",
    icon: "sgb.svg",
  },
  {
    key: "allCategories",
    name: "All categories",
    info: "View more products",
    icon: "more.svg",
    nextState: "/product-types",
  },
];

export const KEY_INSIGHTS_CAROUSEL = [
  {
    title: "Zero paperwork",
    content: "Hassle-free online submission of your bids/application",
  },
  {
    title: "Safety assured",
    content: "Get updates on your orders with each step",
  },
  {
    title: "Performance",
    content:
      "Nifty has <b>outperformed 90%</b> of the large-cap funds over a 5-year cycle",
  },
  {
    title: "Order tracking",
    content: "Get updates on your orders with each step",
  },
];

const PrimaryMarketProducts = (props) => {
  const navigate = navigateFunc.bind(props);
  const productName = getConfig().productName;
  const handleOnClick = (el = {}) => () => {
    if (el.nextState) {
      navigate(el.nextState);
    }
  };

  return (
    <Container
      data-aid="market-products-screen"
      noFooter={true}
      title="IPO, Gold Bonds and more"
    >
      <div className="primary-market-products">
        <div
          style={{
            backgroundImage: `url(${require(`assets/${productName}/icn_crousal_card1.svg`)})`,
          }}
          className="pmp-info-card"
        >
          <div className="flex-between-center">
            <div className="title">
              <div>Primary market products</div>
              <div className="veritical-line"></div>
            </div>
            <Imgc
              src={require(`assets/${productName}/icon_bull.svg`)}
              alt="icon"
              className="pmp-info-icon"
            />
          </div>
          <div className="subtitle">
            One-stop to buy securities directly from the issuer
          </div>
        </div>
        <div className="pmp-catergories-title">Freshly open</div>
        {CARTEGORY_LISTS?.map((el, idx) => (
          <MarketProductCard
            key={idx}
            onClick={handleOnClick(el)}
            {...el}
            icon={require(`assets/${productName}/${el.icon}`)}
          />
        ))}
        <div className="pmp-catergories-title">Why invest with us</div>
        <WVGenericContentCarousel
          customData={KEY_INSIGHTS_CAROUSEL}
          carouselPageStyle={{
            backgroundImage: `url(${require(`assets/${productName}/icn_crousal_card1.svg`)})`,
          }}
        />
        <div className="pmp-catergories-title">Things to know</div>
        <div className="pmp-faq flex justify-start align-center">
          <Imgc
            src={require(`assets/${productName}/ic_document_copy.svg`)}
            alt="faq"
            className="pmp-faq-icon"
          />
          <div>Frequently asked questions</div>
        </div>
        <ContactUs />
      </div>
    </Container>
  );
};

export default PrimaryMarketProducts;
