import Finitycolors from './finity';
import Fisdomcolors from './fisdom';
import partners from './partners';
import { merge } from 'lodash';
import { getConfig } from '../utils/functions';

const getPartnerThemeData = () => {
  const productNames = {
    finity: Finitycolors(),
    fisdom: Fisdomcolors(),
  };
  const config = getConfig();
  const partnerCode = config.code;
  const productName = config.productName;
  const mergedPartnerData = merge(productNames[productName], partners[partnerCode]);
  const {colors,...partnerConfig} = mergedPartnerData;
  return {
    colors,
    partnerConfig,
  };
};

export default getPartnerThemeData;
