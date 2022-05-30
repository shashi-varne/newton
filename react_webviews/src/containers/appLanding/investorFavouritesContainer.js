import React from "react";
import { INVESTER_FAVOURITES } from "businesslogic/constants/webAppLanding";
import InvestorFavorites from "../../pages/AppLanding/InvestorFavorites";
import { navigate as navigateFunc } from "../../utils/functions";

const screen = "INVESTOR_FAVORITES";
const investorFavoritesContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

  return <WrappedComponent investmentOptions={INVESTER_FAVOURITES} />;
};

export default investorFavoritesContainer(InvestorFavorites);
