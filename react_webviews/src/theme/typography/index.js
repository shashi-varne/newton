import colorConfig from '../colors';
const calcLineHeight = (fontSize, factor) => `${fontSize * factor}px`;

const headerVariants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'body1',
  'body2',
  'body3',
  'body4',
  'body5',
  'body6',
  'body7',
];

export const FONT_WEIGHT = {
  Bold: 700,
  Medium: 500,
  Regular: 400,
};
const headingTextFactor = 1.3;
const bodyTextFactor = 1.6;
const baseTypographyConfig = {
  h1: {
    fontSize: 28,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Bold,
    lineHeight: calcLineHeight(28, headingTextFactor),
  },
  h2: {
    fontSize: 22,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(22, headingTextFactor),
  },
  h3: {
    fontSize: 18,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(18, headingTextFactor),
  },
  h4: {
    fontSize: 16,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(16, headingTextFactor),
  },
  body1: {
    fontSize: 14,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(14, bodyTextFactor),
  },
  body2: {
    fontSize: 14,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(14, bodyTextFactor),
  },
  body3: {
    fontSize: 12,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Bold,
    lineHeight: calcLineHeight(12, bodyTextFactor),
  },
  body4: {
    fontSize: 12,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(12, bodyTextFactor),
  },
  body5: {
    fontSize: 12,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(12, bodyTextFactor),
  },
  body6: {
    fontSize: 10,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(10, bodyTextFactor),
  },
  body7: {
    fontSize: 10,
    color: colorConfig?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(10, bodyTextFactor),
  },
};

export default baseTypographyConfig;

export const calcVariantFontWeight = () => {
  const mapper = [];
  // eslint-disable-next-line no-unused-expressions
  headerVariants?.forEach((header) => {
    const fontWeightKeys = Object.keys(FONT_WEIGHT);
    fontWeightKeys.forEach((el) => {
      const data = {
        props: { variant: header, weight: el },
        style: {
          fontWeight: FONT_WEIGHT[el],
        },
      };
      mapper.push(data);
    });
  });
  return mapper;
};
