import { getConfig } from '../../utils/functions';
import Finitycolors from '../finity';
import Fisdomcolors from '../fisdom';
import partners from '../partners';
import { merge } from 'lodash';
const partnerCode = getConfig().code;
const productName = getConfig().productName;
const productNames = {
  finity: Finitycolors,
  fisdom: Fisdomcolors,
};
export const partnerConfig = merge(productNames[productName], partners[partnerCode]);

const colorConfig = partnerConfig?.colors;
export default colorConfig;
