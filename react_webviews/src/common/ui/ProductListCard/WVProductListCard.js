/* 
example Data Object structure: 
dataObj: {
  amc_name: "Icici",
  fund_type: "Nifty Midcap",
  amc_logo: "...",
  rating: 4,
  expense_ratio_new: {value: '10%'},
  returns: '20%',
  tracking_error: '1.7%'
}

example Data Props Map:

DATA_PROP_MAP_LIST: [{
  title: 'Expense Ratio',
  propName: 'expense_ratio_new',
}, {
  title: 'Returns',
  propName: 'returns',
  formatter: (value) =>
    <span style={{ fontWeight: 'bold', color: 'limegreen' }}>
      {value.value} (new stuff)
    </span>
}, {
  title: 'Tracking Error',
  propName: 'tracking_error',
}]

Example Usage:
  <WVProductListCard
    productData={dataObj}
    title={dataObj.amc_name}
    subtitle={<CardSubtitle value={dataObj} />}
    image={dataObj.amc_logo}
    contentPropsMapList={DATA_PROP_MAP_LIST}
  />

  CardSubtitle = (obj) => <div>{obj.fund_type} | Heloo World</div>
*/
import './WVProductListCard.scss';
import React from 'react';
import Card from '../Card';
import { Imgc } from '../Imgc';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';

const WVProductListCard = ({
  handelClick,
  productData,
  title,
  subtitle,
  image,
  classes = {},
  children,
  contentPropsMapList,
}) => {
  return (
    <Card className={`wv-product-card ${classes.card}`}  onClick={handelClick}>
      <div className={`wv-product-card-header ${classes.header}`}>
        <div className={`wv-pch-title ${classes.headerTitle}`}>
          {title}
        </div>
        {image &&
          <Imgc
            className={`wv-pch-image ${classes.headerImage}`}
            alt=""
            src={image}
            style={{width: "40px" , minHeight: "40px"}}
          />
        }
      </div>
      {subtitle &&
        <div className={`wv-product-card-subheader ${classes.subheader}`}>
          {subtitle}
        </div>
      }
      {contentPropsMapList &&
        <div className={`wv-product-card-detail ${classes.detail}`}>
          {contentPropsMapList.map(propObj => (
            <div className="wv-pcd-item">
              <div className={`wv-pcdi-title ${classes.detailTitle}`}>
                {propObj.title}
              </div>
              <div className={`wv-pcdi-value ${classes.detailValue}`}>
                {isFunction(propObj?.formatter) ?
                  propObj.formatter(productData[propObj.propName]) :
                  productData[propObj.propName]
                }
              </div>
            </div>
          ))}
        </div>
      }
      {children &&
        <div className={`wv-product-card-children ${classes.children}`}>
          {children}
        </div>
      }
    </Card>
  );
}


WVProductListCard.propTypes = {
  productData: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  image: PropTypes.string,
  classes: PropTypes.exact({
    card: PropTypes.string,
    header: PropTypes.string,
    headerTitle: PropTypes.string,
    headerImage: PropTypes.string,
    subheader: PropTypes.string,
    detail: PropTypes.string,
    detailTitle: PropTypes.string,
    detailValue: PropTypes.string,
    children: PropTypes.string,
  }),
  children: PropTypes.node,
  contentPropsMapList: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.required,
    propName: PropTypes.string.required,
    formatter: PropTypes.func
  }))
};

WVProductListCard.defaultProps = {
  classes: {},
  handelClick: () => {},
};

export default WVProductListCard;