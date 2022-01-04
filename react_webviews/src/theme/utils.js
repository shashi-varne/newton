import Finitycolors from './finity';
import Fisdomcolors from './fisdom';
import partners from './partners';
import merge from 'lodash/merge';
import { getConfig } from '../utils/functions';

const productNameColorsMap = {
  finity: Finitycolors,
  fisdom: Fisdomcolors,
};
const getPartnerThemeData = () => {
  const config = getConfig();
  const partnerCode = config.code;
  const productName = config.productName;
  const mergedPartnerData = merge({}, productNameColorsMap[productName], partners[partnerCode]);
  const {colors,...partnerConfig} = mergedPartnerData;
  return {
    colors,
    partnerConfig,
  };
};

export default getPartnerThemeData;
