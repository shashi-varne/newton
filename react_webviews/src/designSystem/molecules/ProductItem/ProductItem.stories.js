import React from 'react';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import Typography from '../../atoms/Typography';
import Tag from '../Tag';
import ProductItem from './ProductItem';

export default {
  component: ProductItem,
  title: 'Molecules/ProductItem',
};

// const Template = (args) => <ProductItem {...args} />;

// export const WithDescription = Template.bind({});

// WithDescription.args = {
//   leftImgSrc: require('assets/amazon_pay.svg'),
//   headerTitle: 'I am the header',
//   headerTitleColor: 'foundationColors.content.primary',
//   bottomSectionData: {
//     tagOne: {
//       label: 'Equity',
//     },
//     tagTwo: {
//       label: 'Equity',
//     },
//   },
//   rightSectionData: {
//     description: {
//       title: 'Title',
//       titleColor: 'foundationColors.content.primary',
//       subtitle: 'Subtitle',
//       subtitleColor: 'foundationColors.content.tertiary',
//     },
//   },
// };

// export const WithCta = Template.bind({});

// WithCta.args = {
//   leftImgSrc: require('assets/amazon_pay.svg'),
//   headerTitle: 'I am the header',
//   headerTitleColor: 'foundationColors.content.primary',
//   bottomSectionData: {
//     tagOne: {
//       label: 'Equity',
//     },
//     titleOne: 'I am text',
//     titleOneColor: 'foundationColors.content.tertiary',
//   },
//   rightSectionData: {
//     btnProps: {
//         title: 'Cta',
//         onClick: () => {}
//     }
//   },
// };

export const WithDescription = (args) => {
  return (
    <ProductItem {...args} showSeparator imgSrc={require('assets/amazon_pay.svg')}>
      <ProductItem.LeftSection>
        <ProductItem.Title>ICICI Prudential Technology Direct Plan Growth</ProductItem.Title>
        <ProductItem.LeftBottomSection>
          <Tag label='Recommendation' />
          <Tag morningStarVariant='small' label={23} />
        </ProductItem.LeftBottomSection>
      </ProductItem.LeftSection>

      <ProductItem.RightSection>
        <ProductItem.Description
          title='+44%'
          titleColor='foundationColors.secondary.profitGreen.300'
        />
      </ProductItem.RightSection>
    </ProductItem>
  );
};

export const WithCta = (args) => {
  return (
    <ProductItem
      {...args}
      imgSrc={require('assets/amazon_pay.svg')}
      onClick={() => {
        console.log('card clicked');
      }}
    >
      <ProductItem.LeftSection>
        <ProductItem.Title>ICICI Prudential Technology Direct Plan Growth</ProductItem.Title>
        <ProductItem.LeftBottomSection>
          <Tag label='Recommendation' />
          <Typography variant='body2'>Label</Typography>
        </ProductItem.LeftBottomSection>
      </ProductItem.LeftSection>
      <ProductItem.RightSection>
        <Button
          title='+ADD'
          variant='link'
          onClick={(e) => {
            e.stopPropagation();
            console.log('hello');
          }}
        />
      </ProductItem.RightSection>
    </ProductItem>
  );
};

export const WithCtaText = (args) => {
  return (
    <ProductItem {...args} imgSrc={require('assets/amazon_pay.svg')}>
      <ProductItem.LeftSection>
        <ProductItem.Title>ICICI Prudential Technology Direct Plan Growth</ProductItem.Title>
        <ProductItem.LeftBottomSection>
          <Tag label='Recommendation' />
          <Tag morningStarVariant='large' label={23} />
        </ProductItem.LeftBottomSection>
      </ProductItem.LeftSection>
      <ProductItem.RightSection spacing={2}>
        <ProductItem.Description
          title='+44%'
          titleColor='foundationColors.secondary.profitGreen.300'
        />
        <Icon size='32px' src={require('assets/amazon_pay.svg')} />
      </ProductItem.RightSection>
    </ProductItem>
  );
};
