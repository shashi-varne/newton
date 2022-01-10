const calcLineHeight = (fontSize, factor) => `${fontSize * factor}px`;

const headerVariants = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
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

// for custom variants, we are passing the fontFamily with the variant config itself.
const baseTypographyConfig = (colors={}, partnerConfig={}) => ({
  heading1: {
    fontSize: 28,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Bold,
    lineHeight: calcLineHeight(28, headingTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  heading2: {
    fontSize: 22,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(22, headingTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  heading3: {
    fontSize: 18,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(18, headingTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  heading4: {
    fontSize: 16,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(16, headingTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body1: {
    fontSize: 14,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(14, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body2: {
    fontSize: 14,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(14, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body3: {
    fontSize: 12,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Bold,
    lineHeight: calcLineHeight(12, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body4: {
    fontSize: 12,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(12, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body5: {
    fontSize: 12,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(12, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body6: {
    fontSize: 10,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(10, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body7: {
    fontSize: 10,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(10, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body8: {
    fontSize: 16,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Regular,
    lineHeight: calcLineHeight(16, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  body9: {
    fontSize: 12,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: calcLineHeight(12, bodyTextFactor),
    fontFamily: partnerConfig?.fontFamily?.join(','),
  },
  actionText: {
    fontSize: 16,
    color: colors?.content?.primary,
    fontWeight: FONT_WEIGHT.Medium,
    lineHeight: '21px',
    fontFamily: partnerConfig?.fontFamily?.join(','),
    textTransform: 'uppercase'
  },
  // the below font family is for the MUI components.
  fontFamily: partnerConfig?.fontFamily?.join(','),
});

export default baseTypographyConfig;

export const customTypographyVariantProps = () => {
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

  const additionalVariants = [{
    props: {allCaps: true},
    style: {
      textTransform: 'uppercase'
    }
  }];
  mapper.push(...additionalVariants);
  return mapper;
};
